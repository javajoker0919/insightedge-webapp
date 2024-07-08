"use client";

import { useAtom } from "jotai";
import { userMetadataAtom } from "@/utils/atoms";

export default function DashboardPage() {
  const [userMetadata] = useAtom(userMetadataAtom);

  return (
    <div className="text-black mx-auto flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Dashboard</h1>
      <p className="mb-8">Welcome to your dashboard.</p>
    </div>
  );
}
