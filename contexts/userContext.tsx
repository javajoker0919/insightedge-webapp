"use client";
import { supabase } from "@/supabase";
import { useRouter } from "next/navigation";
import {
  createContext,
  useState,
  ReactNode,
  useContext,
  useEffect,
} from "react";

interface UserContextProps {
  isAuth: any | null;
  setIsAuth: (isAuth: any | null) => void;
  userInfo: any | null;
  setUserInfo: (userInfo: any | null) => void;
  isChangePassword: any | null;
  setIsChangePassword: (isChangePassword: any | null) => void;
}

export const UserContext = createContext<UserContextProps>({
  isAuth: null,
  setIsAuth: () => {},
  userInfo: null,
  setUserInfo: () => {},
  isChangePassword: null,
  setIsChangePassword: () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [userInfo, setUserInfo] = useState<object | null | undefined | any>();
  const [isAuth, setIsAuth] = useState<boolean | null>(false);
  const [isChangePassword, setIsChangePassword] = useState<boolean | null>();
  const router = useRouter();
  let storageUserInfo: any;
  const fetchUserData = async () => {
    storageUserInfo = localStorage.getItem("userInfo");
    if (storageUserInfo) {
      storageUserInfo = JSON.parse(storageUserInfo);
    }
    if (storageUserInfo) {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("email", storageUserInfo.email)
        .single();
      if (data) {
        setUserInfo(data);
        setIsAuth(true);
      }
    }
  };
  useEffect(() => {
    fetchUserData();
  }, [isAuth]);

  supabase.auth.onAuthStateChange(async (event, session) => {
    if (event == "PASSWORD_RECOVERY") {
      setIsChangePassword(true);
      router.push("/resetpassword");
    }
  });

  return (
    <UserContext.Provider
      value={{
        isAuth,
        setIsAuth,
        userInfo,
        setUserInfo,
        isChangePassword,
        setIsChangePassword,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};
