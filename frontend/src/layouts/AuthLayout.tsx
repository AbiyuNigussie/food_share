import React from "react";

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex items-center justify-center ">
      <div className="w-full p-8">{children}</div>
    </div>
  );
};

export default AuthLayout;
