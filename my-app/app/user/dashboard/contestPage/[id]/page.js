// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import {
//   Clock,
//   FileQuestion,
//   Activity,
//   Database,
//   Eye,
//   Edit,
//   X,
// } from "lucide-react";
// import Logo from "@/app/Components/Logo";
// import QuestionsTab from "./Components/QuestionsTab";
// import DDLTab from "./Components/DDLTab";
// import VisualSchemaTab from "./Components/VisualSchemaTab";
// import Leaderboard from "./Components/Leaderboard";
// import StatusTab from "./Components/StatusTab";
// import { useParams } from "next/navigation";
// import axios from "axios";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { showTimerUpdatedToast } from "@/app/Components/Dumped/utils/toast";

// const ContestPage = () => {
//   const [timeLeft, setTimeLeft] = useState({
//     hours: 0,
//     minutes: 0,
//     seconds: 0,
//   });
//   const [currentQuestion, setCurrentQuestion] = useState(1);
//   const [contestInfo, setContestInfo] = useState({});
//   const params = useParams(); // returns an object of dynamic params
//   const [contestId, setContestId] = useState(params.id);
//   const [contestStatus, setContestStatus] = useState("upcoming"); // upcoming, ongoing, ended

//   // States for timer edit dialog
//   const [showEditDialog, setShowEditDialog] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // Mock questions for the contest
//   const [questions, setQuestions] = useState([]);

//   const parseDateTime = (datetimeStr) => {
//     // Split "Month Date, Year | HH:MM:SS AM/PM"
//     if (!datetimeStr) return new Date();
//     const [datePart, timePart] = datetimeStr.split(" | ");
//     // Combine and parse
//     return new Date(`${datePart} ${timePart}`);
//   };

//   const formatDateTimeForInput = (dateObj) => {
//     if (!dateObj || !(dateObj instanceof Date) || isNaN(dateObj)) return "";

//     // Format date for datetime-local input (YYYY-MM-DDTHH:MM)
//     const year = dateObj.getFullYear();
//     const month = String(dateObj.getMonth() + 1).padStart(2, "0");
//     const day = String(dateObj.getDate()).padStart(2, "0");
//     const hours = String(dateObj.getHours()).padStart(2, "0");
//     const minutes = String(dateObj.getMinutes()).padStart(2, "0");

//     return `${year}-${month}-${day}T${hours}:${minutes}`;
//   };

//   useEffect(() => {
//     const fetchContestData = async () => {
//       try {
//         const response = await axios.get(`/api/contest-info/${contestId}`);
//         console.log(response);

//         const data = response.data;
//         setContestInfo(data.contest);
//         setQuestions(data.questions);
//         console.log(contestInfo);
//         console.log(questions);

//         const start = parseDateTime(data.contest.startTime);
//         const end = parseDateTime(data.contest.endTime);
//         // console.log(start, end);

//         const now = new Date();

//         // Set contest status
//         if (now < start) {
//           setContestStatus("upcoming");
//         } else if (now >= start && now <= end) {
//           setContestStatus("ongoing");
//         } else {
//           setContestStatus("ended");
//         }

//         const diffInSeconds = end >= now ? Math.floor((end - now) / 1000) : 0;
//         const hours = end >= now ? Math.floor(diffInSeconds / 3600) : 0;
//         const minutes =
//           end >= now ? Math.floor((diffInSeconds % 3600) / 60) : 0;
//         const seconds = end >= now ? diffInSeconds % 60 : 0;

//         setTimeLeft({ hours, minutes, seconds });
//         // console.log(timeLeft);
//       } catch (err) {
//         console.error(err);
//       }
//     };

//     fetchContestData();
//   }, [contestId]);

//   // Timer countdown effect
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
//           clearInterval(timer);
//           if (contestStatus === "ongoing") {
//             setContestStatus("ended");
//           }
//           return prev;
//         }

//         let newHours = prev.hours;
//         let newMinutes = prev.minutes;
//         let newSeconds = prev.seconds - 1;

//         if (newSeconds < 0) {
//           newSeconds = 59;
//           newMinutes -= 1;
//         }

//         if (newMinutes < 0) {
//           newMinutes = 59;
//           newHours -= 1;
//         }

//         return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
//       });
//     }, 1000);

//     return () => clearInterval(timer);
//   }, [timeLeft, contestStatus]);

