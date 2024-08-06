"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUser, FaBuilding, FaCreditCard, FaListAlt } from "react-icons/fa";

const Sidebar = () => {
  const pathname = usePathname();
  const activeItem = pathname.split("/").pop();

  return (
    <div className="p-4">
      <p className="mb-8 text-3xl font-semibold">Settings</p>
      <ul className="space-y-2">
        <li>
          <Link
            href="/app/settings/my-profile"
            className={`text-lg text-gray-700 hover:bg-primary-50 flex items-center p-2 rounded-lg bg-opacity-50 min-w-60 ${
              activeItem === "my-profile"
                ? "bg-primary-500 bg-opacity-10 text-primary-500"
                : ""
            }`}
          >
            <FaUser className="mr-2" />
            My Profile
          </Link>
        </li>
        <li>
          <Link
            href="/app/settings/company-profile"
            className={`text-lg text-gray-700 hover:bg-primary-50 flex items-center p-2 rounded-lg bg-opacity-50 min-w-60 ${
              activeItem === "company-profile"
                ? "bg-primary-500 bg-opacity-10 text-primary-500"
                : ""
            }`}
          >
            <FaBuilding className="mr-2" />
            Company Profile
          </Link>
        </li>
        <li>
          <Link
            href="/app/settings/billing"
            className={`text-lg text-gray-700 hover:bg-primary-50 flex items-center p-2 rounded-lg bg-opacity-50 min-w-60 ${
              activeItem === "billing"
                ? "bg-primary-500 bg-opacity-10 text-primary-500"
                : ""
            }`}
          >
            <FaCreditCard className="mr-2" />
            Billing
          </Link>
        </li>
        <li>
          <Link
            href="/app/settings/plans"
            className={`text-lg text-gray-700 hover:bg-primary-50 flex items-center p-2 rounded-lg bg-opacity-50 min-w-60 ${
              activeItem === "plans"
                ? "bg-primary-500 bg-opacity-10 text-primary-500"
                : ""
            }`}
          >
            <FaListAlt className="mr-2" />
            Plans
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
