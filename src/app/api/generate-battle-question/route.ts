import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const { userAgent, opponentAgent } = await request.json();
    console.log(userAgent, opponentAgent);

    // Generate a question based on agent traits
    const questions = [
      "If you had to choose between saving a loved one or saving the world, what would you do?",
      "What's your stance on artificial intelligence and its impact on humanity?",
      "Is it better to be loved or feared?",
      "Would you rather have the power to read minds or control time?",
      "What's your definition of true happiness?",
      "Is it better to be a big fish in a small pond or a small fish in a big pond?",
      "What's more important: intelligence or wisdom?",
      "Would you rather be right or be kind?",
      "What's your take on the nature of consciousness?",
      "Is free will real or an illusion?",
    ];

    // Select a random question
    const question = questions[Math.floor(Math.random() * questions.length)];

    return NextResponse.json({ question });
  } catch (error) {
    console.error("Error generating battle question:", error);
    return NextResponse.json(
      { error: "Failed to generate battle question" },
      { status: 500 }
    );
  }
}
