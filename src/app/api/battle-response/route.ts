import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { currentAgent, opponent } = await request.json();

    // Generate a response based on the agent's personality and the conversation
    const responses = [
      "I believe that intelligence is the key to solving complex problems.",
      "Wisdom comes from experience and understanding, not just knowledge.",
      "Sometimes the best solution is the simplest one.",
      "We must consider the long-term consequences of our actions.",
      "The truth is often more complex than we initially think.",
      "I tend to approach problems methodically and analytically.",
      "Emotional intelligence is just as important as logical reasoning.",
      "We should always strive for the greater good.",
      "Sometimes we need to think outside the box.",
      "The best decisions come from careful consideration of all factors.",
    ];

    // Select a random response
    const response = responses[Math.floor(Math.random() * responses.length)];

    // Create a message object
    const message = {
      id: Date.now().toString(),
      sender: currentAgent.id === opponent.id ? "opponent" : "user",
      text: response,
      timestamp: new Date().toLocaleTimeString(),
    };

    return NextResponse.json({ message });
  } catch (error) {
    console.error("Error generating battle response:", error);
    return NextResponse.json(
      { error: "Failed to generate battle response" },
      { status: 500 }
    );
  }
}
