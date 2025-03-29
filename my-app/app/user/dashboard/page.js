'use client';
import { useState, useEffect } from "react";
import { FaUsers, FaPlusCircle, FaClipboardList } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Logo from "@/app/Components/Logo";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import supabase from "@/supabaseClient";
import LogoutButton from "@/app/Components/LogoutButton";

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

const ContestTabs = ({ contests }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("upcoming");

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
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
              ? "Upcoming Contests"
              : tab === "ongoing"
              ? "Ongoing Contests"
              : "Finished Contests"}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {contests[activeTab].map((contest) => (
          <div
            key={contest.id}
            onClick={() => router.push(`/user/dashboard/contest/${contest.id}`)}
            className="bg-black/50 backdrop-blur-lg p-4 rounded-xl mb-4 border border-red-500/30 shadow-lg hover:bg-black/60 cursor-pointer"
          >
            <h3 className="text-white text-2xl font-bold">{contest.name}</h3>
            <p className="text-white/70">Date: {contest.date}</p>
            <p className="text-white/70">Starting On: {contest.startTime}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default function UserDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/user");
    },
  });

  const [contests, setContests] = useState({
    upcoming: [],
    ongoing: [],
    finished: []
  }); 

  // Sample contests data
  // const contests = {
  //   upcoming: [
  //     { id: 1, title: "Spring Coding Challenge", date: "April 15, 2025" },
  //     { id: 2, title: "AI Hackathon", date: "May 10, 2025" },
  //   ],
  //   ongoing: [
  //     { id: 3, title: "Data Structures Contest", date: "March 25, 2025" },
  //     { id: 4, title: "Web Development Sprint", date: "March 30, 2025" },
  //   ],
  //   finished: [
  //     { id: 5, title: "Winter Data Science Contest", date: "March 5, 2025" },
  //     { id: 6, title: "Cybersecurity CTF", date: "February 20, 2025" },
  //   ],
  // };

  useEffect(() => {
    const fetchContests = async () => {
      const { data, error } = await supabase
        .from('Contests')
        .select('*')
        .order('date', { ascending: true }); // Adjust ordering as needed

        console.log(data)

      if (error) {
        console.error("Error fetching contests:", error);
      } else {
        // Organize contests into the desired structure
        const organizedContests = {
          upcoming: [],
          ongoing: [],
          finished: []
        };

        data.forEach(contest => {
          if (contest.status === 'upcoming') {
            organizedContests.upcoming.push(contest);
          } else if (contest.status === 'ongoing') {
            organizedContests.ongoing.push(contest);
          } else if (contest.status === 'finished') {
            organizedContests.finished.push(contest);
          }
        });

        setContests(organizedContests);
      }
    };

    fetchContests();
  }, []);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await signOut({
        redirect: false,
        callbackUrl: "/user",
      });
      setIsLoggingOut(false);
      router.push("/user");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session || session.user.role !== "user") {
    return redirect("/user");
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
              <h1 className="text-white text-4xl font-bold">User Dashboard</h1>
              <p className="text-red-400/90 text-lg ml-[0px]">
                {session.user.name || session.user.username}
              </p>
            </div>
          </div>
        </div>
        <LogoutButton isLoading={isLoggingOut} onClick={handleLogout} />
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        <DashboardCard
          Icon={FaClipboardList}
          title="View Contests"
          description="See available and ongoing SQL contests."
          onClickHandler={() => {}}
        />
        <DashboardCard
          Icon={FaPlusCircle}
          title="Practice SQL"
          description="Practice SQL queries and improve your skills."
          onClickHandler={() => {}}
        />
        <DashboardCard
          Icon={FaUsers}
          title="Leaderboard"
          description="Check your ranking and contest performance."
          onClickHandler={() => {}}
        />
      </div>
      <ContestTabs contests={contests} />
    </motion.div>
  );
}
