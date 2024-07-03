import React from "react";

const AuthInput = ({ type, title, placeholder, error, ...rest }: any) => {
  return (
    <div>
      <input
        className="text-gray-800 text-base border border-gray-300 h-10 w-full focus:border-slate-300 focus:ring-0 rounded-lg px-4 py-3.5 placeholder:text-slate-500 placeholder:text-base"
        placeholder={title}
        type={type}
        {...rest}
      />
      <p className={error ? `block pt-1 text-red-600` : "hidden"}>{error}</p>
    </div>
  );
};

export default AuthInput;
