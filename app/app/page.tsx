"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAtom } from "jotai";

import { watchlistAtom } from "@/utils/atoms";
import { Loading } from "../components";
import { getMixPanelClient } from "@/utils/mixpanel";

export default function DashboardPage() {
  const [watchlist] = useAtom(watchlistAtom);
  const router = useRouter();
  const mixpanel = getMixPanelClient();

  useEffect(() => {
    if (watchlist && watchlist.length > 0) {
      mixpanel.track("Dashboard page");
      router.push(`/app/watchlist/${watchlist[0].uuid}`);
    }
  }, [watchlist]);

  return (
    <div className="text-black mx-auto flex flex-col items-center justify-center">
      {/* <Loading /> */}
    </div>
  );
}
