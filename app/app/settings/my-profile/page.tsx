"use client";
import { useAtomValue } from "jotai";
import { userInfoAtom } from "@/utils/atoms";
import SettingsSidebar from "../components/Sidebar";

const MyProfile = () => {
  const userInfo = useAtomValue(userInfoAtom);

  return (
    <div className="m-auto p-10 w-[60rem] bg-white">
      <h1 className="text-2xl font-bold mb-10 text-center">My Profile</h1>
      <div className="text-lg space-y-8">
        <div>
          <strong>Email:</strong>
          <div className="p-2 border bg-gray-50 mt-1 rounded">
            {userInfo?.email}
          </div>
        </div>
        <div>
          <strong>First Name:</strong>
          <div className="p-2 border bg-gray-50 mt-1 rounded">
            {userInfo?.firstName}
          </div>
        </div>
        <div>
          <strong>Last Name:</strong>
          <div className="p-2 border bg-gray-50 mt-1 rounded">
            {userInfo?.lastName}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
