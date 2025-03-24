import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // We still parse the request to maintain the same interface
    await req.json();

    // Return mock data with output as an array to match the real API
    return NextResponse.json({
      status: "succeeded",
      output: [
        "https://replicate.delivery/xezq/XFDAVS1p53YnN527ERWP3Pk2t0YmRtJkUJMZtx0fjckyWYMKA/tmpa38b5u3f.jpg",
      ],
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to generate avatar" },
      { status: 500 }
    );
  }
}
