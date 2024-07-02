"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  FaInstagram,
  FaDribbble,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

const Footer = () => {
  const socialLinks = [
    { label: "YouTube", icon: FaYoutube },
    { label: "Instagram", icon: FaInstagram },
    { label: "Twitter", icon: FaXTwitter },
    { label: "Dribbble", icon: FaDribbble },
  ];

  const links = [
    [
      { label: "Company", key: "header-1" },
      { label: "About us", key: "item-1-1" },
      { label: "Blog", key: "item-1-2" },
      { label: "Contact us", key: "item-1-3" },
      { label: "Pricing", key: "item-1-4" },
      { label: "Testimonials", key: "item-1-5" },
    ],
    [
      { label: "Support", key: "header-2" },
      { label: "Help center", key: "item-2-1" },
      { label: "Terms of service", key: "item-2-2" },
      { label: "Legal", key: "item-2-3" },
      { label: "Privacy policy", key: "item-2-4" },
      { label: "Status", key: "item-2-5" },
    ],
  ];
  const [show, setShow] = useState<boolean>(false);
  const pathname = usePathname();

  const authURLs = ["/signin", "/signup", "/resetpassword"];

  useEffect(() => {
    if (authURLs.includes(pathname)) {
      setShow(true);
    }
  }, [pathname]);

  return (
    <>
      {show ? (
        <></>
      ) : (
        <div
          className="w-full flex items-end justify-center font-poppins border border-t-slate-200"
          style={{ boxShadow: "0 -4px 10px rgba(0, 0, 0, 0.3)" }}
        >
          <div className="py-16 max-w-7xl grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 text-white w-full p-4 relative gap-10">
            <div className="flex flex-col gap-3">
              <div className="footer-img flex items-center text-slate-800">
                <span className="text-3xl font-bold pl-2 text-slate-800">
                  Insightedge
                </span>
              </div>
              <div className="text-gray-400">
                <span>Copyright © 2024 Nexthq lnc.</span>
                <span>All rights reserved</span>
              </div>
              <div className="footer-icons flex items-center space-x-3">
                {socialLinks.map((socialLink, index) => {
                  const Icon = socialLink.icon;
                  return (
                    <Icon
                      key={`social-${index}`}
                      className="w-8 h-8 p-2 rounded-full bg-slate-700 hover:bg-white hover:text-slate-700 cursor-pointer"
                    />
                  );
                })}
              </div>
            </div>
            <div className="mx-2 grid w-full py-5 sm:py-0 grid-cols-2 ">
              {links.map((col, index) => {
                return (
                  <ul className={`col col-${index + 1}`} key={`col-${index}`}>
                    {col.map((link, index) => {
                      return (
                        <li
                          key={`link-${col}-${index}`}
                          className={`text-gray-400 cursor-pointer ${
                            link.key === "header-1" || link.key === "header-2"
                              ? "text-2xl text-slate-600 hover:text-slate-800"
                              : "hover:text-slate-600"
                          }`}
                        >
                          {link.label}
                        </li>
                      );
                    })}
                  </ul>
                );
              })}
            </div>
            <div className="footer-form flex flex-col  ">
              <label className="text-lg font-semibold text-slate-800">
                Stay up to date
              </label>
              <input
                type="email"
                placeholder="Subscribe to our email"
                className="mt-2 bg-slate-700 w-full border-none rounded-lg py-3 px-6 placeholder:text-slate-500"
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Footer;
