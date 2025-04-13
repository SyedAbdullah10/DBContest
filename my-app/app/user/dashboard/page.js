"use client";
import { useState, useEffect } from "react";
import { FaUsers, FaPlusCircle, FaClipboardList } from "react-icons/fa";
import { useRouter } from "next/navigation";
import Logo from "@/app/Components/Logo";
import { motion } from "framer-motion";
import { useSession, signOut } from "next-auth/react";
import { redirect } from "next/navigation";
import supabase from "@/supabaseClient";
import LogoutButton from "@/app/Components/LogoutButton";

import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

const contests = {
  upcoming: [
    {
      id: 1,
      name: "Spring Coding Challenge",
      startDate: "April 11, 2025",
      endDate: "April 15, 2025",
      startTime: "3:00:00 PM",
      endTime: "4:00:00 PM",
    },
    {
      id: 2,
      name: "AI Hackathon",
      startDate: "April 11, 2025",
      endDate: "April 15, 2025",
      startTime: "3:00:00 PM",
      endTime: "4:00:00 PM",
    },
  ],
  ongoing: [
    {
      id: 5,
      name: "Data Structures Contest",
      startDate: "April 11, 2025",
      endDate: "April 15, 2025",
      startTime: "3:00:00 PM",
      endTime: "4:00:00 PM",
    },
    {
      id: 6,
      name: "Web Development Sprint",
      startDate: "April 11, 2025",
      endDate: "April 15, 2025",
      startTime: "3:00:00 PM",
      endTime: "4:00:00 PM",
    },
  ],
  finished: [
    {
      id: 3,
      name: "Winter Data Science Contest",
      startDate: "April 11, 2025",
      endDate: "April 15, 2025",
      startTime: "3:00:00 PM",
      endTime: "4:00:00 PM",
    },
    {
      id: 4,
      name: "Cybersecurity CTF",
      startDate: "April 11, 2025",
      endDate: "April 15, 2025",
      startTime: "3:00:00 PM",
      endTime: "4:00:00 PM",
    },
  ],
};

const ContestTabs = ({ contests, handleContestCardClick }) => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("upcoming");
  const [searchQuery, setSearchQuery] = useState("");

  // const filterContests = (contests) => {
  //   console.log(contests);

  //   if (searchQuery == "") return;
  //   return contests[activeTab]?.filter((contest) =>
  //     contest?.name?.toLowerCase().includes(searchQuery.toLowerCase())
  //   );
  // };

  return (
    <div className="w-full max-w-3xl mx-auto mt-8">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search Contests..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          // contests[activeTab] = filterContests(contests);
        }}
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
            contests={contests?.upcoming}
            router={router}
            searchQuery={searchQuery}
            handleContestCardClick={handleContestCardClick}
          />
        )}
        {activeTab === "ongoing" && (
          <OngoingContests
            contests={contests?.ongoing}
            router={router}
            searchQuery={searchQuery}
            handleContestCardClick={handleContestCardClick}
          />
        )}
        {activeTab === "finished" && (
          <FinishedContests
            contests={contests?.finished}
            router={router}
            searchQuery={searchQuery}
            handleContestCardClick={handleContestCardClick}
          />
        )}
      </motion.div>
    </div>
  );
};

// Improved function to parse date and time strings into a Date object
const parseDateTime = (dateStr, timeStr) => {
  // Parse the date string (format: "April 11, 2025")
  const dateParts = new Date(dateStr);

  // Parse the time string (format: "3:00:00 PM")
  const timeParts = timeStr.match(/(\d+):(\d+):(\d+)\s*([AP]M)/i);

  if (!timeParts) return new Date(); // Return current date if parsing fails

  let hours = parseInt(timeParts[1]);
  const minutes = parseInt(timeParts[2]);
  const seconds = parseInt(timeParts[3]);
  const ampm = timeParts[4].toUpperCase();

  // Convert 12-hour format to 24-hour format
  if (ampm === "PM" && hours < 12) hours += 12;
  if (ampm === "AM" && hours === 12) hours = 0;

  // Set the time components on the date object
  dateParts.setHours(hours, minutes, seconds, 0);

  return dateParts;
};

// Format date for display in the required format: "date, time"
const formatTime = (dateObj) => {
  if (!(dateObj instanceof Date) || isNaN(dateObj)) return "Invalid Date";

  const options = {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };

  return dateObj.toLocaleDateString("en-US", options);
};

