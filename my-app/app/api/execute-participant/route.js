// import supabase from "@/supabaseClient";
// const mysql = require('mysql2/promise');

// // import oracledb from 'oracledb';

// export async function POST(req) {
//   const { query, sql_mode, ddl } = await req.json(); // Get query, database type, and DDL flag
//   console.log('Received query:', query);
//   console.log('Database type:', sql_mode);
//   console.log('DDL flag:', ddl);

//   try {
//     let result;

//     // ✅ Supabase (PostgreSQL)
//     if (sql_mode === 'postgres') {
//       if (ddl) {
//         const { error } = await supabase.rpc('sql_exec', { query });

//         if (error) throw new Error("PostgreSQL Error: " + error.message);
//         result = "DDL Executed Successfully";
//       } else {
//         const { data, error } = await supabase.rpc('sql_exec', { query });
//         console.log('Supabase response:', data, error);

//         if (error) {
//           throw new Error("PostgreSQL Error: " + error.message);
//         }

//         result = data;
//       }
//     }

//     // ✅ MySQL
//     else if (sql_mode === 'mysql') {
//         const connection = await mysql.createConnection({
//           host: '127.0.0.1',
//           user: 'root',
//           password: '', // Set your password if needed
//           database: 'test_db'
//         });

//         console.log("✅ Connected to MySQL");

//         if (ddl) {
//           await connection.execute(query);
//           result = "DDL Executed Successfully";
//         } else {
//           const [rows] = await connection.execute(query);
//           result = rows; // Return fetched data
//         }

//         await connection.end();
//       }

//     // ❌ Invalid DB
//     else {
//       throw new Error("Invalid database type selected.");
//     }

//     return new Response(JSON.stringify({ success: true, data: result }), { status: 200 });

//   } catch (error) {
//     return new Response(JSON.stringify({ success: false, error: error.message }), { status: 400 });
//   }
// }
import supabase from "@/SupabaseParticipantClient";
import pool from "@/mysqlpool";
import oracle_pool from "@/oracleDbPool";

// Create a MySQL connection pool once
// const pool = mysql.createPool({
//   host: '127.0.0.1',
//   user: 'root',
//   password: '', // Add your MySQL password here if needed
//   database: 'test_db',
//   port:3306,
//   waitForConnections: true,
//   connectionLimit: 50,
//   queueLimit: 0
// });

export async function POST(req) {
  const { query, sql_mode, ddl } = await req.json(); // Get query, database type, and DDL flag
  console.log("Received query:", query);
  console.log("Database type:", sql_mode);
  console.log("DDL flag:", ddl);

  try {
    let result;

    // ✅ PostgreSQL via Supabase
    if (sql_mode === "postgres") {
      const { data, error } = await supabase.rpc("sql_exec", { query });
      console.log("Supabase response:", data, error);

      if (error) throw new Error("PostgreSQL Error: " + error.message);
      result = ddl ? "DDL Executed Successfully" : data;
    }

    // ✅ MySQL via Pool
    else if (sql_mode === "mysql") {
      const connection = await pool.getConnection();
      try {
        console.log("✅ Connected to MySQL");

        if (ddl) {
          await connection.execute(query);
          result = "DDL Executed Successfully";
        } else {
          const [rows] = await connection.execute(query);
          result = rows;
        }
      } finally {
        connection.release(); // Always release the connection
      }
    } else if (sql_mode == "oracle") {
      let connection;
      try {
        const o_pool = await oracle_pool();
        connection = await o_pool.getConnection();
        console.log("✅ Connected to Oracle");

        if (ddl) {
          await connection.execute(query);
          result = "DDL Executed Successfully";
        } else {
          const isInsertOrUpdateOrDelete = /^(insert|update|delete)/i.test(
            query.trim()
          );
          const resultSet = await connection.execute(query, []); // <-- 🔥 FIX HERE
          if (isInsertOrUpdateOrDelete) {
            await connection.commit(); // 🔒 Persist the data
            result = "Query Executed and Changes Committed";
          } else {
            result = resultSet.rows; // SELECT returns rows
          }
        }
      } catch (error) {
        console.error("❌ Oracle query error:", error);
        throw error;
      } finally {
        if (connection) {
          try {
            await connection.close(); // always release the connection
          } catch (closeErr) {
            console.error("❌ Error releasing Oracle connection:", closeErr);
          }
        }
      }
    }

    // ❌ Invalid DB type
    else {
      throw new Error("Invalid database type selected.");
    }

    return new Response(JSON.stringify({ success: true, data: result }), {
      status: 200,
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400 }
    );
  }
}
