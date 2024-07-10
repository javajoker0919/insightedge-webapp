"use client";

import { useParams } from "next/navigation";
import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabaseClient";

export default function WatchlistPage() {
  const params = useParams();
  const id = params.id;
  const [watchlistName, setWatchlistName] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchWatchlistName() {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("watchlists")
        .select("name")
        .eq("uuid", id)
        .single();

      if (error) {
        console.error("Error fetching watchlist:", error);
      } else if (data) {
        setWatchlistName(data.name);
      }
      setIsLoading(false);
    }

    fetchWatchlistName();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-4">
        <span className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
        <h1>Loading</h1>
      </div>
    );
  }

  return (
    <div>
      <h1>{watchlistName}</h1>
    </div>
  );
}
