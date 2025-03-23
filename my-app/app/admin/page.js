"use client";

import React, { useState } from "react";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import Logo from "../Components/Logo";
import { signIn } from "next-auth/react";
import { getSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const InputField = ({ Icon, type, placeholder, value, onChange }) => {
  return (
    <div className="w-full">
      <div className="flex items-center bg-black/40 backdrop-blur-lg shadow-lg rounded-full py-3 px-5 hover:bg-black/50 transition-all border border-red-500/30">
        <div className="bg-gradient-to-br from-red-500 to-red-800 rounded-full p-3 flex items-center justify-center shadow-md">
          <Icon className="text-white text-xl" />
        </div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="flex-1 bg-transparent ml-4 p-2 text-white placeholder-white/60 text-lg outline-none"
        />
      </div>
    </div>
  );
};

const ButtonField = ({ Icon, btnText, type, onClick }) => {
  return (
    <div className="w-full">
      <button className="flex items-center justify-center gap-3 w-full rounded-full py-3 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white text-xl font-bold shadow-lg hover:from-red-700 hover:to-red-800 transition-all border border-red-400/30"
        type={type}
        onClick={onClick}
      >
        <Icon className="text-xl" />
        {btnText}
      </button>
    </div>
  );
};

const AdminLogin = () => {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
        role: 'admin' // Add this to route to admin login
      });
  
      if (result?.error) {
        setError(result.error);
      } else {
        // Check role before redirecting
        const session = await getSession();
        if (session?.user?.role === 'admin') {
          router.push("/admin/dashboard");
        } else {
          setError("Unauthorized access");
          router.push("/admin");
        }
      }
    } catch (error) {
      setError("An error occurred during login");
    }
  };

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
          <InputField Icon={FaUser} type="text" placeholder="Username" value={identifier} onChange={(e) => setIdentifier(e.target.value)} />
          <InputField Icon={FaLock} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          <ButtonField Icon={FaSignInAlt} btnText="LOGIN" type="submit" onClick={handleSubmit} />
          {error && (
                  <div className="text-red-500 text-sm mt-2 text-center">
                    {error}
                  </div>
          )}
        </div>

        <a
          href="#"
          className="text-white/70 mt-8 text-lg hover:text-red-400 transition-colors"
        >
          Forgot password?
        </a>
      </motion.div>

      {/* Version indicator */}
      <div className="absolute bottom-4 right-4 text-white/40 text-sm">
        Admin Portal v2.0
      </div>
    </main>
  );
};

export default AdminLogin;
