import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const { formData, walletAddress } = await req.json();
    console.log("Received request:", { formData, walletAddress });

    if (!formData || !walletAddress) {
      console.log("Missing required fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Extract the actual wallet address string
    let address: string | undefined;

    if (typeof walletAddress === "string") {
      address = walletAddress;
    } else if (walletAddress.address) {
      address = walletAddress.address;
    } else if (walletAddress.data) {
      // Convert the byte array to a hex string
      const bytes = Object.values(walletAddress.data) as number[];
      address =
        "0x" + bytes.map((b) => b.toString(16).padStart(2, "0")).join("");
    }

    console.log("Extracted address:", address);

    if (!address) {
      console.log("Invalid wallet address");
      return NextResponse.json(
        { error: "Invalid wallet address" },
        { status: 400 }
      );
    }

    // First, store the avatar image in Supabase Storage
    const avatarUrl = formData.avatarUrl;
    console.log("Avatar URL:", avatarUrl);

    if (!avatarUrl) {
      console.log("Missing avatar URL");
      return NextResponse.json(
        { error: "Missing avatar URL" },
        { status: 400 }
      );
    }

    try {
      // Download the image from the provided URL
      const imageResponse = await fetch(avatarUrl);
      if (!imageResponse.ok) {
        throw new Error(`Failed to fetch image: ${imageResponse.statusText}`);
      }
      const imageBlob = await imageResponse.blob();
      console.log("Image blob size:", imageBlob.size);

      // Upload to Supabase Storage
      const sanitizedWalletAddress = address.replace(/[^a-zA-Z0-9]/g, "_");
      const fileName = `${sanitizedWalletAddress}/${Date.now()}.jpg`;
      console.log("Uploading to path:", fileName);

      const { data: uploadData, error: uploadError } =
        await supabaseServer.storage
          .from("islander-avatars")
          .upload(fileName, imageBlob, {
            contentType: "image/jpeg",
            upsert: true,
          });

      if (uploadError) {
        console.error("Error uploading image:", uploadError);
        return NextResponse.json(
          { error: `Failed to upload avatar: ${uploadError.message}` },
          { status: 500 }
        );
      }

      console.log("Upload successful:", uploadData);

      // Get the public URL for the uploaded image
      const {
        data: { publicUrl },
      } = supabaseServer.storage
        .from("islander-avatars")
        .getPublicUrl(fileName);
      console.log("Public URL:", publicUrl);

      // Store the Islander data in the database
      const { data, error } = await supabaseServer
        .from("islanders")
        .insert([
          {
            wallet_address: address,
            name: formData.name,
            gender: formData.gender,
            personality_vibe: formData.personalityVibe,
            appearance: formData.appearance,
            traits: formData.traits,
            signature_move: formData.signatureMove,
            intro_line: formData.introLine,
            avatar_url: publicUrl,
            created_at: new Date().toISOString(),
            status: "single",
            score: 0,
            popularity: 0,
            last_active: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) {
        console.error("Error creating islander:", error);
        return NextResponse.json(
          { error: `Failed to create islander: ${error.message}` },
          { status: 500 }
        );
      }

      console.log("Islander created successfully:", data);
      return NextResponse.json({ data });
    } catch (error: any) {
      console.error("Error in image processing:", error);
      return NextResponse.json(
        {
          error: `Image processing error: ${error.message || "Unknown error"}`,
        },
        { status: 500 }
      );
    }
  } catch (error: any) {
    console.error("Error in request processing:", error);
    return NextResponse.json(
      {
        error: `Request processing error: ${error.message || "Unknown error"}`,
      },
      { status: 500 }
    );
  }
}
