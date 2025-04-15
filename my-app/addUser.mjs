import bcrypt from "bcrypt"; // or import bcrypt from "bcrypt"
import supabase from "@/supabaseClient";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

async function addUserToSupabase(username, password, name, role) {
  const saltRounds = 10; // Recommended salt rounds for security
  const hashedPassword = await bcrypt.hash(password, saltRounds); // Hash password

  const { data, error } = await supabase.from("Users").insert([
    {
      username: username,
      password: hashedPassword, // Store hashed password
      name: name,
      role: role,
    },
  ]);

  if (error) {
    console.error("Error inserting user:", error);
    return null;
  }

  console.log("User added successfully:", data);
  return data;
}

// Example usage
addUserToSupabase(
  "abdullah2",
  "SecurePassword456",
  "Syed Abdullah Bin Tariq",
  "admin"
);
