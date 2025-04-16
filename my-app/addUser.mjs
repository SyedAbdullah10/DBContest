import bcrypt from "bcrypt"; // or import bcrypt from "bcrypt"
import supabase from "@/supabaseClient";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config({ path: ".env.local" });

async function addUserToSupabase(username, password, name, role) {
  const saltRounds = 10; // Recommended salt rounds for security
  const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash password

  const { data, error } = await supabase.from("Users").insert([
    {
      name,
      username,
      password: hashedPassword,
      role,
    },
  ]);

  if (error) {
    console.error(`❌ Error inserting ${username}:`, error.message);
  } else {
    console.log(`✅ Inserted ${username}`);
  }
}

// Custom parser without headers
function importUsersFromCSV(filePath) {
  const users = [];

  fs.createReadStream(filePath)
    .pipe(csv({ headers: false }))
    .on("data", (row) => {
      // row = { '0': name, '1': email, '2': username, '3': password }
      const name = row[0]?.trim();
      const username = row[2]?.trim();
      const password = row[3]?.trim();

      if (name && username && password) {
        users.push({ name, username, password });
      }
    })
    .on("end", async () => {
      console.log("📥 CSV loaded. Inserting users...");
      for (const user of users) {
        await addUserToSupabase(user.name, user.username, user.password);
      }
      console.log("✅ All users added.");
    });
}

importUsersFromCSV("data.csv"); // Update path if needed