import supabase from "@/supabaseClient";
import mysql from 'mysql2';

// import oracledb from 'oracledb';

export async function POST(req) {
  const { query, dbType, ddl } = await req.json(); // Get query, database type, and DDL flag
  console.log('Received query:', query);
  console.log('Database type:', dbType);
  console.log('DDL flag:', ddl);

  try {
    let result;

    // ✅ Supabase (PostgreSQL)
    if (dbType === 'postgres') {
      if (ddl) {
        const { error } = await supabase.rpc('sql_exec', { query });

        if (error) throw new Error("PostgreSQL Error: " + error.message);
        result = "DDL Executed Successfully";
      } else {
        const { data, error } = await supabase.rpc('sql_exec', { query });
        console.log('Supabase response:', data, error);

        if (error) {
          throw new Error("PostgreSQL Error: " + error.message);
        }

        result = data;
      }
    }

    // ✅ MySQL
    else if (dbType === 'mysql') {
        const connection = await mysql.createConnection({
          host: '127.0.0.1',
          user: 'root',
          password: '', // Set your password if needed
          database: 'test_db'
        });
  
        console.log("✅ Connected to MySQL");
  
        if (ddl) {
          await connection.execute(query);
          result = "DDL Executed Successfully";
        } else {
          const [rows] = await connection.execute(query);
          result = rows; // Return fetched data
        }
  
        await connection.end();
      }

    // ❌ Invalid DB
    else {
      throw new Error("Invalid database type selected.");
    }

    return new Response(JSON.stringify({ success: true, data: result }), { status: 200 });

  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
  }
}
