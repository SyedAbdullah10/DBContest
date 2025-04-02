import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import supabase from "@/supabaseClient";

/*

a1,a2,2323
a3,a4,2323
a5,a6,2323

*/

dotenv.config({ path: ".env.local" });

export async function POST(req) {
  try {
    const { all_users } = await req.json();
    console.log(all_users);

    // Loop through each user and hash the password before insertion
    for (let i = 0; i < all_users.length; i++) {
      const user = all_users[i]; // Use 'let' or 'const' for the loop variable
      const saltRounds = 10; // Recommended salt rounds for security
      const hashedPassword = await bcrypt.hash(user.password, saltRounds); // Hash password

      const { data, error } = await supabase.from("Users").insert([
        {
          username: user.username,
          password: hashedPassword, // Store hashed password
          name: user.name,
          role: user.role,
        },
      ]);

      // Log error if insert fails
      if (error) {
        console.error(`Error inserting user ${user.username}:`, error);
        return NextResponse.json(
          { success: false, error: `Failed to insert user ${user.username}` },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Users inserted successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function DELETE(req) {
  try {
    const { all_users_ids } = await req.json();
    console.log(all_users_ids);

    // Loop through each user and hash the password before insertion
    for (let i = 0; i < all_users_ids.length; i++) {
      const user = all_users_ids[i]; // Use 'let' or 'const' for the loop variable

      const { data, error } = await supabase
        .from("Users")
        .delete()
        .eq("id", user);

      // Log error if insert fails
      if (error) {
        console.error(`Error deleting user ${user}:`, error);
        return NextResponse.json(
          { success: false, error: `Failed to delete user ${user}` },
          { status: 400 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Users deleted successfully",
    });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}

export async function GET() {
  const { data, error } = await supabase.from("Users").select("*");
  if (error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  return NextResponse.json({ success: true, users: data });
}

export async function PUT(req) {
  try {
    const { id, newUsername, newPassword } = await req.json();

    // Hash the new password before updating
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update user data based on the ID
    const { data, error } = await supabase
      .from("Users")
      .update({ username: newUsername, password: hashedPassword })
      .eq("id", id);

    if (error) {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      data,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 400 }
    );
  }
}
