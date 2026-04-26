import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Supabase credentials missing in production");
  } else {
    console.warn("Supabase credentials missing. Database features will be disabled.");
  }
}

// Service role client (Server-side ONLY)
export const supabaseAdmin = createClient(
  supabaseUrl || "",
  supabaseServiceKey || ""
);
