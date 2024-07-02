"use client";
import { createContext, useContext } from "react";
import { toast } from "react-toastify";

const ToastContext = createContext<{
  invokeToast: (
    type: string,
    text: string,
    position: "top" | "middle" | "bottom"
  ) => void;
}>({
  invokeToast: () => {},
});

const ToastProvider = ({ children }: any) => {
  const invokeToast = (
    type: string,
    text: string,
    position: "top" | "middle" | "bottom"
  ) => {
    switch (type) {
      case "success":
        toast.success(text);
        break;
      case "warn":
        toast.warn(text);
        break;
      case "error":
        toast.error(text);
        break;
      case "info":
        toast.info(text);
        break;
      default:
        break;
    }
  };

  return (
    <ToastContext.Provider value={{ invokeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToastContext = () => {
  return useContext(ToastContext);
};

export default ToastProvider;
