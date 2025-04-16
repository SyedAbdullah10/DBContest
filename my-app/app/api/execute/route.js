import supabase from "@/SupabaseParticipantClient";
import pool from "@/mysqlpool";
import oracle_pool from "@/oracleDbPool";

export async function POST(req) {
  let { query, sql_mode, ddl } = await req.json(); // Get query, database type, and DDL flag
  console.log("Received query:", query);
  console.log("Database type:", sql_mode);
  console.log("DDL flag:", ddl);

  try {
    let result;

    let queries = query.split(";");
    console.log(queries);
    

    // ✅ PostgreSQL via Supabase
    if (sql_mode === "postgres") {
      result = [];
      for (let i = 0; i < queries.length; i++) {
        let execute_query = queries[i].trim();
        query = execute_query;
        const { data, error } = await supabase.rpc("sql_exec", {
          query,
        });
        console.log("Supabase response:", data, error);
        if (error) throw new Error("PostgreSQL Error: " + error.message);
        result.push(ddl ? "DDL Executed Successfully" : data);
      }
    }

    // ✅ MySQL via Pool
    else if (sql_mode === "mysql") {
      const connection = await pool.getConnection();
      try {
        console.log("✅ Connected to MySQL");

        if (ddl) {
          result = [];
          for (let i = 0; i < queries.length; i++) {
            let singleQuery = queries[i];
            if (singleQuery != "") {
              const res = await connection.execute(singleQuery);
              result.push(res);
            }
          }
        } else {
          console.log(queries[0]);

          const [rows] = await connection.execute(queries[0]);
          result = rows;
        }
      } finally {
        connection.release(); // Always release the connection
      }
    }
    //  else if (sql_mode == "oracle") {
    //   let connection;
    //   try {
    //     const o_pool = await oracle_pool();
    //     connection = await o_pool.getConnection();
    //     console.log("✅ Connected to Oracle");

    //     if (ddl) {
    //       await connection.execute(query);
    //       result = "DDL Executed Successfully";
    //     } else {
    //       const isInsertOrUpdateOrDelete = /^(insert|update|delete)/i.test(
    //         query.trim()
    //       );
    //       const resultSet = await connection.execute(query, []); // <-- 🔥 FIX HERE
    //       if (isInsertOrUpdateOrDelete) {
    //         await connection.commit(); // 🔒 Persist the data
    //         result = "Query Executed and Changes Committed";
    //       } else {
    //         result = resultSet.rows; // SELECT returns rows
    //       }
    //     }
    //   } catch (error) {
    //     console.error("❌ Oracle query error:", error);
    //     throw error;
    //   } finally {
    //     if (connection) {
    //       try {
    //         await connection.close(); // always release the connection
    //       } catch (closeErr) {
    //         console.error("❌ Error releasing Oracle connection:", closeErr);
    //       }
    //     }
    //   }
    // }
    else if (sql_mode == "oracle") {
      let connection;
      try {
        const o_pool = await oracle_pool();
        connection = await o_pool.getConnection();
        console.log("✅ Connected to Oracle");

        if (!ddl) {
          result = await connection.execute(queries[0]);
          result = result.rows;
        } else {
          console.log(queries);

          result = [];
          for (let i = 0; i < queries.length; i++) {
            let singleQuery = queries[i];
            if (singleQuery != "") {
              console.log(singleQuery);

              singleQuery = singleQuery.trim();
              await connection.execute(singleQuery, []); // <-- 🔥 FIX HERE
              await connection.commit(); // 🔒 Persist the data
            }
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

  /*





















  
  
  */

}