//   // Format time with leading zeros
//   const formatTime = (val) => val.toString().padStart(2, "0");

//   const navigateQuestion = (direction) => {
//     if (direction === "next" && currentQuestion < questions.length) {
//       setCurrentQuestion(currentQuestion + 1);
//     } else if (direction === "prev" && currentQuestion > 1) {
//       setCurrentQuestion(currentQuestion - 1);
//     }
//   };

//   // Get difficulty styling
//   const getDifficultyStyles = (difficulty) => {
//     // difficulty[0] -= 32;
//     difficulty = difficulty?.charAt(0).toUpperCase() + difficulty?.slice(1);
//     switch (difficulty) {
//       case "Easy":
//         return "bg-green-500/30 text-green-200";
//       case "Medium":
//         return "bg-yellow-500/30 text-yellow-200";
//       case "Hard":
//         return "bg-red-500/30 text-red-200";
//       case "PostgreSQL":
//         return "bg-red-500/30 text-red-200";
//       case "MySQL":
//         return "bg-red-500/30 text-red-200";
//       case "Oracle":
//         return "bg-red-500/30 text-red-200";
//       default:
//         return "bg-gray-500/30 text-gray-200";
//     }
//   };

//   // Convert datetime-local value back to the original pipe format
//   const formatDateTimeForAPI = (datetimeLocalValue) => {
//     if (!datetimeLocalValue) return "";

//     const dateObj = new Date(datetimeLocalValue);

//     // Format: "Month Date, Year | HH:MM:SS AM/PM"
//     const months = [
//       "January",
//       "February",
//       "March",
//       "April",
//       "May",
//       "June",
//       "July",
//       "August",
//       "September",
//       "October",
//       "November",
//       "December",
//     ];
//     const month = months[dateObj.getMonth()];
//     const date = dateObj.getDate();
//     const year = dateObj.getFullYear();

//     let hours = dateObj.getHours();
//     const ampm = hours >= 12 ? "PM" : "AM";
//     hours = hours % 12;
//     hours = hours ? hours : 12; // the hour '0' should be '12'

//     const minutes = String(dateObj.getMinutes()).padStart(2, "0");
//     const seconds = String(dateObj.getSeconds()).padStart(2, "0");

//     return `${month} ${date}, ${year} | ${hours}:${minutes}:${seconds} ${ampm}`;
//   };

//   return (
//     <div className="min-h-screen text-white">
//       {/* Header with logo and contest info */}
//       <header className="bg-red-900/30 border-b border-red-500/30 p-4">
//         <div className="container mx-auto flex justify-between items-center">
//           <div className="flex items-center space-x-3">
//             <div className="w-12 h-12 flex items-center justify-center">
//               {/* <Database className="w-8 h-8" /> */}
//               <Logo extraClasses="h-12 w-12" />
//             </div>
//             <div>
//               {/* <h1 className="text-2xl font-bold">SQL Masters Challenge</h1> */}
//               <h1 className="text-2xl font-bold">{contestInfo.name}</h1>
//               <p className="text-red-300">Database Contest - Advanced Level</p>
//             </div>
//           </div>

//           <div className="flex items-center space-x-2">
//             <div className="flex flex-col items-end">
//               <div className="flex items-center space-x-2 text-red-200">
//                 <Clock className="w-5 h-5" />
//                 <span className="text-xl font-mono">
//                   {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:
//                   {formatTime(timeLeft.seconds)}
//                 </span>
//               </div>
//               <div className="text-sm text-red-300">
//                 {contestStatus === "ongoing"
//                   ? "Time Remaining"
//                   : contestStatus === "ended"
//                   ? "Ended"
//                   : "Starts In"}
//               </div>
//             </div>
//           </div>
//         </div>
//       </header>

