import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcrypt";

// Supabase client setup
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use a service role key for admin privileges
);

export const authOptions = {
    secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        identifier: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { identifier, password, role } = credentials;
        // console.log("identifier", identifier);
        // console.log("password", password);
        // Find user by username
        const { data: user, error } = await supabase
          .from("Users")
          .select("*")
          .eq("username", identifier)
          .single();

        if (error || !user) {
          throw new Error("User not found");
        }

        // Verify password
        const passwordMatch = await bcrypt.compare(password, user.password);
        // console.log("passwordMatch", passwordMatch);

        if (!passwordMatch) {
          throw new Error("Invalid credentials");
        }

        if (role && user.role !== role) {
            throw new Error(`Unauthorized: Only ${role}s can log in here.`);
          }

        // Return authenticated user data
        return {
          id: user.id,
          name: user.name,
          username: user.username,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials, context }) {
        const referer = context?.req?.headers?.referer || ""; // Get the login page URL
    
        // Prevent admin login from user login page
        if (referer.includes("/user") && user.role === "admin") {
          throw new Error("Unauthorized access: Admins cannot log in here.");
        }
    
        // Prevent user login from admin login page
        if (referer.includes("/admin") && user.role === "user") {
          throw new Error("Unauthorized access: Users cannot log in here.");
        }
    
        return true; // Allow valid logins
    },

    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.username = token.username;
      session.user.role = token.role;
      return session;
    },
  },
  pages: {
    signIn: (context) => {
      if (context?.query?.role === 'admin') {
        return '/admin'
      }
      return '/user'
    },
    signOut: '/',
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
