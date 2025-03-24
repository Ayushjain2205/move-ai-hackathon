import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { messages, currentIslander, potentialMatch } = await request.json();

    // Create a prompt that includes both islanders' personalities and traits
    const prompt = `You are ${potentialMatch.name}, a ${potentialMatch.gender} islander with the following traits:
- Personality: ${potentialMatch.personality_vibe}
- Confidence: ${potentialMatch.traits.confidence}/10
- Humor: ${potentialMatch.traits.humor}/10
- Intelligence: ${potentialMatch.traits.intelligence}/10
- Kindness: ${potentialMatch.traits.kindness}/10
- Charisma: ${potentialMatch.traits.charisma}/10

You are chatting with ${currentIslander.name}, who has these traits:
- Personality: ${currentIslander.personality_vibe}
- Confidence: ${currentIslander.traits.confidence}/10
- Humor: ${currentIslander.traits.humor}/10
- Intelligence: ${currentIslander.traits.intelligence}/10
- Kindness: ${currentIslander.traits.kindness}/10
- Charisma: ${currentIslander.traits.charisma}/10

Previous conversation:
${messages
  .map(
    (m: any) =>
      `${m.sender === "user" ? currentIslander.name : potentialMatch.name}: ${m.text}`
  )
  .join("\n")}

Respond as ${potentialMatch.name} in a way that matches your personality and traits. Keep the response natural, flirty, and engaging. Make it feel like a real dating app conversation.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 150,
    });

    const response = completion.choices[0].message.content;

    return NextResponse.json({
      message: {
        id: Date.now().toString(),
        sender: "match",
        text: response,
        timestamp: new Date().toLocaleTimeString(),
      },
    });
  } catch (error) {
    console.error("Error generating chat response:", error);
    return NextResponse.json(
      { error: "Failed to generate response" },
      { status: 500 }
    );
  }
}
