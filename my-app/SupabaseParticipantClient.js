import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL2;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY2;

if (!supabaseUrl || !supabaseAnonKey) {
  console.log(supabaseUrl, supabaseAnonKey);

  throw new Error(
    "NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing!"
  );
}

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