//       <main className="container mx-auto p-4">
//         <Tabs defaultValue="questions" className="w-full">
//           <TabsList className="text-white bg-red-500/20 border border-red-500/30 p-1 mb-6">
//             <TabsTrigger
//               value="questions"
//               className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
//             >
//               <FileQuestion className="w-4 h-4 mr-2" />
//               Questions
//             </TabsTrigger>
//             <TabsTrigger
//               value="status"
//               className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
//             >
//               <Eye className="w-4 h-4 mr-2" />
//               Status
//             </TabsTrigger>
//             <TabsTrigger
//               value="leaderboard"
//               className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
//             >
//               <Eye className="w-4 h-4 mr-2" />
//               Leaderboard
//             </TabsTrigger>
//             <TabsTrigger
//               value="ddl"
//               className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
//             >
//               <Database className="w-4 h-4 mr-2" />
//               DDL Statements
//             </TabsTrigger>
//             <TabsTrigger
//               value="schema"
//               className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
//             >
//               <Eye className="w-4 h-4 mr-2" />
//               Visualize Schema
//             </TabsTrigger>
//           </TabsList>

//           <QuestionsTab
//             currentQuestion={currentQuestion}
//             questions={questions}
//             setQuestions={setQuestions}
//             getDifficultyStyles={getDifficultyStyles}
//             navigateQuestion={navigateQuestion}
//             contestId={contestId}
//           />

//           <StatusTab
//             contestId={contestId}
//             getDifficultyStyles={getDifficultyStyles}
//           />

//           <Leaderboard contestId={contestId} />

//           <DDLTab
//             ddl={{
//               oracle: contestInfo.oracle_ddl,
//               mysql: contestInfo.mysql_ddl,
//               postgresql: contestInfo.postgresql_ddl,
//             }}
//             contestId={contestId}
//             setDdl={setContestInfo}
//           />

//           <VisualSchemaTab schema={{}} />
//         </Tabs>
//       </main>
//     </div>
//   );
// };

// export default ContestPage;

"use client";

