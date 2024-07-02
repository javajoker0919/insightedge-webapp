"use client";
import { supabase } from "@/supabase";
import Image from "next/image";
import { useRef, useState } from "react";
import { CiEdit, CiSaveUp2, CiShoppingTag, CiStickyNote } from "react-icons/ci";
import { v4 as uuidv4 } from "uuid";
import Loading from "@/components/Loading";
import { useRouter } from "next/navigation";
import { RiRobot3Line } from "react-icons/ri";
import { useUserContext } from "@/contexts/userContext";
import { useToastContext } from "@/contexts/toastContext";

const AddPost = () => {
  const { userInfo } = useUserContext();
  const { invokeToast } = useToastContext();

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [tags, setTags] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [isgenerate, setIsGenerate] = useState<boolean>(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      let myuuid = uuidv4();
      setLoading(true);
      const { data, error } = await supabase.storage
        .from("post_images")
        .upload(`/${userInfo?.id ?? userInfo?.id}/${myuuid}`, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        setLoading(false);
        // Handle error
      } else {
        const publicUrl = await supabase.storage
          .from("post_images")
          .getPublicUrl(data.path).data.publicUrl;
        if (publicUrl) {
          setImageUrl(publicUrl);
        }
        setLoading(false);
      }
    }
  };

  const onPostSubmit = async (e: any) => {
    e.preventDefault();
    const { data, error } = await supabase.from("posts").insert({
      user_id: userInfo?.id,
      title: title,
      content: content,
      image_url: imageUrl,
      tags: tags,
    });
    if (!error) {
      router.push(`/personal/${userInfo?.id}`);
      invokeToast(
        "success",
        "Your post has been published successfully",
        "top"
      );
    } else {
      invokeToast("error", "Something went wrong!", "top");
    }
  };

  const postGenerate = async (type: string) => {
    let prompt = "";
    if (type == "title") {
      prompt = `Please generate a simple blog title, return only title as string without "" and number`;
    } else if (type == "tags") {
      prompt = `This is Title of blog: ${title}, Please generate a simple blog tags from this title, add "#" on every tag, return only tags as string without ""`;
    } else if (type == "content") {
      prompt = `This is Title of blog: ${title}, Please generate a simple blog content from this title, return only content as string without ""`;
    }
    setIsGenerate(true);
    const response = await fetch("/api/getblog", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model_promt: prompt,
        prompt: prompt,
      }),
    });
    if (!response.ok) {
      setIsGenerate(false);
      throw new Error(response.statusText);
    }
    setIsGenerate(false);
    const data = response.body;
    if (!data) {
      console.log("error: no data");
      return;
    }
    const reader = data.getReader();
    const decoder = new TextDecoder();
    let done = false;
    while (!done) {
      const { value, done: doneReading } = await reader.read();
      done = doneReading;
      const chunkValue = decoder.decode(value);
      if (type == "title") {
        setTitle((prev) => prev + chunkValue);
      } else if (type == "tags") {
        setTags((prev) => prev + chunkValue);
      } else if (type == "content") {
        setContent((prev) => prev + chunkValue);
      }
    }
  };

  return (
    <div className="w-full max-w-6xl max-h-screen pb-20">
      <div className="my-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className=" text-2xl leading-6 font-semibold text-black dark:text-white">
          Add Post
        </h2>
      </div>
      <div className="">
        <div className="">
          <div className="rounded-xl shadow-2xl border border-[#e2e8f0] bg-slate-200 shadow-default dark:border-[#e2e8f0] dark dark:bg-boxdark">
            <div className="border-b border-[#e2e8f0] px-7 py-4 dark:border-[#e2e8f0] dark flex flex-row justify-between pr-4 place-items-center">
              <h3 className="font-medium text-black dark:text-white">
                Post Detail Information
              </h3>
            </div>
            <div className="p-7">
              <div className="mb-[22px] flex flex-col gap-[22px] sm:flex-row">
                <div className="w-full sm:w-1/2">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="fullName"
                  >
                    Title
                  </label>
                  <div className="relative ">
                    <span className="absolute left-[18px] top-4">
                      <CiStickyNote className="w-5 h-5 stroke-slate-400 stroke-1 icons" />
                    </span>
                    <input
                      className="w-full rounded-xl shadow-xl border border-[#e2e8f0] bg-gray py-3 px-[46px] text-black focus:border-blue-400 focus-visible:outline-none dark:border-[#e2e8f0] dark dark:bg-meta-4 dark:text-white dark:focus:border-blue-400"
                      type="text"
                      name="fullName"
                      id="fullName"
                      placeholder="How can we reduce development speed."
                      value={title}
                      onChange={(e: any) => {
                        setTitle(e.target.value);
                      }}
                    />
                    <button
                      className="absolute right-[18px] top-4 rounded-full"
                      onClick={() => postGenerate("title")}
                    >
                      <RiRobot3Line className="w-5 h-5 stroke-slate-400 hover:stroke-slate-800 stroke-1 icons" />
                    </button>
                  </div>
                </div>

                <div className="w-full sm:w-1/2">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="phoneNumber"
                  >
                    Tags
                  </label>
                  <div className="relative">
                    <span className="absolute left-[18px] top-4">
                      <CiShoppingTag className="w-5 h-5 stroke-slate-400 stroke-1 icons" />
                    </span>
                    <input
                      className="w-full rounded-xl shadow-xl border border-[#e2e8f0] bg-gray py-3 px-[46px] text-black focus:border-blue-400 focus-visible:outline-none dark:border-[#e2e8f0] dark dark:bg-meta-4 dark:text-white dark:focus:border-blue-400"
                      type="text"
                      name="phoneNumber"
                      id="phoneNumber"
                      placeholder="#Techonology #Industry #Art..."
                      value={tags}
                      onChange={(e: any) => {
                        setTags(e.target.value);
                      }}
                    />
                    <button
                      className="absolute right-[18px] top-4 rounded-full"
                      onClick={() => postGenerate("tags")}
                    >
                      <RiRobot3Line className="w-5 h-5 stroke-slate-400 hover:stroke-slate-800 stroke-1 icons" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="mb-[22px]">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="Username"
                >
                  Content
                </label>
                <div className="relative">
                  <span className="absolute left-[18px] top-4">
                    <CiEdit className="w-5 h-5 stroke-slate-400 stroke-1 icons" />
                  </span>

                  <textarea
                    className="w-full rounded-xl shadow-xl border border-[#e2e8f0] bg-gray py-3 px-[46px] text-black focus:border-blue-400 focus-visible:outline-none dark:border-[#e2e8f0] dark dark:bg-meta-4 dark:text-white dark:focus:border-blue-400"
                    name="bio"
                    id="bio"
                    rows={6}
                    placeholder="Write the content here"
                    value={content}
                    onChange={(e: any) => {
                      setContent(e.target.value);
                    }}
                  ></textarea>
                  <button
                    className="absolute right-[18px] top-4 rounded-full"
                    onClick={() => postGenerate("content")}
                  >
                    <RiRobot3Line className="w-5 h-5 stroke-slate-400 hover:stroke-slate-800 stroke-1 icons" />
                  </button>
                </div>
              </div>

              <div className="mx-0">
                <label
                  className="mb-3 block text-sm font-medium text-black dark:text-white"
                  htmlFor="Username"
                >
                  Image
                </label>
                <div className="w-full flex flex-row justify-start">
                  {imageUrl ? (
                    <Image
                      className="rounded-xl"
                      src={imageUrl}
                      alt={`avatar`}
                      width={360}
                      height={240}
                    />
                  ) : (
                    <div className="w-96 h-48 border shadow-xl border-dashed border-spacing-3 bg-white border-slate-400 rounded-xl"></div>
                  )}

                  {!imageUrl && (
                    <div className="z-40 absolute pl-40 pt-16">
                      <button
                        onClick={handleButtonClick}
                        className="w-16 h-16 rounded-full bg-slate-100 p-1.5 opacity-90 shadow dark:bg-gray-500 hover:bg-white border-dashed border border-slate-200 dark:opacity-60 flex flex-row justify-center place-items-center"
                      >
                        {loading ? (
                          <Loading size={5} />
                        ) : (
                          <CiSaveUp2
                            className="h-8 w-8 text-black dark:text-white"
                            aria-hidden="true"
                          />
                        )}
                      </button>
                    </div>
                  )}
                </div>

                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange}
                />
              </div>

              <div className="flex justify-end gap-[18px]">
                <button
                  className="flex justify-center rounded-xl bg-slate-100 bg-primary px-6 py-2 font-medium text-gray hover:shadow-xl border border-slate-400"
                  onClick={onPostSubmit}
                >
                  Save
                </button>
                <button
                  className="flex justify-center rounded-xl bg-slate-100 border border-slate-400 px-6 py-2 font-medium text-black hover:shadow-xl dark:border-[#e2e8f0] dark dark:text-white"
                  onClick={() => router.push(`/personal/${userInfo?.id}`)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddPost;
