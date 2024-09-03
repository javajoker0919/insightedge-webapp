"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaUser, FaBuilding, FaCreditCard, FaChartBar } from "react-icons/fa";

const Sidebar = () => {
  const pathname = usePathname();
  const activeItem = pathname.split("/").pop();

  return (
    <div className="px-4 py-6">
      <p className="mb-8 text-3xl font-semibold pl-1">Settings</p>
      <ul className="space-y-2">
        <li>
          <Link
            href="/app/settings/my-profile"
            className={`text-lg text-gray-700 hover:bg-primary-50 flex items-center p-2 rounded-md bg-opacity-50 min-w-60 ${
              activeItem === "my-profile"
                ? "bg-primary-50 text-primary-500"
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
            className={`text-lg text-gray-700 hover:bg-primary-50 flex items-center p-2 rounded-md bg-opacity-50 min-w-60 ${
              activeItem === "company-profile"
                ? "bg-primary-50 text-primary-500"
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
            className={`text-lg text-gray-700 hover:bg-primary-50 flex items-center p-2 rounded-md bg-opacity-50 min-w-60 ${
              activeItem === "billing" ? "bg-primary-50 text-primary-500" : ""
            }`}
          >
            <FaCreditCard className="mr-2" />
            Billing
          </Link>
        </li>
        {/* <li>
          <Link
            href="/app/settings/plans"
            className={`text-lg text-gray-700 hover:bg-primary-50 flex items-center p-2 rounded-md bg-opacity-50 min-w-60 ${
              activeItem === "plans" ? "bg-primary-50 text-primary-500" : ""
            }`}
          >
            <FaListAlt className="mr-2" />
            Plans
          </Link>
        </li> */}
        <li>
          <Link
            href="/app/settings/usage"
            className={`text-lg text-gray-700 hover:bg-primary-50 flex items-center p-2 rounded-md bg-opacity-50 min-w-60 ${
              activeItem === "usage" ? "bg-primary-50 text-primary-500" : ""
            }`}
          >
            <FaChartBar className="mr-2" />
            Usage
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
