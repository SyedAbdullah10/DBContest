import supabase from "@/supabaseClient";

export async function PUT(req, { params }) {
  const { id } = params;
  const { status, startTime, endTime } = await req.json();

  if (!id || !status || !endTime || (status === "upcoming" && !startTime)) {
    return Response.json(
      { message: "Missing required fields" },
      { status: 400 }
    );
  }

  try {
    let updateFields = {};

    if (status === "ongoing") {
      updateFields.endTime = endTime;
    } else if (status === "upcoming") {
      updateFields.startTime = startTime;
      updateFields.endTime = endTime;
    } else {
      return Response.json(
        { message: "Cannot update time of finished contests." },
        { status: 400 }
      );
    }

    const { error } = await supabase
      .from("Contests")
      .update(updateFields)
      .eq("id", id);

    if (error) {
      console.error("Supabase update error:", error);
      return Response.json(
        { message: "Database update failed", error },
        { status: 500 }
      );
    }

    return Response.json(
      { message: "Timer updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error:", err);
    return Response.json({ message: "Internal server error" }, { status: 500 });
  }
}
