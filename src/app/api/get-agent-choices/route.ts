import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { userAgent, opponentAgent, question, messages } =
      await request.json();

    if (!userAgent || !opponentAgent || !question || !messages) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Generate choices for both agents
    const prompt = `Based on the debate about "${question}", generate final choices for both agents:

User Agent (${userAgent.name}):
- Intelligence: ${userAgent.traits.intelligence}
- Intuition: ${userAgent.traits.intuition}
- Adaptability: ${userAgent.traits.adaptability}

Opponent Agent (${opponentAgent.name}):
- Intelligence: ${opponentAgent.traits.intelligence}
- Intuition: ${opponentAgent.traits.intuition}
- Adaptability: ${opponentAgent.traits.adaptability}

Debate history:
${messages.map((m: any) => `${m.sender === "userAgent" ? userAgent.name : opponentAgent.name}: ${m.text}`).join("\n")}

Generate choices that:
1. Are logical based on the debate
2. Reflect each agent's traits
3. Are different from each other
4. Are one of the two options from the question

Format: Return a JSON object with "userChoice" and "opponentChoice" fields.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content:
            "You are an AI that generates logical choices for agents based on their debate.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 100,
    });

    const choices = JSON.parse(completion.choices[0]?.message?.content || "{}");

    if (!choices.userChoice || !choices.opponentChoice) {
      throw new Error("Failed to generate choices");
    }

    return NextResponse.json(choices);
  } catch (error) {
    console.error("Error generating agent choices:", error);
    return NextResponse.json(
      { error: "Failed to generate agent choices" },
      { status: 500 }
    );
  }
}
