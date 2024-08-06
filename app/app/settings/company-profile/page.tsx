"use client";
import { useAtomValue } from "jotai";
import { orgInfoAtom } from "@/utils/atoms";

const CompanyProfile = () => {
  const orgInfo = useAtomValue(orgInfoAtom);

  return (
    <div className="m-auto shrink-0 p-10 max-w-xl bg-white">
      <h1 className="text-2xl text-center font-bold mb-10">Company Profile</h1>
      <div className="text-lg space-y-8 min-w-96">
        <div>
          <strong>Name:</strong>
          <div className="p-2 border bg-gray-50 mt-1 min-h-11 rounded">
            {orgInfo?.name}
          </div>
        </div>
        <div>
          <strong>Website:</strong>
          <div className="p-2 border bg-gray-50 mt-1 min-h-11 rounded">
            {orgInfo?.website}
          </div>
        </div>
        <div>
          <strong>Overview:</strong>
          <div className="p-2 border bg-gray-50 mt-1 min-h-11 rounded">
            {orgInfo?.overview}
          </div>
        </div>
        <div>
          <strong>Products and Services:</strong>
          <div className="p-2 border bg-gray-50 mt-1 min-h-11 rounded">
            {orgInfo?.products}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyProfile;
