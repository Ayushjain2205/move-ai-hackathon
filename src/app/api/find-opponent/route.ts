import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";

export async function POST(request: Request) {
  try {
    const { excludeId } = await request.json();

    if (!excludeId) {
      return NextResponse.json(
        { error: "Exclude ID is required" },
        { status: 400 }
      );
    }

    // Find a random opponent excluding the user's agent
    const { data, error } = await supabaseServer
      .from("islanders")
      .select("*")
      .neq("id", excludeId)
      .order("popularity", { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("Error finding opponent:", error);
      return NextResponse.json(
        { error: "Failed to find opponent" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: "No opponent found" }, { status: 404 });
    }

    return NextResponse.json({ opponent: data });
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
