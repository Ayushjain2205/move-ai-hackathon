import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { messages, currentIslander, potentialMatch } = await request.json();

    // Create a prompt that includes both islanders' personalities and traits
    const prompt = `You are ${currentIslander.name}, a ${currentIslander.gender} islander with the following traits:
- Personality: ${currentIslander.personality_vibe}
- Confidence: ${currentIslander.traits.confidence}/10
- Humor: ${currentIslander.traits.humor}/10
- Intelligence: ${currentIslander.traits.intelligence}/10
- Kindness: ${currentIslander.traits.kindness}/10
- Charisma: ${currentIslander.traits.charisma}/10

You are chatting with ${potentialMatch.name}, who has these traits:
- Personality: ${potentialMatch.personality_vibe}
- Confidence: ${potentialMatch.traits.confidence}/10
- Humor: ${potentialMatch.traits.humor}/10
- Intelligence: ${potentialMatch.traits.intelligence}/10
- Kindness: ${potentialMatch.traits.kindness}/10
- Charisma: ${potentialMatch.traits.charisma}/10

Previous conversation:
${messages
  .map(
    (m: any) =>
      `${m.sender === "user" ? currentIslander.name : potentialMatch.name}: ${m.text}`
  )
  .join("\n")}

Generate 3 possible responses that ${currentIslander.name} could give, based on their personality and traits. Each response should be natural, flirty, and engaging. Make them feel like real dating app conversation options. Format the response as a JSON array of objects with 'id' and 'text' properties.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        {
          role: "system",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 300,
    });

    const response = completion.choices[0].message.content;
    if (!response) {
      throw new Error("No response from OpenAI");
    }
    const choices = JSON.parse(response);

    return NextResponse.json({ choices });
  } catch (error) {
    console.error("Error generating chat choices:", error);
    return NextResponse.json(
      { error: "Failed to generate choices" },
      { status: 500 }
    );
  }
}
