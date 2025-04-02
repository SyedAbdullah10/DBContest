"use client";
import { useState, useEffect } from "react";
import { FaUsers, FaPlusCircle, FaClipboardList } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Logo from "@/app/Components/Logo";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import LogoutButton from "@/app/Components/LogoutButton";
import Link from "next/link";

const DashboardCard = ({ Icon, title, description, onClickHandler, goto }) => {
  return (
    <Link href={goto}
      onClick={onClickHandler}
      className="bg-black/40 backdrop-blur-lg shadow-lg p-6 rounded-2xl border border-red-500/30 hover:bg-black/50 hover:cursor-pointer hover:scale-105 transition-all"
    >
      <div className="flex items-center gap-4 mb-3">
        <Icon className="text-red-500 text-3xl" />
        <h2 className="text-white text-xl font-semibold">{title}</h2>
      </div>
      <p className="text-white/70 text-sm">{description}</p>
    </Link>
  );
};

// const ContestTabs = () => {
//   const [activeTab, setActiveTab] = useState("upcoming");
//   const contests = {
//     upcoming: [
//       { id: 1, title: "Spring Coding Challenge", date: "April 15, 2025" },
//       { id: 2, title: "AI Hackathon", date: "May 10, 2025" },
//     ],
//     ongoing: [
//       { id: 5, title: "Data Structures Contest", date: "March 25, 2025" },
//       { id: 6, title: "Web Development Sprint", date: "March 30, 2025" },
//     ],
//     finished: [
//       { id: 3, title: "Winter Data Science Contest", date: "March 5, 2025" },
//       { id: 4, title: "Cybersecurity CTF", date: "February 20, 2025" },
//     ],
//   };

//   return (
//     <div className="w-full max-w-3xl mx-auto mt-8">
//       {/* Tab Buttons */}
//       <div className="flex mb-4 border-b border-red-500/50">
//         {["upcoming", "ongoing", "finished"].map((tab) => (
//           <button
//             key={tab}
//             className={`flex-1 text-lg font-semibold py-2 transition-all ${
//               activeTab === tab
//                 ? "border-b-4 border-red-500 text-red-500"
//                 : "text-white hover:text-red-400"
//             }`}
//             onClick={() => setActiveTab(tab)}
//           >
//             {tab === "upcoming"
//               ? "Ongoing Contests"
//               : tab === "ongoing"
//               ? "Upcoming Contests"
//               : "Finished Contests"}
//           </button>
//         ))}
//       </div>

//       {/* Contest Cards */}
//       <motion.div
//         key={activeTab}
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//       >
//         {contests[activeTab].map((contest) => (
//           <div
//             key={contest.id}
//             className="bg-black/50 backdrop-blur-lg p-4 rounded-xl mb-4 border border-red-500/30 shadow-lg"
//           >
//             <h3 className="text-white text-2xl font-bold">{contest.title}</h3>
//             <p className="text-white/70">Date: {contest.date}</p>
//           </div>
//         ))}
//       </motion.div>
//     </div>
//   );
// };

const contests = {
  upcoming: [
    {
      id: 1,
      name: "Spring Coding Challenge",
      date: "March 29, 2025",
      startTime: "3:00:00 PM",
      endTime: "4:00:00 PM",
    },
    {
      id: 2,
      name: "AI Hackathon",
      date: "March 29, 2025",
      startTime: "3:00:00 PM",
      endTime: "4:00:00 PM",
    },
  ],
  ongoing: [
    {
      id: 5,
      name: "Data Structures Contest",
      date: "March 29, 2025",
      startTime: "3:00:00 PM",
      endTime: "4:00:00 PM",
    },
    {
      id: 6,
      name: "Web Development Sprint",
      date: "March 29, 2025",
      startTime: "3:00:00 PM",
      endTime: "4:00:00 PM",
    },
  ],
  finished: [
    {
      id: 3,
      name: "Winter Data Science Contest",
      date: "March 29, 2025",
      startTime: "3:00:00 PM",
      endTime: "4:00:00 PM",
    },
    {
      id: 4,
      name: "Cybersecurity CTF",
      date: "March 29, 2025",
      startTime: "3:00:00 PM",
      endTime: "4:00:00 PM",
    },
  ],
};

