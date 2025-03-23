"use client";
import { useState } from "react";
import { FaUsers, FaPlusCircle, FaClipboardList, FaSignOutAlt } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Logo from "@/app/Components/Logo";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
const DashboardCard = ({ Icon, title, description, onClickHandler }) => {
  return (
    <div
      onClick={onClickHandler}
      className="bg-black/40 backdrop-blur-lg shadow-lg p-6 rounded-2xl border border-red-500/30 hover:bg-black/50 hover:cursor-pointer hover:scale-105 transition-all"
    >
      <div className="flex items-center gap-4 mb-3">
        <Icon className="text-red-500 text-3xl" />
        <h2 className="text-white text-xl font-semibold">{title}</h2>
      </div>
      <p className="text-white/70 text-sm">{description}</p>
    </div>
  );
};

const ContestTabs = () => {
  const [activeTab, setActiveTab] = useState("upcoming");
  const contests = {
    upcoming: [
      { id: 1, title: "Spring Coding Challenge", date: "April 15, 2025" },
      { id: 2, title: "AI Hackathon", date: "May 10, 2025" },
    ],
    ongoing: [
      { id: 5, title: "Data Structures Contest", date: "March 25, 2025" },
      { id: 6, title: "Web Development Sprint", date: "March 30, 2025" },
    ],
    finished: [
      { id: 3, title: "Winter Data Science Contest", date: "March 5, 2025" },
      { id: 4, title: "Cybersecurity CTF", date: "February 20, 2025" },
    ],
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      {/* Tab Buttons */}
      <div className="flex mb-4 border-b border-red-500/50">
        {["upcoming", "ongoing", "finished"].map((tab) => (
          <button
            key={tab}
            className={`flex-1 text-lg font-semibold py-2 transition-all ${
              activeTab === tab
                ? "border-b-4 border-red-500 text-red-500"
                : "text-white hover:text-red-400"
            }`}
            onClick={() => setActiveTab(tab)}
          >
            {tab === "upcoming"
              ? "Ongoing Contests"
              : tab === "ongoing"
              ? "Upcoming Contests"
              : "Finished Contests"}
          </button>
        ))}
      </div>

      {/* Contest Cards */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {contests[activeTab].map((contest) => (
          <div
            key={contest.id}
            className="bg-black/50 backdrop-blur-lg p-4 rounded-xl mb-4 border border-red-500/30 shadow-lg"
          >
            <h3 className="text-white text-2xl font-bold">{contest.title}</h3>
            <p className="text-white/70">Date: {contest.date}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

const AdminDashboard = () => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/admin');
    },
  });

  const handleLogout = async () => {
    try {
      await signOut({ 
        redirect: false,
        callbackUrl: "/admin"
      });
      router.push('/admin');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session || session.user.role !== "admin") {
    return redirect("/admin");
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex flex-col gap-5 items-center h-screen w-full px-6 py-10"
    >
      {/* Dashboard Header with Logout Button */}
      <div className="flex items-center justify-between w-full max-w-5xl mb-8">
        <div className="flex flex-col">
          <div className="flex items-center">
            <Logo />
            <div>
              <h1 className="text-white text-4xl font-bold">Admin Dashboard</h1>
              <p className="text-red-400/90 text-lg ml-[0px]">
                {session.user.name || session.user.username}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 border border-red-400/30"
        >
          <FaSignOutAlt className="text-xl" />
          Logout
        </button>
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        <DashboardCard
          Icon={FaClipboardList}
          title="Create Contest"
          description="Set up new database contests for users."
          onClickHandler={() => {
            router.push("/admin/createContest");
          }}
        />
        <DashboardCard
          Icon={FaUsers}
          title="Manage Users"
          description="View, add, or remove users from the app."
          onClickHandler={() => {}}
        />
        <DashboardCard
          Icon={FaPlusCircle}
          title="Add Contestants"
          description="Enroll participants into a contest."
          onClickHandler={() => {}}
        />
      </div>
      <ContestTabs />
    </motion.div>
  );
};

export default AdminDashboard;
