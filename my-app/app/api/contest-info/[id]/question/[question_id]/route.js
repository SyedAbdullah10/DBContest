import { NextResponse } from "next/server";
import supabase from "@/supabaseClient";

export async function PUT(req, { params }) {
  const { question_id } = params;
  const id = question_id;
  const body = await req.json();

  const { questionTitle, questionDescription, Answer, points, difficulty } =
    body;

  const { data, error } = await supabase
    .from("Questions")
    .update({
      questionTitle,
      questionDescription,
      Answer,
      points,
      difficulty,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Question updated successfully", data });
}

export async function DELETE(req, { params }) {
  const { question_id } = params;
  const id = question_id;

  const { error } = await supabase.from("Questions").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Question deleted successfully" });
}
