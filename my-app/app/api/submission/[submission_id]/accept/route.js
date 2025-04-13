// app/api/submission/[submission_id]/accept/route.js

import { NextResponse } from "next/server";
import supabase from "@/supabaseClient";

export async function POST(req, { params }) {
  const { submission_id } = params;

  if (!submission_id) {
    return NextResponse.json({ error: "Submission ID is required" }, { status: 400 });
  }

  try {
    const { data, error } = await supabase
      .from("Submissions") // Replace with your actual table name
      .update({ status: "Accepted" })
      .eq("submission_id", submission_id)
      .single();

    if (error) throw error;

    return NextResponse.json({ message: "Submission accepted", data }, { status: 200 });
  } catch (err) {
    console.error("Supabase update error:", err.message);
    return NextResponse.json({ error: "Failed to update submission" }, { status: 500 });
  }
}
