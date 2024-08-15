import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

// supabase.auth.onAuthStateChange(async (event, session) => {
//   console.log("event: ", event);
  
//   if (event === "TOKEN_REFRESHED" || event === "SIGNED_IN") {
//     const { data: { session: refreshedSession } } = await supabase.auth.getSession();
//     supabase.auth.setSession({
//       access_token: refreshedSession?.access_token || "",
//       refresh_token: refreshedSession?.refresh_token || ""
//     });
//   }
// });