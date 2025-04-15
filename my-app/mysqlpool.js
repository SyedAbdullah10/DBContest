// src/lib/mysqlPool.js
import mysql from "mysql2/promise";

const pool = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "",
  database: "test_db",
  port: 3307, // abdullah L -> 3306
  waitForConnections: true,
  connectionLimit: 50,
  queueLimit: 0,
});

export default pool;
