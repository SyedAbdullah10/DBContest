import React from "react";
import { ImSpinner2 } from "react-icons/im";
import { FaSignInAlt } from "react-icons/fa";

const LogoutButton = ({ onClick, isLoading }) => {
  return (
    <button
      className={`bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-5 py-2 transition-colors duration-200 flex items-center gap-2 border border-red-400/30 rounded-full ${
        isLoading ? "opacity-50 cursor-not-allowed" : ""
      }`}
      onClick={onClick}
      disabled={isLoading}
    >
      {isLoading ? (
        <>
          <ImSpinner2 className="text-xl animate-spin" /> Logging out...
        </>
      ) : (
        <>
          <FaSignInAlt className="text-xl" /> Logout
        </>
      )}
    </button>
  );
};

export default LogoutButton;
