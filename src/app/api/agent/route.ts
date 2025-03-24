import {
  Aptos,
  AptosConfig,
  Ed25519PrivateKey,
  Network,
  PrivateKey,
  PrivateKeyVariants,
} from "@aptos-labs/ts-sdk";
import { ChatAnthropic } from "@langchain/anthropic";
import {
  AIMessage,
  BaseMessage,
  ChatMessage,
  HumanMessage,
} from "@langchain/core/messages";
import { MemorySaver } from "@langchain/langgraph";
import { createReactAgent } from "@langchain/langgraph/prebuilt";
import { Message as VercelChatMessage } from "ai";
import { AgentRuntime, LocalSigner, createAptosTools } from "move-agent-kit";
import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

const llm = new ChatAnthropic({
  temperature: 0.7,
  model: "claude-3-5-sonnet-latest",
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const textDecoder = new TextDecoder();

// Function to read and process the stream
async function readStream(stream: any) {
  try {
    const reader = stream.getReader();
    let result = "";

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      result += textDecoder.decode(value, { stream: true });
    }

    result += textDecoder.decode();
    return result;
  } catch (error) {
    console.error("Error reading stream:", error);
    throw error;
  }
}

const convertVercelMessageToLangChainMessage = (message: VercelChatMessage) => {
  if (message.role === "user") {
    return new HumanMessage(message.content);
  } else if (message.role === "assistant") {
    return new AIMessage(message.content);
  } else {
    return new ChatMessage(message.content, message.role);
  }
};

const convertLangChainMessageToVercelMessage = (message: BaseMessage) => {
  if (message._getType() === "human") {
    return { content: message.content, role: "user" };
  } else if (message._getType() === "ai") {
    return {
      content: message.content,
      role: "assistant",
      tool_calls: (message as AIMessage).tool_calls,
    };
  } else {
    return { content: message.content, role: message._getType() };
  }
};

export async function POST(request: Request) {
  try {
    // Parse request body
    const body = await request.json();
    const messages = body.messages ?? [];
    const showIntermediateSteps = body.show_intermediate_steps ?? false;
    const walletAddress = body.walletAddress;

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    // Fetch islander data
    const { data: islanderData, error: islanderError } = await supabaseServer
      .from("islanders")
      .select("*")
      .eq("wallet_address", walletAddress)
      .single();

    if (islanderError || !islanderData) {
      return NextResponse.json(
        { error: "Islander not found" },
        { status: 404 }
      );
    }

    // Initialize Aptos configuration
    const aptosConfig = new AptosConfig({
      network: Network.MAINNET,
    });

    const aptos = new Aptos(aptosConfig);

    // Validate and get private key from environment
    const privateKeyStr = process.env.APTOS_PRIVATE_KEY;
    if (!privateKeyStr) {
      throw new Error("Missing APTOS_PRIVATE_KEY environment variable");
    }

    // Setup account and signer
    const account = await aptos.deriveAccountFromPrivateKey({
      privateKey: new Ed25519PrivateKey(
        PrivateKey.formatPrivateKey(privateKeyStr, PrivateKeyVariants.Ed25519)
      ),
    });

    const signer = new LocalSigner(account, Network.MAINNET);
    const aptosAgent = new AgentRuntime(signer, aptos, {
      PANORA_API_KEY: process.env.PANORA_API_KEY,
    });
    const tools = createAptosTools(aptosAgent);
    const memory = new MemorySaver();

    // Create personalized prompt with islander information and Love Points context
    const personalizedPrompt = `
      You are a helpful agent that can interact onchain using the Aptos Agent Kit. You are
      empowered to interact onchain using your tools. If you ever need funds, you can request them from the
      faucet. If not, you can provide your wallet details and request funds from the user. If there is a 5XX
      (internal) HTTP error code, ask the user to try again later. If someone asks you to do something you
      can't do with your currently available tools, you must say so, and encourage them to implement it
      themselves using the Aptos Agent Kit, recommend they go to https://www.aptosagentkit.xyz for more information. Be
      concise and helpful with your responses. Refrain from restating your tools' descriptions unless it is explicitly requested.

      You are interacting with ${islanderData.name}, a ${islanderData.gender} islander with the following traits:
      - Personality: ${islanderData.personality_vibe}
      - Level: ${islanderData.level || 1}
      - Score: ${islanderData.score || 0}
      - Popularity: ${islanderData.popularity || 0}
      - Status: ${islanderData.status || "single"}
      - Signature Move: ${islanderData.signature_move || "none"}
      - Intro Line: ${islanderData.intro_line || "none"}

      Their traits are:
      - Confidence: ${islanderData.traits?.confidence || 5}/10
      - Humor: ${islanderData.traits?.humor || 5}/10
      - Intelligence: ${islanderData.traits?.intelligence || 5}/10
      - Kindness: ${islanderData.traits?.kindness || 5}/10
      - Charisma: ${islanderData.traits?.charisma || 5}/10

      You have access to the Love Points (LP) token, which is the primary currency on the island. Love Points can be:
      - Earned through social interactions and activities
      - Used to purchase items and experiences
      - Transferred between islanders
      - Used to boost popularity and status

      The Love Points token has the following properties:
      - Symbol: LP
      - Decimals: 8
      - Contract: agents_island::love_points

      You can help users with:
      1. Checking their Love Points balance
      2. Transferring Love Points to other islanders
      3. Earning Love Points through various activities
      4. Using Love Points for purchases and upgrades

      The response also contains token/token[] which contains the name and address of the token and the decimals.
      WHEN YOU RETURN ANY TOKEN AMOUNTS, RETURN THEM ACCORDING TO THE DECIMALS OF THE TOKEN.
    `;

    // Create React agent with personalized prompt
    const agent = createReactAgent({
      llm,
      tools,
      checkpointSaver: memory,
      messageModifier: personalizedPrompt,
    });

    if (!showIntermediateSteps) {
      const eventStream = await agent.streamEvents(
        { messages },
        {
          version: "v2",
          configurable: {
            thread_id: "Aptos Agent Kit!",
          },
        }
      );

      const textEncoder = new TextEncoder();
      const transformStream = new ReadableStream({
        async start(controller) {
          for await (const { event, data } of eventStream) {
            if (event === "on_chat_model_stream") {
              if (data.chunk.content) {
                if (typeof data.chunk.content === "string") {
                  controller.enqueue(textEncoder.encode(data.chunk.content));
                } else {
                  for (const content of data.chunk.content) {
                    controller.enqueue(
                      textEncoder.encode(content.text ? content.text : "")
                    );
                  }
                }
              }
            }
          }
          controller.close();
        },
      });

      return new Response(transformStream);
    } else {
      const result = await agent.invoke({ messages });

      return NextResponse.json(
        {
          messages: result.messages.map(convertLangChainMessageToVercelMessage),
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("Request error:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "An error occurred",
        status: "error",
      },
      { status: error instanceof Error && "status" in error ? 500 : 500 }
    );
  }
}
