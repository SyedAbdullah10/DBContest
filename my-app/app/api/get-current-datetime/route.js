import { NextResponse } from "next/server";

export async function GET() {
  const now = new Date();
  const localDateTime = now.toLocaleString("en-US", {
    timeZone: "Asia/Karachi",
  });
  console.log(new Date().toISOString());

  return NextResponse.json({ now: localDateTime });
}
