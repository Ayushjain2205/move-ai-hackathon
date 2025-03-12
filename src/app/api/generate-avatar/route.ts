import { NextResponse } from "next/server";

const REPLICATE_API_TOKEN = process.env.REPLICATE_API_TOKEN;

export async function POST(req: Request) {
  if (!REPLICATE_API_TOKEN) {
    return NextResponse.json(
      { error: "REPLICATE_API_TOKEN is not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await req.json();
    const {
      gender,
      appearance: { faceShape, skinTone, hairStyle, hairColor, outfitStyle },
      personalityVibe,
    } = body;

    // Updated prompt for the minimax model
    const prompt = `A close-up portrait of a ${gender} human character with ${hairStyle} ${hairColor} hair, 
      ${skinTone} skin tone, and ${faceShape} face shape. They are wearing ${outfitStyle} beach/summer clothing 
      and have a ${personalityVibe} expression. The style is cute and fun, like a modern game character, 
      with bright eyes and vibrant colors. Set against a soft, tropical paradise background.`;

    // Call Replicate API with minimax/image-01 model
    const output = await fetch(
      "https://api.replicate.com/v1/models/minimax/image-01/predictions",
      {
        method: "POST",
        headers: {
          Authorization: `Token ${REPLICATE_API_TOKEN}`,
          "Content-Type": "application/json",
          Prefer: "wait", // This will make the API wait for the result
        },
        body: JSON.stringify({
          input: {
            prompt: prompt,
            aspect_ratio: "3:4", // Better for portrait-style images
          },
        }),
      }
    );

    if (!output.ok) {
      throw new Error(`HTTP error! status: ${output.status}`);
    }

    const result = await output.json();

    // Since we're using 'Prefer: wait', the result should be ready
    if (result.error) {
      throw new Error(result.error);
    }

    return NextResponse.json({
      status: "succeeded",
      output: result.output,
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to generate avatar" },
      { status: 500 }
    );
  }
}
