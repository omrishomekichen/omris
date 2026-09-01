import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabaseUrl =
  process.env.SUPABASE_URL || "https://kknldjthuwsjiczkqklx.supabase.co";
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY || "sb_publishable_Y4zN5IxVaqI6nKBgQRjyvw_g9KeUKYd";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});
