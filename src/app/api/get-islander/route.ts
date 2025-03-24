import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const walletAddress = searchParams.get("walletAddress");

    if (!walletAddress) {
      return NextResponse.json(
        { error: "Wallet address is required" },
        { status: 400 }
      );
    }

    // Fetch islander data from Supabase
    const { data, error } = await supabaseServer
      .from("islanders")
      .select("*")
      .eq("wallet_address", walletAddress)
      .single();

    if (error) {
      console.error("Error fetching islander:", error);
      return NextResponse.json(
        { error: "Failed to fetch islander data" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Islander not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(data);
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
