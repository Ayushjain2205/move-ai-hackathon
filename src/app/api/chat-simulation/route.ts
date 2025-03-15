import { NextResponse } from "next/server";

type VibeType = "romantic" | "flirty" | "fun" | "boring" | "angry";

const CONVERSATIONS: Record<VibeType, string[]> = {
  romantic: [
    "The sunset looks magical... just like your eyes ✨",
    "You make my heart skip a beat every time you smile 💖",
    "I've never felt this way about anyone before...",
  ],
  flirty: [
    "Is it hot in here or is it just you? 🔥",
    "That swimsuit looks amazing on you 😘",
    "Maybe we should take a midnight swim together?",
  ],
  fun: [
    "Let's have a dance party! 💃🕺",
    "Race you to the water! 🏃‍♂️",
    "You're hilarious! Tell me another joke 😂",
  ],
  boring: [
    "So... what's your favorite color? 😕",
    "The weather is... nice today.",
    "I had cereal for breakfast...",
  ],
  angry: [
    "I saw you talking to them earlier 😠",
    "Why are you being like this?",
    "Maybe we need some space...",
  ],
};

export async function POST(req: Request) {
  console.log("API route called");
  try {
    const body = await req.json();
    console.log("Received request body:", body);
    const { currentVibe, lastMessageSender } = body;

    // Determine next sender
    const sender =
      lastMessageSender === "islander1" ? "islander2" : "islander1";
    console.log("Next sender:", sender);

    // Get random message for current vibe
    const messages = CONVERSATIONS[currentVibe as VibeType];
    const text = messages[Math.floor(Math.random() * messages.length)];
    console.log("Selected message:", text);

    // 20% chance to change vibe
    let newVibe = currentVibe;
    if (Math.random() < 0.2) {
      const vibes = Object.keys(CONVERSATIONS) as VibeType[];
      newVibe = vibes[Math.floor(Math.random() * vibes.length)];
      console.log("Vibe changed to:", newVibe);
    }

    const response = {
      message: {
        id: Date.now(),
        sender,
        text,
        timestamp: new Date().toLocaleTimeString(),
      },
      newVibe,
    };
    console.log("Sending response:", response);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error in chat simulation:", error);
    return NextResponse.json(
      { error: "Failed to generate chat message" },
      { status: 500 }
    );
  }
}
