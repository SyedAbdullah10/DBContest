// File: app/api/contests/route.js
import supabase from "@/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();
    console.log(data);

    // Extract data from the request
    const {
      contestName,
      startTime,
      endTime,
      contestPassword,
      ddlContent,
      questions,
    } = data;

    // Validate required fields
    if (!contestName || !startTime || !endTime || !contestPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    // Insert contest into Supabase
    const { data: contestData, error: contestError } = await supabase
      .from("Contests")
      .insert({
        name: contestName,
        startTime: startTime,
        endTime: endTime,
        password: contestPassword,
        oracle_ddl: ddlContent.oraclesql || "",
        mysql_ddl: ddlContent.mysql || "",
        postgresql_ddl: ddlContent.postgresql || "",
      })
      .select()
      .single();

    if (contestError) {
      console.error("Error inserting contest:", contestError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create contest",
          error: contestError.message,
        },
        { status: 500 }
      );
    }

    // If questions are provided, insert them with reference to contest
    if (questions && questions.length > 0 && contestData.id) {
      // Map questions array to match your Questions table schema
      const questionsWithContestId = questions.map((q) => ({
        questionNumber: q.number,
        questionTitle: q.title,
        questionDescription: q.description,
        difficulty: q.difficulty,
        Answer: q.answer,
        ContestId: contestData.id,
        points: q.points,
      }));

      const { error: questionsError } = await supabase
        .from("Questions") // Using the exact table name
        .insert(questionsWithContestId);

      if (questionsError) {
        console.error("Error inserting questions:", questionsError);
        // We don't want to fail the entire request if questions fail
        // but we do want to report it
        return NextResponse.json(
          {
            success: true,
            message: "Contest created but failed to add some questions",
            contestId: contestData.id,
            questionError: questionsError.message,
          },
          { status: 207 }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Contest created successfully",
        contestId: contestData.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
