import { NextResponse } from "next/server";
import supabase from "@/supabaseClient";

export async function PUT(req, { params }) {
  const { id } = params;
  const { ddlType, ddl } = await req.json();

  const validTypes = ["mysql_ddl", "oracle_ddl", "postgresql_ddl"];
  if (!validTypes.includes(ddlType)) {
    return NextResponse.json(
      {
        message:
          "Invalid ddlType. Must be one of mysql_ddl, oracle_ddl, postgresql_ddl.",
      },
      { status: 400 }
    );
  }

  const { error } = await supabase
    .from("Contests")
    .update({ [ddlType]: ddl })
    .eq("id", id);

  if (error) {
    return NextResponse.json(
      { message: "Error updating DDL", error },
      { status: 500 }
    );
  }

  return NextResponse.json({ message: "DDL updated successfully" });
}
