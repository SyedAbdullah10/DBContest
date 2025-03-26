import React from "react";
import { ImSpinner2 } from "react-icons/im";
import { FaSignInAlt } from "react-icons/fa";

const LoginButton = ({ onClick, isLoading }) => {
  return (
    <button
      className={`flex items-center justify-center gap-3 w-full rounded-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white text-xl font-bold shadow-lg hover:from-red-700 hover:to-red-800 transition-all border border-red-400/30 ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <ImSpinner2 className="text-xl animate-spin" /> Logging in...
        </>
      ) : (
        <>
          <FaSignInAlt className="text-xl" /> Login
        </>
      )}
    </button>
  );
};

export default LoginButton;
