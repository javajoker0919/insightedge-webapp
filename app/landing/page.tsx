"use client";
import { useEffect, useState } from "react";
import Card from "../../components/Card";
import Hero from "../../components/Hero";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase";

const Landing = () => {
  const [posts, setPosts] = useState<any>([]);
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false }) // Order by descending to get the latest rows first
      .limit(8);
    if (data) {
      setPosts(data);
    } else {
      console.log(error);
    }
  };
  return (
    <main className="flex h-full w-full flex-col items-center justify-between">
      <div className="pt-10 pb-28">
        <Hero />
      </div>
      <div className="w-full pt-10 pb-36 flex flex-row justify-center top-0 sticky bg-slate-200">
        <div className="">
          <div className="text-3xl font-bold">Latest Post</div>
          <div className="pt-8 max-w-6xl grid grid-cols-1 gap-2 md:gap-3 lg:gap-4 lg:grid-cols-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4">
            {posts.map((post: any, index: number) => (
              <div key={index}>
                <Card post={post} />
              </div>
            ))}
          </div>
          <div className="pt-8 flex flex-row justify-center">
            <button className="px-4 py-2 bg-slate-400 rounded-xl">
              Load More
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Landing;
