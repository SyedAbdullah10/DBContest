'use client';

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function UserDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/user');
    },
  });

  const handleLogout = async () => {
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: "/user"
      });
      router.push('/user');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session || session.user.role !== "user") {
    return redirect("/user");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-white mb-4">
        Welcome, {session.user.name || session.user.username}
      </h1>
      <button
        onClick={handleLogout}
        className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 border border-red-400/30"
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg" 
          className="h-5 w-5" 
          viewBox="0 0 20 20" 
          fill="currentColor"
        >
          <path 
            fillRule="evenodd" 
            d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4.414L11.414 5H15v2.414zM4 5h6.586L14 8.414V15H4V5z" 
            clipRule="evenodd" 
          />
        </svg>
        Logout
      </button>
    </div>
  );
}
