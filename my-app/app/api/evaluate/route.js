// app/api/evaluate/route.js
import { NextResponse } from "next/server";
import supabase from "@/supabaseClient";
const fs = require("fs");
const path = require("path");

export async function POST(req) {
  try {
    const {
      user_id,
      username,
      contest_id,
      question_id,
      questionNumber,
      submitted_at,
      sql_mode,
      user_answer,
      ddl,
    } = await req.json();

    // console.log("here");

    // Step 1: Fetch correct actual_answer
    let questionRes = await fetch(
      `http://localhost:3000/api/get-question-answer`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question_id, contest_id }),
      }
    );

    let res = await questionRes.json();
    // console.log(res);
    let actual_answer = res.answer;
    if (!res.success) {
      return NextResponse.json(
        { success: false, error: "Failed to fetch correct answer" },
        { status: 400 }
      );
    }

    // Step 3: Execute user query
    let userRes = await fetch(`http://localhost:3000/api/execute-participant`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: user_answer, sql_mode, ddl }),
    });

    let userData = await userRes.json();
    if (!userData.success) {
      return NextResponse.json(
        {
          success: false,
          error: "User query execution failed",
          details: userData.error,
        },
        { status: 400 }
      );
    }

    let user_actual_answer = userData.data;

    let tmp_actual_answer = actual_answer;
    let tmp_user_csv_ans = [];
    let user_csv_ans = [];
    for (let i = 0; i < user_actual_answer.length; i++) {
      let row = user_actual_answer[i];
      user_csv_ans.push(Object.values(row).join(",").trim());
      tmp_user_csv_ans.push(Object.values(row).join(",").trim() + "\n");
    }

    actual_answer = actual_answer
      .trim()
      .split("\n")
      .map((line) => line.trim());

    let isCorrect = true;

    if (actual_answer.length != user_csv_ans.length) {
      isCorrect = false;
    } else {
      for (let i = 0; i < actual_answer.length; i++) {
        if (actual_answer[i] != user_csv_ans[i]) {
          isCorrect = false;
          break;
        }
      }
    }

    // console.log(userData.data);
    // console.log("ACTUAL ANSWER: ", actual_answer);
    // console.log("ACTUAL USER QUERY ANSWER: ", user_csv_ans);

    // Step 4: Compare
    // const isCorrect = JSON.stringify(actual_answer) === JSON.stringify(userData.data);
    // const isCorrect = actual_answer === user_csv_ans;
    // const isCorrect = true;
    let status = isCorrect ? "Accepted" : "Wrong Answer";

    // console.log(JSON.stringify(actual_answer));
    // console.log(JSON.stringify(userData.data));

    // Step 5: Insert submission
    const { error: insertError } = await supabase.from("Submissions").insert([
      {
        user_id,
        contest_id,
        question_id,
        submitted_at,
        sql_mode,
        user_answer,
        status,
      },
    ]);

    if (insertError) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to save submission",
          details: insertError.message,
        },
        { status: 500 }
      );
    }

    const logDir = path.join(__dirname, "submission_logs");

    // Make sure the folder exists
    // if (!fs.existsSync(logDir)) {
    //   fs.mkdirSync(logDir, { recursive: true });
    // }

    // const logFile = path.join(logDir, `${contest_id}.txt`);
    // maintain Log
    const logMessage = `====================================================================================================================================================================================\n${username} | ${questionNumber} | ${status} | ${sql_mode} | ${submitted_at}\n${tmp_user_csv_ans}\n${tmp_actual_answer}\n====================================================================================================================================================================================\n\n
    `;
    // fs.appendFile(logFile, logMessage, "utf8", (err) => {
    //   if (err) console.error("Error writing to log:", err);
    // });
    fs.appendFile(`${contest_id}.txt`, logMessage, "utf8", (err) => {
      if (err) console.error("Error writing to log:", err);
    });

    // Step 6: Return result
    return NextResponse.json({
      success: true,
      result: {
        status,
        correctResult: actual_answer,
        userResult: user_csv_ans,
      },
    });
  } catch (err) {
    console.error("Evaluation error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
