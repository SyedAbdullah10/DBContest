import { NextResponse } from "next/server";
import { Parser } from "sql-ddl-to-json-schema";

export async function POST(req) {
  try {
    const { ddl, sourceDb, targetDb } = await req.json();

    // Validate the source and target databases
    const validDatabases = ["postgresql", "mysql", "oracle"];
    if (
      !validDatabases.includes(sourceDb) ||
      !validDatabases.includes(targetDb)
    ) {
      return NextResponse.json(
        { success: false, error: "Invalid database type" },
        { status: 400 }
      );
    }

    // Initialize the parser with the source database type
    const parser = new Parser(sourceDb);
    parser.feed(ddl);

    // Convert to the target database
    const convertedDDL = parser.toDDL(targetDb);

    return NextResponse.json({ success: true, convertedDDL });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
