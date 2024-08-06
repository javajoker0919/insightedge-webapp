"use client";
import { useAtomValue } from "jotai";
import { userInfoAtom } from "@/utils/atoms";

const MyProfile = () => {
  const userInfo = useAtomValue(userInfoAtom);

  return (
    <div className="m-auto p-10 max-w-lg bg-white">
      <h1 className="text-2xl font-bold mb-10">My Profile</h1>
      <div className="text-lg space-y-4">
        <div>
          <strong>Email:</strong>
          <input
            type="text"
            value={userInfo?.email}
            disabled
            className="ml-4 p-2 border rounded"
          />
        </div>
        <div>
          <strong>First Name:</strong>
          <input
            type="text"
            value={userInfo?.firstName}
            disabled
            className="ml-4 p-2 border rounded"
          />
        </div>
        <div>
          <strong>Last Name:</strong>
          <input
            type="text"
            value={userInfo?.lastName}
            disabled
            className="ml-4 p-2 border rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
