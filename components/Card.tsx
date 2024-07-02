import { useUserContext } from "@/contexts/userContext";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const Card = (post: any) => {
  const [postInfo, setPostInfo] = useState(post.post);
  const [publishDate, setPublishDate] = useState(post.post.created_at);
  const { userInfo } = useUserContext();

  let dataObj = new Date(post.post.created_at);

  useEffect(() => {
    setPublishDate(dataObj.toLocaleDateString("en-US"));
  }, []);

  return (
    <div className="max-w-full h-80 p-4 m-8 sm:m-0 bg-slate-100 shadow-sm dark:bg-gray-800 rounded-xl">
      <Image
        className="rounded-xl"
        width={1000}
        height={600}
        src={
          postInfo
            ? postInfo.image_url
            : "https://xtcrjordvnddzvchmpvd.supabase.co/storage/v1/object/public/images/hero.jpg"
        }
        alt="demo image "
      />

      <div className="pt-3">
        <div className="flex mb-3 flex-row justify-between gap-2 place-items-center">
          <div className="flex flex-row justify-center gap-2 place-items-center">
            <Image
              className="rounded-full"
              src={
                userInfo
                  ? userInfo?.avatar_url
                  : "https://xtcrjordvnddzvchmpvd.supabase.co/storage/v1/object/public/images/empty_avatar.jpeg"
              }
              height={28}
              width={28}
              alt="avatar"
            />
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {" "}
              {publishDate}
            </p>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            5 min read
          </p>
        </div>

        <Link className="text-lg " href={`/posts/${postInfo.id}`}>
          {postInfo && postInfo.title}
        </Link>
      </div>
    </div>
  );
};

export default Card;
