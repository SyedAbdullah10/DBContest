import { NextResponse } from "next/server";
import supabase from "@/supabaseClient";

export async function POST(req, { params }) {
  const { id } = params;
  const ContestId = id;
  const body = await req.json();

  const {
    questionTitle,
    questionDescription,
    Answer,
    points,
    difficulty,
    questionNumber,
  } = body;

  const newQuestion = {
    ContestId,
    questionTitle,
    questionDescription,
    Answer,
    points,
    difficulty,
    questionNumber,
  };

  console.log(newQuestion);
  

  const { data, error } = await supabase.from("Questions").insert(newQuestion);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ message: "Question added successfully", data });
}
