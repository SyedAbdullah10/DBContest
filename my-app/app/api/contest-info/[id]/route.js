import supabase from "@/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(req) {
  const url = new URL(req.url);
  const contestId = url.pathname.split("/").pop(); // gets the last part of the URL
  console.log(contestId);
  

  // Fetch contest info
  const { data: contest, error: contestError } = await supabase
    .from("Contests")
    .select(
      "id, name, startTime, endTime, mysql_ddl, oracle_ddl, postgresql_ddl"
    )
    .eq("id", contestId)
    .single();

  if (contestError || !contest) {
    return NextResponse.json({ error: "Contest not found" }, { status: 404 });
  }

  // Fetch related questions using ContestId foreign key
  const { data: questions, error: questionsError } = await supabase
    .from("Questions")
    .select(
      "id, questionTitle, questionDescription, difficulty, Answer, points"
    )
    .eq("ContestId", contestId);

  if (questionsError) {
    return NextResponse.json(
      { error: "Error fetching questions" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    contest,
    questions,
  });
}
