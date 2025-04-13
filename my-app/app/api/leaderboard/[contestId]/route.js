// File: app/api/leaderboard/[contestId]/route.js
import supabase from "@/supabaseClient";
import { NextResponse } from "next/server";

export async function GET(request, { params }) {
  try {
    const { contestId } = await params;

    // Validate contestId
    if (!contestId) {
      return NextResponse.json(
        { error: "Invalid contest ID" },
        { status: 400 }
      );
    }

    // 1. Get contest details to confirm it exists
    const { data: contestData, error: contestError } = await supabase
      .from("Contests")
      .select("id, name, startTime, endTime")
      .eq("id", contestId)
      .single();

    if (contestError || !contestData) {
      return NextResponse.json({ error: "Contest not found" }, { status: 404 });
    }

    // 2. Get all questions for this contest
    const { data: questions, error: questionsError } = await supabase
      .from("Questions")
      .select("id, questionNumber, questionTitle, points, difficulty")
      .eq("ContestId", contestId)
      .order("questionNumber", { ascending: true });

    if (questionsError) {
      return NextResponse.json(
        { error: "Failed to fetch contest questions" },
        { status: 500 }
      );
    }

    
    let { data: allSubmissions, error: allSubmissionsError } =
      await supabase.rpc("get_sorted_submissions_by_contest", {
        contest_id_input: contestId,
      });

    console.log(allSubmissions);

    allSubmissions = allSubmissions.map((s) => {
      return {
        submission_id: s.submission_id,
        question_id: s.question_id,
        user_id: s.user_id,
        user_answer: s.user_answer,
        status: s.status,
        submitted_at: s.submitted_at,
        sql_mode: s.sql_mode,
        Users: {
          id: s.user_id,
          name: s.user_name,
          username: s.user_username,
        },
      };
    });

    if (allSubmissionsError) {
      console.log("Cleaned Submission Error: ", allSubmissionsError);

      // if (submissionsError) {
      return NextResponse.json(
        { error: "Failed to fetch submissions" },
        { status: 500 }
      );
    }

    allSubmissions.map((s) => {
      s.submitted_at = s.submitted_at.split("|").join("");
      return;
    });

    // 4. Process submissions to create the leaderboard
    const userMap = new Map();
    const firstSolvedMap = new Map();

    // Initialize the map of users and their submissions
    allSubmissions.forEach((submission) => {
      const userId = submission.user_id;
      const questionId = submission.question_id;
      const user = submission.Users;

      if (!userMap.has(userId)) {
        userMap.set(userId, {
          id: userId,
          name: user.name,
          username: user.username,
          score: 0, // Number of accepted solutions
          penalty: 0, // Time penalty
          questions: {},
        });
      }

      const userRecord = userMap.get(userId);

      // Initialize question tracking if not already done
      if (!userRecord.questions[questionId]) {
        userRecord.questions[questionId] = {
          submissions: [],
          solved: false,
          firstSolve: false,
          wrongAnswers: 0,
          points: questions.find((q) => q.id === questionId)?.points || 0,
        };
      }

      // Add submission to the user's record
      userRecord.questions[questionId].submissions.push({
        submission_id: submission.submission_id,
        submittedAt: submission.submitted_at,
        status: submission.status,
        sql_mode: submission.sql_mode,
        userAnswer: submission.user_answer,
      });

      // Update solved status if this is an accepted solution
      if (
        submission.status === "Accepted" &&
        !userRecord.questions[questionId].solved
      ) {
        userRecord.questions[questionId].solved = true;
        userRecord.score += 1;

        // Calculate time from contest start for penalty
        const submissionTime = new Date(
          submission.submitted_at.replace("|", "").trim()
        );
        const contestStartTime = new Date(
          contestData.startTime.replace("|", "").trim()
        );
        const timeDiffMinutes = Math.max(
          0,
          Math.floor((submissionTime - contestStartTime) / (1000 * 60))
        );
        userRecord.penalty += timeDiffMinutes;

        // Check if this is the first solve for this question
        if (!firstSolvedMap.has(questionId)) {
          firstSolvedMap.set(questionId, userId);
          userRecord.questions[questionId].firstSolve = true;
        }
      } else if (
        submission.status === "Wrong Answer" &&
        !userRecord.questions[questionId].solved
      ) {
        userRecord.questions[questionId].wrongAnswers += 1;
        userRecord.penalty += 10;
      }
    });

    console.log(userMap);

    // 5. Convert the map to an array and sort by score (descending) and penalty (ascending)
    let leaderboard = Array.from(userMap.values()).map((user) => {
      // Convert questions object to array with question details
      const questionsArray = questions.map((q) => {
        const userQuestionData = user.questions[q.id] || {
          submissions: [],
          solved: false,
          firstSolve: false,
          points: q.points,
        };

        return {
          id: q.id,
          questionNumber: q.questionNumber,
          questionTitle: q.questionTitle,
          difficulty: q.difficulty,
          points: q.points,
          submissions: userQuestionData.submissions,
          solved: userQuestionData.solved,
          firstSolve: userQuestionData.firstSolve,
          wrongAnswers: userQuestionData.wrongAnswers,
        };
      });

      return {
        id: user.id,
        name: user.name,
        username: user.username,
        score: user.score,
        penalty: user.penalty,
        questions: questionsArray,
      };
    });

    // Sort the leaderboard by score and penalty
    leaderboard.sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score; // Higher score first
      }
      return a.penalty - b.penalty; // Lower penalty first
    });

    // 6. Add rank to each user
    leaderboard = leaderboard.map((user, index) => ({
      rank: index + 1,
      ...user,
    }));

    // 7. Return the formatted leaderboard along with contest info
    return NextResponse.json({
      contest: {
        id: contestData.id,
        name: contestData.name,
        startTime: contestData.startTime,
        endTime: contestData.endTime,
      },
      questions: questions.map((q) => ({
        id: q.id,
        questionNumber: q.questionNumber,
        questionTitle: q.questionTitle,
        difficulty: q.difficulty,
        points: q.points,
        firstSolvedBy: firstSolvedMap.get(q.id)
          ? leaderboard.find((user) => user.id === firstSolvedMap.get(q.id))
              ?.username
          : null,
      })),
      leaderboard,
    });
  } catch (error) {
    console.error("Leaderboard API error:", error);
    return NextResponse.json(
      { error: "Failed to generate leaderboard" },
      { status: 500 }
    );
  }
}
