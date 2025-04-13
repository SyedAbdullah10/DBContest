// app/api/get-question-answer/route.js
import { NextResponse } from "next/server";
import supabase from "@/supabaseClient";

export async function POST(req) {
  const { question_id, contest_id } = await req.json();

  const { data, error } = await supabase
    .from("questions")
    .select("answer")
    .eq("question_id", question_id)
    .eq("contest_id", contest_id)
    .single();

  if (error || !data) {
    return NextResponse.json({ success: false, error: "Question not found." }, { status: 400 });
  }

  return NextResponse.json({ success: true, answer: data.answer });
}