// Calculate time remaining between now and a target date
const calculateTimeLeft = (targetDate) => {
  if (!(targetDate instanceof Date) || isNaN(targetDate)) return "00:00:00";

  const now = new Date();
  const difference = targetDate - now;

  if (difference <= 0) return "00:00:00";

  const hours = Math.floor(difference / 3600000);
  const minutes = Math.floor((difference % 3600000) / 60000);
  const seconds = Math.floor((difference % 60000) / 1000);

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

// Custom hook for timer to prevent re-rendering the entire list
const useTimer = (targetDate) => {
  const [timeLeft, setTimeLeft] = useState("00:00:00");

  useEffect(() => {
    // Initialize time immediately
    setTimeLeft(calculateTimeLeft(targetDate));

    // Set up interval
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    // Clean up interval
    return () => clearInterval(timer);
  }, [targetDate]); // Only re-run if targetDate changes

  return timeLeft;
};

// Contest Card Component to isolate re-renders
const ContestCard = ({ contest, type, router, handleContestCardClick }) => {
  // Parse dates based on contest type
  const startDateTime = parseDateTime(contest.startDate, contest.startTime);
  const endDateTime = parseDateTime(contest.endDate, contest.endTime);

  // Use timer hook based on contest type
  const timeLeft = useTimer(type === "upcoming" ? startDateTime : endDateTime);

  return (
    <div
      key={contest.id}
      onClick={() => handleContestCardClick(contest)}
      className="bg-black/50 backdrop-blur-lg p-4 rounded-xl mb-4 border border-red-500/30 shadow-lg hover:bg-black/60 cursor-pointer"
    >
      <h3 className="text-white text-2xl font-bold">{contest.name}</h3>

      {type === "upcoming" && (
        <>
          <p className="text-white/70">Starts In: {timeLeft}</p>
          <p className="text-white/70">
            Start Time: {formatTime(startDateTime)}
          </p>
        </>
      )}

      {type === "ongoing" && (
        <>
          <p className="text-white/70">Ends In: {timeLeft}</p>
          <p className="text-white/70">End Time: {formatTime(endDateTime)}</p>
        </>
      )}

      {type === "finished" && (
        <>
          <p className="text-white/70">Started: {formatTime(startDateTime)}</p>
          <p className="text-white/70">Ended: {formatTime(endDateTime)}</p>
        </>
      )}
    </div>
  );
};

// Simplified components that use ContestCard
const UpcomingContests = ({
  contests,
  router,
  searchQuery,
  handleContestCardClick,
}) => (
  <>
    {contests
      ?.filter((contest) =>
        contest?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map((contest) => (
        <ContestCard
          key={contest.id}
          contest={contest}
          type="upcoming"
          router={router}
          handleContestCardClick={handleContestCardClick}
        />
      ))}
  </>
);

const OngoingContests = ({
  contests,
  router,
  searchQuery,
  handleContestCardClick,
}) => (
  <>
    {contests
      ?.filter((contest) =>
        contest?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map((contest) => (
        <ContestCard
          key={contest.id}
          contest={contest}
          type="ongoing"
          router={router}
          handleContestCardClick={handleContestCardClick}
        />
      ))}
  </>
);

const FinishedContests = ({
  contests,
  router,
  searchQuery,
  handleContestCardClick,
}) => (
  <>
    {contests
      ?.filter((contest) =>
        contest?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .map((contest) => (
        <ContestCard
          key={contest.id}
          contest={contest}
          type="finished"
          router={router}
          handleContestCardClick={handleContestCardClick}
        />
      ))}
  </>
);

export default function UserDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push("/user");
    },
  });

  const [contests, setContests] = useState({
    ongoing: [],
    upcoming: [],
    finished: [],
  });
  const [isContestPassDialogOpen, setIsContestPassDialogOpen] = useState(false);
  const [contestPass, setContestPass] = useState("");
  const [selectedContest, setSelectedContest] = useState({});
  const [wrongPassError, setWrongPassError] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const response = await axios.get("/api/dashboard-contests");
        setContests(response.data);
      } catch (error) {
        console.error("Failed to fetch contests:", error);
      }
    };

    fetchContests();
  }, []);

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

  const handleContestCardClick = (contest) => {
    setIsContestPassDialogOpen(true);
    setContestPass("");
    setSelectedContest(contest);
  };

  const handleContestPassEnter = () => {
    if (
      selectedContest.password == "" ||
      selectedContest.password == contestPass
    )
      router.push(`/user/dashboard/contestPage/${selectedContest.id}`);
    else setWrongPassError(true);
  };

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
      <ContestTabs
        contests={contests}
        handleContestCardClick={handleContestCardClick}
      />
      <Dialog open={isContestPassDialogOpen}>
        <DialogContent className="bg-black/40 backdrop-blur-lg border border-red-500/30 shadow-xl rounded-lg">
          <DialogHeader>
            <DialogTitle className="text-white text-center text-2xl">
              Enter Password
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-white">
            <div className="flex flex-col gap-1">
              <label className="text-md text-red-400">{"Password"}</label>
              <Input
                type={"password"}
                value={contestPass}
                onChange={(e) => setContestPass(e.target.value)}
                placeholder={"Enter Contest Password"}
                className="bg-black/50 border border-red-500/40 text-white placeholder-gray-400 focus:ring-red-500 focus:border-red-500"
              />
              {wrongPassError && (
                <span className="text-sm text-red-600">Incorrect password</span>
              )}
            </div>
          </div>
          <DialogFooter className="flex justify-end space-x-3 mt-4">
            <Button
              variant="outline"
              className="border border-white text-black px-4 py-2 rounded-lg transition hover:bg-gray-300 hover:border-transparent"
              onClick={() => setIsContestPassDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              className="bg-red-500 text-white px-4 py-2 rounded-lg transition hover:bg-red-700"
              onClick={handleContestPassEnter}
            >
              Enter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
