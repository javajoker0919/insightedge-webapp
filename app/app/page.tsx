"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";

import { watchlistAtom } from "@/utils/atoms";
import { Loading } from "../components";

export default function DashboardPage() {
  const [watchlist] = useAtom(watchlistAtom);
  const router = useRouter();

  useEffect(() => {
    if (watchlist && watchlist.length > 0) {
      router.push(`/app/watchlist/${watchlist[0].uuid}`);
    }
  }, [watchlist]);

  return (
    <div className="text-black mx-auto flex flex-col items-center justify-center">
      {/* <Loading /> */}
    </div>
  );
}
