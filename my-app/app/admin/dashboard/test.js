"use client";

import React, { useState } from "react";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import Logo from "../Components/Logo";

const InputField = ({ Icon, type, placeholder }) => {
  return (
    <div className="w-full">
      <div className="flex items-center bg-black/40 backdrop-blur-lg shadow-lg rounded-full py-3 px-4 hover:bg-black/50 transition-all border border-red-500/30">
        <div className="bg-gradient-to-br from-red-500 to-red-800 rounded-full p-3 flex items-center justify-center shadow-md">
          <Icon className="text-white text-xl" />
        </div>
        <input
          type={type}
          placeholder={placeholder}
          className="flex-1 bg-transparent ml-4 p-2 text-white placeholder-white/60 text-lg outline-none"
        />
      </div>
    </div>
  );
};

const ButtonField = ({ Icon, btnText }) => {
  return (
    <div className="w-full">
      <button className="flex items-center justify-center gap-3 w-full rounded-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white text-xl font-bold shadow-lg hover:from-red-700 hover:to-red-800 transition-all border border-red-400/30">
        <Icon className="text-xl" />
        {btnText}
      </button>
    </div>
  );
};


const AdminLogin = () => {
  return (
    <main className="flex flex-col justify-center items-center h-screen w-full">
      {/* Login container with animation */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center w-full max-w-2xl px-8 py-12 bg-black/40 backdrop-blur-xl shadow-2xl rounded-3xl border border-red-500/20 z-10"
      >
        {/* Logo and Header side by side */}
        <div className="w-full flex items-center gap-4 mb-6">
          <Logo />
          <h1 className="text-white text-4xl font-bold tracking-wide">
            ADMIN LOGIN
          </h1>
        </div>

        <div className="w-full space-y-6">
          <InputField Icon={FaUser} type="text" placeholder="Username" />
          <InputField Icon={FaLock} type="password" placeholder="Password" />
          <ButtonField Icon={FaSignInAlt} btnText="LOGIN" />
        </div>

        <a
          href="#"
          className="text-white/70 mt-8 text-lg hover:text-red-400 transition-colors"
        >
          Forgot password?
        </a>
      </motion.div>

      {/* Contest Tabs Section */}
      <ContestTabs />

      {/* Version indicator */}
      <div className="absolute bottom-4 right-4 text-white/40 text-sm">
        Admin Portal v2.0
      </div>
    </main>
  );
};

export default AdminLogin;
