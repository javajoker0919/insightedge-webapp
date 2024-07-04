import Link from "next/link";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import { useRouter } from "next/navigation";

import { supabase } from "@/utils/supabaseClient";

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    router.replace("/");
  };

  return (
    <nav className="p-4 bg-gray-100 md:px-16 w-full flex justify-between items-center">
      <Link href="/">
        <span className="text-black">Home</span>
      </Link>
      <div className="flex items-center gap-4">
        {user ? (
          <button
            onClick={handleLogout}
            className="px-4 py-2 flex items-center justify-center text-white bg-red-600 hover:bg-red-700 transition-all rounded-lg w-full"
          >
            Log Out
          </button>
        ) : (
          <>
            <Link href="/auth/sign-in">
              <button className="px-4 py-2 flex items-center justify-center text-black hover:bg-gray-200 transition-all rounded-lg w-full">
                Sign In
              </button>
            </Link>
            <Link href="/auth/sign-up">
              <button className="px-4 py-2 flex items-center justify-center text-white bg-indigo-600 hover:bg-indigo-700 transition-all rounded-lg w-full">
                Sign Up
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