const ContestTabs = ({ contests }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");

  const filterContests = (contests) => {
    return contests?.filter((contest) =>
      contest?.name?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search Contests..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 mb-4 text-white bg-black/50 border border-red-500/40 rounded-lg focus:outline-none focus:border-red-500"
      />

      {/* Tabs */}
      <div className="flex mb-4 border-b border-red-500/50">
        {["upcoming", "ongoing", "finished"]?.map((tab) => (
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
        {activeTab === "upcoming" && (
          <UpcomingContests
            contests={filterContests(contests?.upcoming)}
            router={router}
          />
        )}
        {activeTab === "ongoing" && (
          <OngoingContests
            contests={filterContests(contests?.ongoing)}
            router={router}
          />
        )}
        {activeTab === "finished" && (
          <FinishedContests
            contests={filterContests(contests?.finished)}
            router={router}
          />
        )}
      </motion.div>
    </div>
  );
};

const formatTime = (time) => new Date(time).toLocaleString();

const calculateTimeLeft = (endTime) => {
  const targetTimeUTC = new Date(endTime);

  // Convert UTC time to Pakistan Standard Time (UTC+5)
  const targetTimePST = new Date(targetTimeUTC.getTime() + 5 * 60 * 60 * 1000);
  console.log("Converted Time (PST):", targetTimePST);

  const nowUTC = new Date();
  const nowPST = new Date(nowUTC.getTime() + 5 * 60 * 60 * 1000); // Convert current time to PST
  console.log("Current Time (PST):", nowPST);

  const difference = targetTimePST - nowPST;
  console.log("Time Left in MS:", difference);

  if (difference <= 0) return "00:00:00";

  const hours = String(Math.floor(difference / 3600000)).padStart(2, "0");
  const minutes = String(Math.floor((difference % 3600000) / 60000)).padStart(
    2,
    "0"
  );
  const seconds = String(Math.floor((difference % 60000) / 1000)).padStart(
    2,
    "0"
  );

  return `${hours}:${minutes}:${seconds}`;
};

const UpcomingContests = ({ contests, router }) =>
  contests?.map((contest) => {
    const [timeLeft, setTimeLeft] = useState(
      calculateTimeLeft(contest.startTime)
    );
    useEffect(() => {
      const timer = setInterval(
        () => setTimeLeft(calculateTimeLeft(contest.startTime)),
        1000
      );
      return () => clearInterval(timer);
    }, []);

    return (
      <div
        key={contest.id}
        onClick={() => router.push(`/user/dashboard/contest/${contest.id}`)}
        className="bg-black/50 backdrop-blur-lg p-4 rounded-xl mb-4 border border-red-500/30 shadow-lg hover:bg-black/60 cursor-pointer"
      >
        <h3 className="text-white text-2xl font-bold">{contest.name}</h3>
        <p className="text-white/70">Starts In: {timeLeft}</p>
      </div>
    );
  });

const OngoingContests = ({ contests, router }) =>
  contests?.map((contest) => {
    const [timeLeft, setTimeLeft] = useState(
      calculateTimeLeft(contest.endTime)
    );
    useEffect(() => {
      const timer = setInterval(
        () => setTimeLeft(calculateTimeLeft(contest.endTime)),
        1000
      );
      return () => clearInterval(timer);
    }, []);

    return (
      <div
        key={contest.id}
        onClick={() => router.push(`/user/dashboard/contest/${contest.id}`)}
        className="bg-black/50 backdrop-blur-lg p-4 rounded-xl mb-4 border border-red-500/30 shadow-lg hover:bg-black/60 cursor-pointer"
      >
        <h3 className="text-white text-2xl font-bold">{contest.name}</h3>
        <p className="text-white/70">Ends In: {timeLeft}</p>
      </div>
    );
  });

const FinishedContests = ({ contests, router }) =>
  contests?.map((contest) => (
    <div
      key={contest.id}
      onClick={() => router.push(`/user/dashboard/contest/${contest.id}`)}
      className="bg-black/50 backdrop-blur-lg p-4 rounded-xl mb-4 border border-red-500/30 shadow-lg hover:bg-black/60 cursor-pointer"
    >
      <h3 className="text-white text-2xl font-bold">{contest.name}</h3>
      <p className="text-white/70">Start: {formatTime(contest.startTime)}</p>
      <p className="text-white/70">End: {formatTime(contest.endTime)}</p>
    </div>
  ));

const AdminDashboard = () => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/admin");
    },
  });

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true); // Show loader
      await signOut({
        redirect: false,
        callbackUrl: "/admin",
      });
      setIsLoggingOut(false); // Hide loader (optional, if redirected)
      router.push("/admin");
    } catch (error) {
      console.error("Logout error:", error);
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
        <LogoutButton isLoading={isLoggingOut} onClick={handleLogout} />
      </div>

      {/* Dashboard Content */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
        <DashboardCard
          Icon={FaClipboardList}
          title="Create Contest"
          description="Set up new database contests for users."
          onClickHandler={() => {
            // router.push("/admin/dashboard/createContest");
          }}
          goto={"/admin/dashboard/createContest"}
        />
        <DashboardCard
          Icon={FaUsers}
          title="Manage Users"
          description="View, add, or remove users from the app."
          onClickHandler={() => {
            // router.push("/admin/dashboard/manageUsers");
          }}
          goto={"/admin/dashboard/manageUsers"}
        />
        <DashboardCard
          Icon={FaPlusCircle}
          title="Add Contestants"
          description="Enroll participants into a contest."
          onClickHandler={() => {}}
          goto={"/admin/dashboard/createContest"}
        />
      </div>
      <ContestTabs contests={contests} />
    </motion.div>
  );
};

export default AdminDashboard;
