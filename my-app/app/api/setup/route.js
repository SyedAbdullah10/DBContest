import supabase from "@/supabaseClient";
import sqlite3 from 'sqlite3';
// import oracledb from 'oracledb';

// Your contest schema (Modify as needed)
const DDL_QUERY = `
  CREATE TABLE IF NOT EXISTS participants (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    score INT DEFAULT 0
  );
`;

async function applyDDL() {
  try {
    // console.log("Applying DDL to all databases...");

    // ✅ Supabase (PostgreSQL)
    const { error: pgError } = await supabase.rpc('run_sql', { query: DDL_QUERY });
    // console.log("PostgreSQL DDL Result:", pgError ? "Failed" : "Success");
    if (pgError) console.error("PostgreSQL Error:", pgError.message);

    // ✅ SQLite
    const db = new sqlite3.Database('./test.db');
    await new Promise((resolve, reject) => {
      db.run(DDL_QUERY, (err) => (err ? reject(err) : resolve("SQLite DDL Executed")));
    });
    db.close();

    // ✅ Oracle
    // const connection = await oracledb.getConnection({ user: 'oracle', password: 'password', connectString: 'localhost/XE' });
    // await connection.execute(DDL_QUERY);
    // await connection.commit();
    // await connection.close();

    // console.log("DDL successfully applied to all databases.");
  } catch (error) {
    console.error("DDL Execution Failed:", error.message);
  }
}

// ✅ Automatically run on server start
applyDDL();
