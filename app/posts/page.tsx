"use client";
import Card from "@/components/Card";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/supabase";

const Posts = () => {
  const [posts, setPosts] = useState<any>([]);
  const router = useRouter();

  useEffect(() => {
    fetchPosts();
  }, []);
  const fetchPosts = async () => {
    const { data, error } = await supabase.from("posts").select("*");
    if (data) {
      setPosts(data);
    } else {
      console.log(error);
    }
  };
  return (
    <main className="flex h-full w-full flex-col items-center justify-between">
      <div className="w-full pt-10 pb-36 flex flex-row gap-10 justify-center top-0 sticky bg-white">
        <div className="w-64 h-[calc(100vh-119px)] p-6 rounded-xl bg-slate-200">
          <p className="text-2xl font-mono text-slate-800 font-bold pb-4">
            Category
          </p>
          <div className="p-2">
            <div className="mb-1">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="Technology"
                  className="w-4 h-4 text-slate-600"
                />
                <span className="ml-2">Technology</span>
              </label>
            </div>
          </div>
          <div className="p-2">
            <div className="mb-1">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="Health & Wellness"
                  className="w-4 h-4 text-slate-600"
                />
                <span className="ml-2">Health & Wellness</span>
              </label>
            </div>
          </div>
          <div className="p-2">
            <div className="mb-1">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="Travel"
                  className="w-4 h-4 text-slate-600"
                />
                <span className="ml-2">Travel</span>
              </label>
            </div>
          </div>
          <div className="p-2">
            <div className="mb-1">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="Personal Finance"
                  className="w-4 h-4 text-slate-600"
                />
                <span className="ml-2">Personal Finance</span>
              </label>
            </div>
          </div>
          <div className="p-2">
            <div className="mb-1">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="Technology"
                  className="w-4 h-4 text-slate-600"
                />
                <span className="ml-2">Technology</span>
              </label>
            </div>
          </div>
          <div className="p-2">
            <div className="mb-1">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="Lifestyle"
                  className="w-4 h-4 text-slate-600 checked:text-slate-500"
                />
                <span className="ml-2">Lifestyle</span>
              </label>
            </div>
          </div>
          <div className="p-2">
            <div className="mb-1">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="Food & Recipes"
                  className="w-4 h-4 text-slate-600"
                />
                <span className="ml-2">Food & Recipes</span>
              </label>
            </div>
          </div>
          <div className="p-2">
            <div className="mb-1">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="Education"
                  className="w-3 h-3 w-4 h-4 text-slate-600"
                />
                <span className="ml-2">Education</span>
              </label>
            </div>
          </div>
          <div className="p-2">
            <div className="mb-1">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  value="Entertainment"
                  className="w-4 h-4 text-slate-600"
                />
                <span className="ml-2">Entertainment</span>
              </label>
            </div>
          </div>
        </div>
        {/* </div> */}
        <div className="">
          <div className="text-3xl font-bold flex flex-row justify-between">
            <p>All Posts</p>
            <button
              className="px-4 py-2 text-lg font-normal bg-slate-200 hover:shadow-xl rounded-xl shadow-lg border border-slate-300"
              onClick={() => router.push("/posts/add")}
            >
              Add Post
            </button>
          </div>
          {posts.length !== 0 ? (
            <>
              <div className="pt-8 max-w-5xl grid grid-cols-1 gap-2 md:gap-3 lg:gap-4 lg:grid-cols-3 md:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-4">
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
            </>
          ) : (
            <div className="w-[1024px] pt-36 font-semibold text-slate-400 font-mono text-2xl flex flex-col justify-center place-items-center">
              No Post
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default Posts;
