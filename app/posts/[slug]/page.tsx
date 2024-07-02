"use client";
import React, { useEffect, useState } from "react";
import { supabase } from "@/supabase";
import Image from "next/image";
import { useRouter } from "next/navigation";

const PostDetail = ({ params }: any) => {
  const [post, setPost] = useState<any>([]);
  const [posterInfo, setPosterInfo] = useState<any>();
  const router = useRouter();

  useEffect(() => {
    fetchPost();
  }, []);
  const fetchPost = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", params.slug)
      .single();
    if (data) {
      setPost(data);
      const { data: personalData, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user_id)
        .single();
      if (personalData) {
        setPosterInfo(personalData);
      }
    } else {
      console.log(error);
    }
  };

  return (
    <main className="flex h-full max-w-5xl w-full flex-col justify-center  place-items-center">
      <p className="py-10 text-4xl pb-6 text-slate-800 font-mono">
        {post.title}
      </p>
      <div className="flex w-full flex-row justify-between py-6 px-4">
        <div className="place-items-start flex flex-row w-full  gap-4">
          <Image
            className="rounded-full"
            src={
              posterInfo
                ? posterInfo.avatar_url
                : "https://xtcrjordvnddzvchmpvd.supabase.co/storage/v1/object/public/images/empty_avatar.jpeg"
            }
            height={56}
            width={56}
            alt="hero section image"
          />
          <div className="flex flex-col justify-between">
            <div className="text-base text-slate-800 font-bold">
              {posterInfo ? posterInfo.name : ""}
            </div>
            <div>
              {posterInfo &&
                new Date(posterInfo.created_at).toLocaleDateString("en-US")}
            </div>
          </div>
        </div>
        <div className="flex flex-col justify-center">
          <button
            className="px-4 py-2 bg-slate-200 rounded-xl shadow-xl hover:bg-slate-100"
            onClick={() => router.back()}
          >
            Back
          </button>
        </div>
      </div>
      <Image
        className="rounded-xl"
        src={post && post.image_url}
        height={600}
        width={1000}
        alt="hero section image"
      />
      <div className="py-8 px-4 text-lg text-slate-800">
        {post && post.content}
      </div>
    </main>
  );
};

export default PostDetail;
