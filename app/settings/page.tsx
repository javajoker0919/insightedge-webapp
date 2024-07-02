"use client";

import { supabase } from "@/supabase";
import Image from "next/image";
import { useRef, useState } from "react";
import {
  CiCamera,
  CiDesktop,
  CiEdit,
  CiMail,
  CiMap,
  CiPhone,
  CiUser,
} from "react-icons/ci";
import { useUserContext } from "../../contexts/userContext";
import { v4 as uuidv4 } from "uuid";
import Loading from "@/components/Loading";

const Settings = () => {
  const [fullName, setFullName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [bio, setBio] = useState<string>("");

  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const { userInfo, setUserInfo } = useUserContext();

  const handleButtonClick = () => {
    if (!fileInputRef.current) return;
    fileInputRef.current.click();
  };

  const removeAvatar = async () => {
    const { data, error } = await supabase
      .from("users")
      .update({
        avatar_url:
          "https://xtcrjordvnddzvchmpvd.supabase.co/storage/v1/object/public/images/empty_avatar.jpeg",
      })
      .eq("email", userInfo?.email)
      .single();
    if (data) {
      console.log("remove successfly");
      setUserInfo((prevProfile: any) => ({
        ...prevProfile,
        avatar_url:
          "https://xtcrjordvnddzvchmpvd.supabase.co/storage/v1/object/public/images/empty_avatar.jpeg",
      }));
    } else {
      console.log("error", error);
    }
  };

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    if (file) {
      let myuuid = uuidv4();
      setLoading(true);
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(`/${userInfo?.id}/${myuuid}`, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) {
        console.log("error uploading file", error);
        setLoading(false);
        // Handle error
      } else {
        const publicUrl = await supabase.storage
          .from("avatars")
          .getPublicUrl(data.path).data.publicUrl;
        if (publicUrl) {
          const { data, error } = await supabase
            .from("users")
            .update({
              avatar_url: publicUrl,
            })
            .eq("email", userInfo?.email)
            .single();
          if (data) {
            console.log("uploaded and changed successfuly");
          } else console.log("error", error);
        }
        setLoading(false);
        setUserInfo((prevProfile: any) => ({
          ...prevProfile,
          avatar_url: publicUrl,
        }));
      }
    }
  };

  const onProfileInfoSubmit = async (e: any) => {
    e.preventDefault();
    const { data, error } = await supabase
      .from("users")
      .update({
        updated_at: new Date(),
        name: fullName || userInfo?.name,
        phone_number: phoneNumber || userInfo?.phone_number,
        description: bio || userInfo?.bio,
        location: location || userInfo?.location,
        role: role || userInfo?.role,
        email: email || userInfo?.email,
      })
      .eq("email", userInfo?.email);
  };

  return (
    <div className="mx-auto max-w-[1080px] max-h-screen pb-20">
      <div className="my-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className=" text-2xl leading-6 font-semibold text-black dark:text-white">
          Settings
        </h2>
      </div>
      <div className="grid grid-cols-5 gap-8">
        <div className="col-span-5 xl:col-span-3">
          <div className="rounded-xl shadow-2xl border border-[#e2e8f0] bg-slate-200 shadow-default dark:border-[#e2e8f0] dark dark:bg-boxdark">
            <div className="border-b border-[#e2e8f0] px-7 py-4 dark:border-[#e2e8f0] dark">
              <h3 className="font-medium text-black dark:text-white">
                Personal Information
              </h3>
            </div>
            <div className="p-7">
              <form onSubmit={onProfileInfoSubmit}>
                <div className="mb-[22px] flex flex-col gap-[22px] sm:flex-row">
                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="fullName"
                    >
                      Full Name
                    </label>
                    <div className="relative">
                      <span className="absolute left-[18px] top-4">
                        <CiUser className="w-5 h-5 stroke-slate-400 stroke-1 icons" />
                      </span>
                      <input
                        className="w-full rounded-xl border border-[#e2e8f0] bg-gray py-3 pl-[46px] pr-[18px] text-black focus:border-blue-400 focus-visible:outline-none dark:border-[#e2e8f0] dark dark:bg-meta-4 dark:text-white dark:focus:border-blue-400"
                        type="text"
                        name="fullName"
                        id="fullName"
                        placeholder="John Doe"
                        defaultValue={userInfo?.name}
                        onChange={(e: any) => {
                          setFullName(e.target.value);
                        }}
                      />
                    </div>
                  </div>

                  <div className="w-full sm:w-1/2">
                    <label
                      className="mb-3 block text-sm font-medium text-black dark:text-white"
                      htmlFor="phoneNumber"
                    >
                      Phone Number
                    </label>
                    <div className="relative">
                      <span className="absolute left-[18px] top-4">
                        <CiPhone className="w-5 h-5 stroke-slate-400 stroke-1 icons" />
                      </span>
                      <input
                        className="w-full rounded-xl border border-[#e2e8f0] bg-gray py-3 pl-[46px] pr-[18px] text-black focus:border-blue-400 focus-visible:outline-none dark:border-[#e2e8f0] dark dark:bg-meta-4 dark:text-white dark:focus:border-blue-400"
                        type="text"
                        name="phoneNumber"
                        id="phoneNumber"
                        placeholder="+1 234 5678 910"
                        defaultValue={userInfo?.phone_number}
                        onChange={(e: any) => {
                          setPhoneNumber(e.target.value);
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="mb-[22px]">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="emailAddress"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <span className="absolute left-[18px] top-4 font-bold">
                      <CiMail className="w-5 h-5 stroke-slate-400 stroke-1 icons" />
                    </span>
                    <input
                      className="w-full rounded-xl border border-[#e2e8f0] bg-gray py-3 pl-[46px] pr-[18px] text-black focus:border-blue-400 focus-visible:outline-none dark:border-[#e2e8f0] dark dark:bg-meta-4 dark:text-white dark:focus:border-blue-400"
                      type="email"
                      name="emailAddress"
                      id="emailAddress"
                      placeholder="johndoe@gmail.com"
                      defaultValue={userInfo?.email}
                      onChange={(e: any) => {
                        setEmail(e.target.value);
                      }}
                    />
                  </div>
                </div>

                <div className="mb-[22px]">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="location"
                  >
                    Location
                  </label>
                  <div className="relative">
                    <span className="absolute left-[18px] top-4">
                      <CiMap className="w-5 h-5 stroke-slate-400 stroke-1 icons" />
                    </span>
                    <input
                      className="w-full rounded-xl border border-[#e2e8f0] bg-gray py-3 pl-[46px] pr-[18px] text-black focus:border-blue-400 focus-visible:outline-none dark:border-[#e2e8f0] dark dark:bg-meta-4 dark:text-white dark:focus:border-blue-400"
                      type="text"
                      name="location"
                      id="location"
                      placeholder="United States"
                      defaultValue={userInfo?.location}
                      onChange={(e: any) => {
                        setLocation(e.target.value);
                      }}
                    />
                  </div>
                </div>

                <div className="mb-[22px]">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="Role"
                  >
                    Role
                  </label>
                  <div className="relative">
                    <span className="absolute left-[18px] top-4">
                      <CiDesktop className="w-5 h-5 stroke-slate-400 stroke-1 icons" />
                    </span>
                    <input
                      className="w-full rounded-xl border border-[#e2e8f0] bg-gray py-3 pl-[46px] pr-[18px] text-black focus:border-blue-400 focus-visible:outline-none dark:border-[#e2e8f0] dark dark:bg-meta-4 dark:text-white dark:focus:border-blue-400"
                      type="text"
                      name="Role"
                      id="Role"
                      placeholder="Developer"
                      defaultValue={userInfo?.role}
                      onChange={(e: any) => {
                        setRole(e.target.value);
                      }}
                    />
                  </div>
                </div>

                <div className="mb-[22px]">
                  <label
                    className="mb-3 block text-sm font-medium text-black dark:text-white"
                    htmlFor="Username"
                  >
                    BIO
                  </label>
                  <div className="relative">
                    <span className="absolute left-[18px] top-4">
                      <CiEdit className="w-5 h-5 stroke-slate-400 stroke-1 icons" />
                    </span>

                    <textarea
                      className="w-full rounded-xl border border-[#e2e8f0] bg-gray py-3 pl-[46px] pr-[18px] text-black focus:border-blue-400 focus-visible:outline-none dark:border-[#e2e8f0] dark dark:bg-meta-4 dark:text-white dark:focus:border-blue-400"
                      name="bio"
                      id="bio"
                      rows={6}
                      placeholder="Write your bio here"
                      defaultValue={userInfo?.description}
                      onChange={(e: any) => {
                        setBio(e.target.value);
                      }}
                    ></textarea>
                  </div>
                </div>

                <div className="flex justify-end gap-[18px]">
                  <button
                    className="flex justify-center rounded-xl bg-slate-100 bg-primary px-6 py-2 font-medium text-gray hover:shadow-xl border border-slate-400"
                    type="submit"
                  >
                    Save
                  </button>
                  <button
                    className="flex justify-center rounded-xl bg-slate-100 border border-slate-400 px-6 py-2 font-medium text-black hover:shadow-xl dark:border-[#e2e8f0] dark dark:text-white"
                    type="submit"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-span-5 xl:col-span-2">
          <div className="rounded-xl shadow-2xl border border-[#e2e8f0] bg-slate-200 dark:border-[#e2e8f0] dark dark:bg-boxdark">
            <div className="border-b border-[#e2e8f0] px-7 py-4 dark:border-[#e2e8f0] dark">
              <h3 className="font-medium text-black dark:text-white">
                Your Photo
              </h3>
            </div>
            <div className="p-7">
              <div className="mb-4 flex items-center gap-3">
                <div className="h-14 w-14 rounded-full">
                  <Image
                    className="rounded-full"
                    src={
                      userInfo?.avatar_url
                        ? userInfo?.avatar_url
                        : "https://xtcrjordvnddzvchmpvd.supabase.co/storage/v1/object/public/images/empty_avatar.jpeg"
                    }
                    width={55}
                    height={55}
                    alt="User"
                  />
                </div>
                <div>
                  <span className="mb-[3px] text-black dark:text-white">
                    Edit your photo
                  </span>
                  <span className="flex gap-[10px] text-black/60">
                    <button
                      className="text-xs hover:text-slate-400"
                      onClick={() => {
                        const isConfirmed = confirm(
                          "Are you remove your current avatar?"
                        );
                        if (isConfirmed) {
                          removeAvatar();
                        }
                      }}
                    >
                      Delete
                    </button>
                    <button
                      className="text-xs hover:text-slate-400"
                      onClick={handleButtonClick}
                    >
                      Update
                    </button>
                  </span>
                </div>
              </div>
              <div className="mx-0">
                <div className="w-full py-8 flex flex-row justify-center">
                  <Image
                    className="rounded-full"
                    src={
                      userInfo?.avatar_url
                        ? userInfo?.avatar_url
                        : "https://xtcrjordvnddzvchmpvd.supabase.co/storage/v1/object/public/images/empty_avatar.jpeg"
                    }
                    alt={`avatar`}
                    width={240}
                    height={240}
                  />

                  <div className="z-40 absolute mt-44 ml-36 flex justify-end">
                    <button
                      onClick={handleButtonClick}
                      className="w-16 h-16 rounded-full bg-white p-1.5 opacity-90 shadow dark:bg-gray-500 dark:opacity-60 flex flex-row justify-center place-items-center"
                    >
                      {loading ? (
                        <Loading size={5} />
                      ) : (
                        <CiCamera
                          className="h-10 w-10 text-black dark:text-white"
                          aria-hidden="true"
                        />
                      )}
                    </button>
                  </div>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileChange} // You can handle the file selection here
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
