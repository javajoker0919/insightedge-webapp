"use client";

import { useAtom } from "jotai";
import { userMetadataAtom, watchlistAtom } from "@/utils/atoms";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const [userMetadata] = useAtom(userMetadataAtom);
  const [watchlist] = useAtom(watchlistAtom);
  const router = useRouter();

  useEffect(() => {
    if (watchlist && watchlist.length > 0) {
      router.push(`/app/watchlist/${watchlist[0].uuid}`);
    }
  }, [watchlist]);

  return (
    <div className="text-black mx-auto flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="mb-8">Welcome to your dashboard.</p>
    </div>
  );
}
