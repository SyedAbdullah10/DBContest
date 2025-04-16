import { NextResponse } from "next/server";
import supabase from "@/supabaseClient";

export async function POST(req) {
  const { user_id, contest_id } = await req.json();

  console.log(user_id, contest_id);

  const { data, error } = await supabase
    .from("Submissions")
    .select(
      `
      user_id,
      contest_id,
      question_id,
      status,
      submitted_at,
      user_answer,
      sql_mode,
      Questions (
        questionTitle,
        points,
        questionNumber,
        difficulty
      )
    `
    )
    .eq("user_id", user_id)
    .eq("contest_id", contest_id)
    .order("status", { ascending: true })

  if (error) {
    console.error("Error fetching submissions:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch submissions." },
      { status: 400 }
    );
  }

  const submissions = data.map((sub) => ({
    question_id: sub.question_id,
    status: sub.status,
    answer: sub.answer,
    submitted_at: sub.submitted_at,
    sql_mode: sub.sql_mode,
    user_answer: sub.user_answer,
    title: sub.Questions?.title,
    points: sub.Questions?.points,
    questionNumber: sub.Questions?.questionNumber,
    difficulty: sub.Questions?.difficulty,
    questionTitle: sub.Questions?.questionTitle,
  }));

  return NextResponse.json({ success: true, submissions });
}
