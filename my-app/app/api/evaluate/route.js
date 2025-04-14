// app/api/evaluate/route.js
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const {
      user_id,
      contest_id,
      question_id,
      submitted_at,
      sql_mode,
      user_answer,
      dbType,
      ddl,
    } = await req.json();

    // Step 1: Fetch correct answer
    const questionRes = await fetch(`/api/get-question-answer`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question_id, contest_id }),
    });

    const questionData = await questionRes.json();
    if (!questionData.success) {
      return NextResponse.json({ success: false, error: "Failed to fetch correct answer" }, { status: 400 });
    }

    const correctQuery = questionData.answer;

    // Step 2: Execute correct query
    const correctRes = await fetch(`/api/execute`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: correctQuery, dbType, ddl }),
    });

    const correctData = await correctRes.json();
    if (!correctData.success) {
      return NextResponse.json({ success: false, error: "Correct answer execution failed", details: correctData.error }, { status: 400 });
    }

    // Step 3: Execute user query
    const userRes = await fetch(`/api/execute-participant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: user_answer, dbType, ddl }),
    });

    const userData = await userRes.json();
    if (!userData.success) {
      // Save the submission as Wrong Answer immediately
      await supabase.from("Submissions").insert([{
        user_id,
        contest_id,
        question_id,
        submitted_at,
        sql_mode,
        user_answer,
        status: "Wrong Answer"
      }]);

      return NextResponse.json({ success: false, error: "User query execution failed", details: userData.error }, { status: 400 });
    }

    // Step 4: Compare
    const isCorrect = JSON.stringify(correctData.data) === JSON.stringify(userData.data);
    const status = isCorrect ? "Accepted" : "Wrong Answer";

    // Step 5: Insert submission
    const { error: insertError } = await supabase.from("Submissions").insert([{
      user_id,
      contest_id,
      question_id,
      submitted_at,
      sql_mode,
      user_answer,
      status
    }]);

    if (insertError) {
      return NextResponse.json({ success: false, error: "Failed to save submission", details: insertError.message }, { status: 500 });
    }

    // Step 6: Return result
    return NextResponse.json({
      success: true,
      result: {
        status,
        isCorrect,
        correctResult: correctData.data,
        userResult: userData.data
      }
    });
  } catch (err) {
    console.error("Evaluation error:", err);
    return NextResponse.json({ success: false, error: "Internal server error" }, { status: 500 });
  }
}
