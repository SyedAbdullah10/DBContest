import { NextResponse } from "next/server";
import supabase from "@/supabaseClient";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("Contests")
      .select("id, name, startTime, endTime, password");

    if (error) {
      console.error("Supabase fetch error:", error.message);
      return NextResponse.json(
        { message: "Failed to fetch contests." },
        { status: 500 }
      );
    }

    const ongoing = [];
    const upcoming = [];
    const finished = [];

    const now = new Date();

    for (const contest of data || []) {
      const [startDateStr, startTimeStr] = (contest.startTime || "")
        .split("|")
        .map((s) => s.trim());
      const [endDateStr, endTimeStr] = (contest.endTime || "")
        .split("|")
        .map((s) => s.trim());

      // Combine and parse full datetime
      const start = new Date(`${startDateStr} ${startTimeStr}`);
      const end = new Date(`${endDateStr} ${endTimeStr}`);

      const formattedContest = {
        id: contest.id,
        name: contest.name,
        password: contest.password,
        startDate: startDateStr,
        startTime: startTimeStr,
        endDate: endDateStr,
        endTime: endTimeStr,
      };

      if (now >= start && now <= end) {
        ongoing.push(formattedContest);
      } else if (now < start) {
        upcoming.push(formattedContest);
      } else {
        finished.push(formattedContest);
      }
    }

    return NextResponse.json({ ongoing, upcoming, finished }, { status: 200 });
  } catch (err) {
    console.error("Unexpected error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
