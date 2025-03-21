import React from "react";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import Image from "next/image";

const InputField = ({ Icon, type, placeholder }) => {
  return (
    <div className="w-full">
      <div className="flex items-center bg-black/40 backdrop-blur-lg shadow-lg rounded-full p-4 hover:bg-black/50 transition-all border border-red-500/30">
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
      <button className="flex items-center justify-center gap-3 w-full rounded-full p-4 bg-gradient-to-r from-red-600 to-red-700 text-white text-xl font-bold shadow-lg hover:from-red-700 hover:to-red-800 transition-all border border-red-400/30">
        <Icon className="text-xl" />
        {btnText}
      </button>
    </div>
  );
};

const AdminLogin = () => {
  return (
    <main className="flex flex-col justify-center items-center h-screen w-full bg-black bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.3),rgba(0,0,0,0.9))]">
      {/* Background pattern overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMyMjIiIG9wYWNpdHk9IjAuMiI+PC9wYXRoPgo8L3N2Zz4=')] opacity-20"></div>

      {/* Login container */}
      <div className="flex flex-col items-center w-full max-w-md px-8 py-12 bg-black/40 backdrop-blur-xl shadow-2xl rounded-3xl border border-red-500/20 z-10">
        {/* Logo and Header side by side */}
        <div className="w-full flex items-center gap-4 mb-6">
          <Image
            className="h-16 w-auto mix-blend-color-darken rounded-full filter drop-shadow-lg"
            src="/assets/devday_diamond.jpg"
            alt="Logo"
            width={64} // Adjust size as needed
            height={64} // Adjust size as needed
            priority // Ensures the image loads quickly
          />
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
      </div>

      {/* Version indicator */}
      <div className="absolute bottom-4 right-4 text-white/40 text-sm">
        Admin Portal v2.0
      </div>
    </main>
  );
};

export default AdminLogin;
