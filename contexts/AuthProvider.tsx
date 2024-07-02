"use client";
import { useState, useEffect } from "react";
import {
  useRouter,
  useSearchParams,
  usePathname,
  redirect,
} from "next/navigation";
import { useUserContext } from "./userContext";

const AuthProvider = ({ children }: any) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);

  const { userInfo } = useUserContext();

  const publicPaths = ["/landing", "/posts"];
  const privatePaths = ["/personal", "/posts/add", "/settings"];

  useEffect(() => {
    if (window.location.href.includes("localhost:")) {
      return;
    }
  }, [pathname, userInfo]);

  useEffect(() => {
    if (userInfo) {
      authCheck(true);
    } else if (userInfo === null) {
      authCheck(false);
    }
  }, [pathname, searchParams, userInfo]);

  const authCheck = (isAuth: boolean) => {
    const redirectURLs = ["/signin", "/signup", "/resetpassword"];
    const isPublicURL = publicPaths.some((publicPath) =>
      pathname.startsWith(publicPath)
    );
    const isPrivateURL =
      privatePaths.some((privatePath) => pathname.startsWith(privatePath)) ||
      pathname === "/";

    if (isAuth) {
      // if (pathname.startsWith('/admin') && !(user.role?.indexOf('admin') > -1)) {
      //   router.push("/");
      // } else
      if (redirectURLs.includes(pathname)) {
        router.push("/");
      }
    }

    setIsLoading(false);
  };

  return children;
};

export default AuthProvider;
