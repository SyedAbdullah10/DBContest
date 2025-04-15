// app/api/submission/[submission_id]/accept/route.js

import { NextResponse } from "next/server";
import supabase from "@/supabaseClient";

export async function POST(req, { params }) {
  const { submission_id } = params;
  const body = await req.json();
  const { status } = body;

  if (!submission_id || !status) {
    return NextResponse.json(
      { error: "Submission ID and status are required" },
      { status: 400 }
    );
  }

  try {
    const { data, error } = await supabase
      .from("Submissions") 
      .update({ status })
      .eq("submission_id", submission_id)
      .single();

    if (error) throw error;

    return NextResponse.json(
      { message: `Submission updated to ${status}`, data },
      { status: 200 }
    );
  } catch (err) {
    console.error("Supabase update error:", err.message);
    return NextResponse.json(
      { error: "Failed to update submission" },
      { status: 500 }
    );
  }
}
