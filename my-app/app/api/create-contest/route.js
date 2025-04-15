// File: app/api/contests/route.js
import supabase from "@/supabaseClient";
import axios from "axios";
// import pool from "@/mysqlpool";
// import oracle_pool from "@/oracleDbPool";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const data = await request.json();
    console.log(data);

    // Extract data from the request
    const {
      contestName,
      startTime,
      endTime,
      contestPassword,
      ddlContent,
      questions,
    } = data;

    // Validate required fields
    if (!contestName || !startTime || !endTime || !contestPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Missing required fields",
        },
        { status: 400 }
      );
    }

    if (!ddlContent.postgresql || !ddlContent.mysql || !ddlContent.oraclesql) {
      return NextResponse.json(
        {
          success: false,
          message: "All DDL must be provided!",
        },
        { status: 500 }
      );
    }

    // create postgres ddl
    try {
      const res = await axios.post("http://localhost:3000/api/execute", {
        query: ddlContent.postgresql,
        sql_mode: "postgres",
        ddl: true,
      });
    } catch (err) {
      return NextResponse.json({
        success: false,
        message: "Failed to execute PostgreSQL Queries!",
      });
    }

    // create mysql ddl
    try {
      const res = await axios.post("http://localhost:3000/api/execute", {
        query: ddlContent.mysql,
        sql_mode: "mysql",
        ddl: true,
      });
    } catch (err) {
      return NextResponse.json({
        success: false,
        message: "Failed to execute MySQL Queries!",
      });
    }

    // create mysql ddl
    try {
      const res = await axios.post("http://localhost:3000/api/execute", {
        query: ddlContent.oraclesql,
        sql_mode: "oracle",
        ddl: true,
      });
    } catch (err) {
      return NextResponse.json({
        success: false,
        message: "Failed to execute Oracle Queries!",
      });
    }

    // if (ddlContent.postgresql) {
    //   const { error: pgError } = await supabase.rpc("sql_exec", {
    //     query: ddlContent.postgresql,
    //   });

    //   if (pgError) {
    //     console.error("❌ PostgreSQL DDL execution error:", pgError);
    //     return NextResponse.json(
    //       {
    //         success: false,
    //         message: "❌ PostgreSQL DDL execution error",
    //         error: pgError.message,
    //       },
    //       { status: 500 }
    //     );
    //   }
    // }

    // if (ddlContent.mysql) {
    //   const connection = await pool.getConnection();
    //   try {
    //     console.log("✅ Connected to MySQL");

    //     if (ddl) {
    //       await connection.execute(query);
    //       result = "DDL Executed Successfully";
    //     } else {
    //       const [rows] = await connection.execute(query);
    //       result = rows;
    //     }
    //   } finally {
    //     connection.release(); // Always release the connection
    //     pool.end();
    //   }
    // }

    // if (ddlContent.oraclesql) {
    //   let connection;
    //   let o_pool;
    //   try {
    //     o_pool = await oracle_pool(); // create pool
    //     connection = await o_pool.getConnection();
    //     console.log("✅ Connected to Oracle");

    //     if (ddl) {
    //       await connection.execute(query);
    //       result = "DDL Executed Successfully";
    //     } else {
    //       const isInsertOrUpdateOrDelete = /^(insert|update|delete)/i.test(
    //         query.trim()
    //       );
    //       const resultSet = await connection.execute(query, []);
    //       if (isInsertOrUpdateOrDelete) {
    //         await connection.commit();
    //         result = "Query Executed and Changes Committed";
    //       } else {
    //         result = resultSet.rows;
    //       }
    //     }
    //   } catch (error) {
    //     console.error("❌ Oracle query error:", error);
    //     throw error;
    //   } finally {
    //     if (connection) {
    //       try {
    //         await connection.close(); // ✅ release connection back to pool
    //       } catch (closeErr) {
    //         console.error("❌ Error releasing Oracle connection:", closeErr);
    //       }
    //     }
    //     if (o_pool) {
    //       try {
    //         await o_pool.close(); // ✅ destroy the entire pool
    //         console.log("🛑 Oracle pool closed");
    //       } catch (poolCloseErr) {
    //         console.error("❌ Error closing Oracle pool:", poolCloseErr);
    //       }
    //     }
    //   }
    // }

    // Insert contest into Supabase
    const { data: contestData, error: contestError } = await supabase
      .from("Contests")
      .insert({
        name: contestName,
        startTime: startTime,
        endTime: endTime,
        password: contestPassword,
        oracle_ddl: ddlContent.oraclesql || "",
        mysql_ddl: ddlContent.mysql || "",
        postgresql_ddl: ddlContent.postgresql || "",
      })
      .select()
      .single();

    if (contestError) {
      console.error("Error inserting contest:", contestError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to create contest",
          error: contestError.message,
        },
        { status: 500 }
      );
    }

    // If questions are provided, insert them with reference to contest
    if (questions && questions.length > 0 && contestData.id) {
      // Map questions array to match your Questions table schema
      const questionsWithContestId = questions.map((q) => ({
        questionNumber: q.number,
        questionTitle: q.title,
        questionDescription: q.description,
        difficulty: q.difficulty,
        Answer: q.answer,
        ContestId: contestData.id,
        points: q.points,
      }));

      const { error: questionsError } = await supabase
        .from("Questions") // Using the exact table name
        .insert(questionsWithContestId);

      if (questionsError) {
        console.error("Error inserting questions:", questionsError);
        // We don't want to fail the entire request if questions fail
        // but we do want to report it
        return NextResponse.json(
          {
            success: true,
            message: "Contest created but failed to add some questions",
            contestId: contestData.id,
            questionError: questionsError.message,
          },
          { status: 207 }
        );
      }
    }

    return NextResponse.json(
      {
        success: true,
        message: "Contest created successfully",
        contestId: contestData.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Server error",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
