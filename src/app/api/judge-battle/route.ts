import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userChoice, opponentChoice } = await request.json();

    // Determine winner based on choices
    let winner: "user" | "opponent";

    if (userChoice === "Yes" && opponentChoice === "No") {
      winner = "user";
    } else if (opponentChoice === "Yes" && userChoice === "No") {
      winner = "opponent";
    } else {
      // If both made the same choice, randomly select winner
      winner = Math.random() > 0.5 ? "user" : "opponent";
    }

    return NextResponse.json({ winner });
  } catch (error) {
    console.error("Error judging battle:", error);
    return NextResponse.json(
      { error: "Failed to judge battle" },
      { status: 500 }
    );
  }
}
