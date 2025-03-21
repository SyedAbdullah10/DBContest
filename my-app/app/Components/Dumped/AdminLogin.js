import React from "react";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";

const InputField = ({ Icon, type, placeholder }) => {
  return (
    <div className="w-full">
      <div className="flex items-center bg-white/30 backdrop-blur-lg shadow-md rounded-full p-4 hover:bg-white/50 transition">
        <div className="bg-white rounded-full p-3 flex items-center justify-center shadow-md">
          <Icon className="text-teal-500 text-xl" />
        </div>
        <input
          type={type}
          placeholder={placeholder}
          className="flex-1 bg-transparent ml-4 p-2 text-white placeholder-white/70 text-lg outline-none"
        />
      </div>
    </div>
  );
};

const ButtonField = ({ Icon, btnText }) => {
  return (
    <div className="w-full">
      <button className="flex items-center justify-center gap-3 w-full rounded-full p-4 bg-white text-teal-500 text-xl font-bold shadow-lg hover:bg-gray-100 transition">
        <Icon className="text-xl" />
        {btnText}
      </button>
    </div>
  );
};

const AdminLogin = () => {
  return (
    <main className="flex flex-col justify-center items-center h-screen w-full bg-gradient-to-br from-teal-500 to-blue-500">
      <div className="flex flex-col items-center w-full max-w-md px-6 py-10 bg-white/20 backdrop-blur-lg shadow-xl rounded-3xl">
        <h1 className="text-white text-4xl font-bold mb-8">ADMIN LOGIN</h1>

        {/* <h1 className="text-white text-4xl font-bold mb-2">ADMIN LOGIN</h1>
        <div className="w-16 h-1 bg-white rounded-full mb-6"></div> */}

        <div className="w-full space-y-6">
          <InputField Icon={FaUser} type="text" placeholder="Username" />
          <InputField Icon={FaLock} type="password" placeholder="Password" />
          <ButtonField Icon={FaSignInAlt} btnText="Login" />
        </div>

        <a
          href="#"
          className="text-white opacity-70 mt-6 text-lg hover:underline"
        >
          Forgot password?
        </a>
      </div>
    </main>
  );
};

export default AdminLogin;
