import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const supabaseUrl =
  process.env.SUPABASE_URL || "https://kknldjthuwsjiczkqklx.supabase.co";
const supabaseAnonKey =
  process.env.SUPABASE_ANON_KEY || "sb_publishable_Y4zN5IxVaqI6nKBgQRjyvw_g9KeUKYd";

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

export const supabaseAdmin = supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : null;