import React, { useState, useEffect, useRef } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Clock,
  FileQuestion,
  Activity,
  Database,
  Eye,
  Edit,
  X,
} from "lucide-react";
import { AlertCircle, Timer, Calendar, Lock } from "lucide-react";
import Logo from "@/app/Components/Logo";
import QuestionsTab from "./Components/QuestionsTab";
import DDLTab from "./Components/DDLTab";
import VisualSchemaTab from "./Components/VisualSchemaTab";
import Leaderboard from "./Components/Leaderboard";
import StatusTab from "./Components/StatusTab";
import { redirect, useParams } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { showTimerUpdatedToast } from "@/app/Components/Dumped/utils/toast";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const ContestPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const [contestId, setContestId] = useState(params.id);
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [contestInfo, setContestInfo] = useState({});
  const [contestStatus, setContestStatus] = useState("upcoming"); // upcoming, ongoing, ended
  const [loading, setLoading] = useState(true);
  const [solvedStatus, setSolvedStatus] = useState({});
  const dataFetchedRef = useRef(false);

  // Mock questions for the contest
  const [questions, setQuestions] = useState([]);

  // ... other state declarations remain the same

  useEffect(() => {
    // Check if user is logged in first
    if (status === "loading") return;

    if (!session || session.user.role !== "user") {
      router.push("/user"); // Redirect to login if not authenticated
      return;
    }

    const fetchContestData = async () => {
      if (dataFetchedRef.current) return;
      setLoading(true);

      // First check if user has access to this contest
      const hasContestAccess = localStorage.getItem(
        `contest_access_${contestId}`
      );

      if (!hasContestAccess) {
        console.log("No contest access found, redirecting...");
        router.push("/user/dashboard");
        return;
      }

      try {
        const response = await axios.get(`/api/contest-info/${contestId}`);
        setContestInfo(response.data.contest);
        setQuestions(response.data.questions);

        console.log(response);

        let tmpSolvedStatus = {};
        for (let i = 0; i < response.data.questions.length; i++) {
          tmpSolvedStatus[response.data.questions[i].id] = -1;
        }
        setSolvedStatus(tmpSolvedStatus);

        const start = parseDateTime(response.data.contest.startTime);
        const end = parseDateTime(response.data.contest.endTime);
        // console.log(start, end);

        const now = new Date();

        // Set contest status
        let diffInSeconds = 0;

        if (now < start) {
          setContestStatus("upcoming");
          diffInSeconds = end >= now ? Math.floor((start - now) / 1000) : 0;
        } else if (now >= start && now <= end) {
          setContestStatus("ongoing");
          diffInSeconds = end >= now ? Math.floor((end - now) / 1000) : 0;
        } else {
          setContestStatus("ended");
        }

        const hours = end >= now ? Math.floor(diffInSeconds / 3600) : 0;
        const minutes =
          end >= now ? Math.floor((diffInSeconds % 3600) / 60) : 0;
        const seconds = end >= now ? diffInSeconds % 60 : 0;

        setTimeLeft({ hours, minutes, seconds });
        dataFetchedRef.current = true;

        // Rest of your contest data handling code
        // ...
      } catch (err) {
        console.error("Error fetching contest data:", err);
        // Handle errors appropriately
      } finally {
        setLoading(false);
      }
    };

    fetchContestData();
  }, [contestId, router, session, status]);

  const parseDateTime = (datetimeStr) => {
    // Split "Month Date, Year | HH:MM:SS AM/PM"
    if (!datetimeStr) return new Date();
    const [datePart, timePart] = datetimeStr.split(" | ");
    // Combine and parse
    return new Date(`${datePart} ${timePart}`);
  };

  const formatDateTimeForInput = (dateObj) => {
    if (!dateObj || !(dateObj instanceof Date) || isNaN(dateObj)) return "";

    // Format date for datetime-local input (YYYY-MM-DDTHH:MM)
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const hours = String(dateObj.getHours()).padStart(2, "0");
    const minutes = String(dateObj.getMinutes()).padStart(2, "0");

    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
          clearInterval(timer);
          if (contestStatus === "ongoing") {
            setContestStatus("ended");
          }
          return prev;
        }

        let newHours = prev.hours;
        let newMinutes = prev.minutes;
        let newSeconds = prev.seconds - 1;

        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }

        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }

        return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, contestStatus]);

  // Format time with leading zeros
  const formatTime = (val) => val.toString().padStart(2, "0");

  const navigateQuestion = (direction) => {
    if (direction === "next" && currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (direction === "prev" && currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Get difficulty styling
  const getDifficultyStyles = (difficulty) => {
    // difficulty[0] -= 32;
    difficulty = difficulty.toUpperCase();
    switch (difficulty) {
      case "EASY":
        return "bg-green-500/30 text-green-200";
      case "MEDIUM":
        return "bg-yellow-500/30 text-yellow-200";
      case "HARD":
        return "bg-red-500/30 text-red-200";
      case "POSTGRESQL":
        return "bg-green-500/30 text-red-200";
      case "MYSQL":
        return "bg-red-500/30 text-red-200";
      case "ORACLE":
        return "bg-blue-500/30 text-red-200";
      default:
        return "bg-gray-500/30 text-gray-200";
    }
  };

  // Convert datetime-local value back to the original pipe format
  const formatDateTimeForAPI = (datetimeLocalValue) => {
    if (!datetimeLocalValue) return "";

    const dateObj = new Date(datetimeLocalValue);

    // Format: "Month Date, Year | HH:MM:SS AM/PM"
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];
    const month = months[dateObj.getMonth()];
    const date = dateObj.getDate();
    const year = dateObj.getFullYear();

    let hours = dateObj.getHours();
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'

    const minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const seconds = String(dateObj.getSeconds()).padStart(2, "0");

    return `${month} ${date}, ${year} | ${hours}:${minutes}:${seconds} ${ampm}`;
  };

  return (
    <div className="min-h-screen text-white w-full">
      {/* Header with logo and contest info */}
      <header className="bg-red-900/30 border-b border-red-500/30 p-4 mb-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <Logo extraClasses="h-12 w-12" />
            </div>
            <div>
              {loading ? (
                <>
                  <Skeleton className="h-8 w-48 bg-red-500/20" />
                  <Skeleton className="h-4 w-32 mt-1 bg-red-500/10" />
                </>
              ) : (
                <>
                  <h1 className="text-2xl font-bold">{contestInfo.name}</h1>
                  <p className="text-red-300">
                    Database Contest - Advanced Level
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex flex-col items-end">
              {loading ? (
                <>
                  <Skeleton className="h-7 w-24 bg-red-500/20" />
                  <Skeleton className="h-4 w-16 mt-1 bg-red-500/10" />
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-2 text-red-200">
                    <Clock className="w-5 h-5" />
                    <span className="text-xl font-mono">
                      {formatTime(timeLeft.hours)}:
                      {formatTime(timeLeft.minutes)}:
                      {formatTime(timeLeft.seconds)}
                    </span>
                  </div>
                  <div className="text-sm text-red-300">
                    {contestStatus === "ongoing"
                      ? "Time Remaining"
                      : contestStatus === "ended"
                      ? "Ended"
                      : "Starts In"}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {loading ? (
        // Skeleton loading state for main content area
        <div className="space-y-6">
          <div className="rounded-lg border border-red-500/30 bg-black/40 p-6">
            <div className="flex justify-between items-center mb-4">
              <Skeleton className="h-8 w-64 bg-red-500/20" />
              <Skeleton className="h-6 w-24 bg-red-500/20" />
            </div>
            <Skeleton className="h-32 w-full mt-4 bg-red-500/10" />
            <div className="mt-6 space-y-4">
              <Skeleton className="h-24 w-full bg-red-500/10" />
              <Skeleton className="h-24 w-full bg-red-500/10" />
            </div>
            <div className="flex justify-between mt-6">
              <Skeleton className="h-10 w-24 bg-red-500/20" />
              <Skeleton className="h-10 w-24 bg-red-500/20" />
            </div>
          </div>
        </div>
      ) : contestStatus != "upcoming" ? (
        <main className="container mx-auto p-4">
          <Tabs defaultValue="questions" className="w-full">
            <TabsList className="text-white bg-red-500/20 border border-red-500/30 p-1 mb-6">
              <TabsTrigger
                value="questions"
                className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
              >
                <FileQuestion className="w-4 h-4 mr-2" />
                Questions
              </TabsTrigger>
              <TabsTrigger
                value="status"
                className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
              >
                <Eye className="w-4 h-4 mr-2" />
                Status
              </TabsTrigger>
              {contestStatus == "ended" && (
                <TabsTrigger
                  value="leaderboard"
                  className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Leaderboard
                </TabsTrigger>
              )}
              <TabsTrigger
                value="ddl"
                className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
              >
                <Database className="w-4 h-4 mr-2" />
                DDL Statements
              </TabsTrigger>
            </TabsList>
            <QuestionsTab
              currentQuestion={currentQuestion}
              questions={questions}
              setQuestions={setQuestions}
              getDifficultyStyles={getDifficultyStyles}
              navigateQuestion={navigateQuestion}
              contestId={contestId}
              ddl={{
                oracle: contestInfo.oracle_ddl,
                mysql: contestInfo.mysql_ddl,
                postgresql: contestInfo.postgresql_ddl,
              }}
              solvedStatus={solvedStatus}
              setSolvedStatus={setSolvedStatus}
            />
            <StatusTab
              contestId={contestId}
              getDifficultyStyles={getDifficultyStyles}
              solvedStatus={solvedStatus}
              setSolvedStatus={setSolvedStatus}
            />
            <Leaderboard contestId={contestId} />
            <DDLTab
              ddl={{
                oracle: contestInfo.oracle_ddl,
                mysql: contestInfo.mysql_ddl,
                postgresql: contestInfo.postgresql_ddl,
              }}
              contestId={contestId}
              setDdl={setContestInfo}
            />
          </Tabs>
        </main>
      ) : (
        <div className="container mx-auto mt-5 w-full p-4">
          <div className="rounded-lg border border-red-500/30 bg-black/40 p-8 text-center">
            <Lock className="w-16 h-16 mx-auto mb-6 text-red-500" />
            <h2 className="text-2xl font-bold mb-4 text-white">
              Contest Not Yet Started
            </h2>
            <p className="text-gray-300 mb-6 max-w-lg mx-auto">
              This SQL contest is scheduled to begin soon. Contest materials and
              questions will be available once the event officially starts.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
              <div className="flex items-center text-gray-300">
                <Calendar className="w-5 h-5 mr-2 text-red-400" />
                <span>{contestInfo?.startTime?.split("|")[0]}</span>
              </div>
              <div className="flex items-center text-gray-300">
                <Timer className="w-5 h-5 mr-2 text-red-400" />
                <span>{contestInfo?.startTime?.split("|")[1]}</span>
              </div>
            </div>

            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg inline-block">
              <div className="flex items-start">
                <AlertCircle className="w-5 h-5 mr-2 text-red-400 mt-0.5" />
                <p className="text-gray-300 text-sm text-left">
                  Please don't attempt to access contest materials before the
                  official start time. Early access attempts are monitored and
                  may result in disqualification.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContestPage;
