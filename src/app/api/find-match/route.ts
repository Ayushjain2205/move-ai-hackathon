import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const { currentIslanderId, gender } = await req.json();

    if (!currentIslanderId || !gender) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Find a potential match of the opposite gender who is single
    const { data, error } = await supabaseServer
      .from("islanders")
      .select("*")
      .eq("gender", gender)
      .eq("status", "single")
      .neq("id", currentIslanderId)
      .order("popularity", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error finding match:", error);
      return NextResponse.json(
        { error: "Failed to find match" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "No potential matches found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ match: data });
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
