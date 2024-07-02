"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { CiMail, CiBellOn } from "react-icons/ci";

import { supabase } from "@/supabase";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { useUserContext } from "@/contexts/userContext";

const Header = () => {
  const router = useRouter();
  const { userInfo, setUserInfo, isAuth, setIsAuth } = useUserContext();

  return (
    <div className="w-full z-20 flex flex-row justify-center top-0 sticky bg-slate-200 shadow-lg">
      <div className="py-2 px-4 z-10 w-full shadow-blue-100 border-b-sky-100 max-w-7xl items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <div
            className="text-4xl font-mono font-black cursor-pointer"
            onClick={() => window.location.reload()}
          >
            AI-BLOG
          </div>
        </div>
        <div className="flex flex-row justify-center gap-10 text-xl font-mono place-items-center items-center">
          <div
            className="cursor-pointer hover:text-slate-500"
            onClick={() => router.push("/")}
          >
            Home
          </div>
          <div
            className="cursor-pointer hover:text-slate-500"
            onClick={() => router.push("/posts")}
          >
            Blog
          </div>
          {isAuth && (
            <div
              className="cursor-pointer hover:text-slate-500"
              onClick={() => router.push(`/personal/${userInfo?.id}`)}
            >
              My Post
            </div>
          )}
          <div className="cursor-pointer hover:text-slate-500">Contact</div>
        </div>
        <div className="py-2 flex flex-row justify-center gap-4 text-base">
          {!isAuth ? (
            <>
              <button
                className="p-2 px-4 font-bold font-mono rounded-lg bg-white text-black hover:bg-slate-300"
                onClick={() => router.push("/signin")}
              >
                Sign In
              </button>
              <button
                className="p-2 px-4 font-bold font-mono rounded-lg bg-white text-black hover:bg-slate-300"
                onClick={() => router.push("/signup")}
              >
                Sign Up
              </button>
            </>
          ) : (
            <div className="flex flex-row gap-8">
              <div className=" flex flex-row justify-center place-items-center gap-4">
                <CiBellOn
                  className="w-7 h-7 font-bold"
                  width={40}
                  height={40}
                />
                <CiMail className="w-7 h-7 font-bold" width={40} height={40} />
              </div>
              <Menu>
                <MenuButton className="inline-flex items-center gap-2 rounded-full text-sm/6 font-semibold text-white shadow-inner shadow-white/10 focus:outline-none data-[hover]:bg-gray-700 data-[open]:bg-gray-700 data-[focus]:outline-1 data-[focus]:outline-white">
                  <Image
                    className="rounded-full border-2 border-green-600"
                    src={
                      userInfo?.avatar_url
                        ? userInfo.avatar_url
                        : "https://xtcrjordvnddzvchmpvd.supabase.co/storage/v1/object/public/images/empty_avatar.jpeg"
                    }
                    alt="google_logo"
                    width={48}
                    height={48}
                  />
                </MenuButton>

                <MenuItems
                  transition
                  anchor="bottom end"
                  className="z-30 w-52 mt-2 origin-top-right rounded-xl border border-slate-500/20 bg-slate-800/50 p-1 text-sm/6 text-white transition duration-100 ease-out [--anchor-gap:var(--spacing-1)] focus:outline-none data-[closed]:scale-95 data-[closed]:opacity-0"
                >
                  <MenuItem>
                    <button className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/80 data-[focus]:text-black">
                      {/* <PencilIcon className="size-4 fill-white/30" /> */}
                      My Profile
                      <kbd className="ml-auto hidden font-sans text-xs text-black/50 group-data-[focus]:inline">
                        ⌘P
                      </kbd>
                    </button>
                  </MenuItem>
                  <MenuItem>
                    <button
                      className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/80 data-[focus]:text-black"
                      onClick={() => router.push("/settings")}
                    >
                      {/* <PencilIcon className="size-4 fill-white/30" /> */}
                      Settings
                      <kbd className="ml-auto hidden font-sans text-xs text-black/50 group-data-[focus]:inline">
                        ⌘S
                      </kbd>
                    </button>
                  </MenuItem>
                  <div className="my-1 h-px bg-white/50" />
                  <MenuItem>
                    <button
                      className="group flex w-full items-center gap-2 rounded-lg py-1.5 px-3 data-[focus]:bg-white/80 data-[focus]:text-black"
                      onClick={async () => {
                        localStorage.removeItem("userInfo");
                        setIsAuth(false);
                        setUserInfo({});
                        await supabase.auth.signOut();
                        router.push("/");
                      }}
                    >
                      Log out
                      <kbd className="ml-auto hidden font-sans text-xs text-black/50 group-data-[focus]:inline">
                        ⌘L
                      </kbd>
                    </button>
                  </MenuItem>
                </MenuItems>
              </Menu>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
