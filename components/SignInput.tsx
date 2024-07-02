import React from "react";

const AuthInput = ({ type, title, placeholder, error, ...rest }: any) => {
  return (
    <div>
      <input
        className="text-bgray-800 dark:text-white dark:bg-darkblack-500 dark:border-darkblack-400 text-base border border-bgray-300 h-14 w-full focus:border-success-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-bgray-500 placeholder:text-base "
        placeholder={title}
        type={type}
        {...rest}
      />
      <p className={error ? `block pt-1 text-red-600` : "hidden"}>{error}</p>
    </div>
  );
};

export default AuthInput;
