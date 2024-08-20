import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

export const supabase = createClient(supabaseUrl, supabaseKey);

const refreshToken = async () => {
  const {
    data: { session },
  } = await supabase.auth.getSession();
  if (session) {
    await supabase.auth.setSession({
      access_token: session.access_token,
      refresh_token: session.refresh_token,
    });
  }
};

// Refresh token every 30 minutes
// setInterval(refreshToken, 30 * 60 * 1000);
// setInterval(refreshToken, 60 * 1000);

// supabase.auth.onAuthStateChange(async (event, session) => {

//   if (event === "TOKEN_REFRESHED" || event === "SIGNED_IN") {
//     const { data: { session: refreshedSession } } = await supabase.auth.getSession();
//     supabase.auth.setSession({
//       access_token: refreshedSession?.access_token || "",
//       refresh_token: refreshedSession?.refresh_token || ""
//     });
//   }
// });
