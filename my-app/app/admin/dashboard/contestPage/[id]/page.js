// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Clock, FileQuestion, Activity, Database, Eye } from "lucide-react";
// import Logo from "@/app/Components/Logo";
// import QuestionsTab from "./Components/QuestionsTab";
// import DDLTab from "./Components/DDLTab";
// import VisualSchemaTab from "./Components/VisualSchemaTab";
// import Leaderboard from "./Components/Leaderboard";
// import { useParams } from "next/navigation";
// import axios from "axios";

// const ContestPage = () => {
//   const [timeLeft, setTimeLeft] = useState({
//     hours: 0,
//     minutes: 0,
//     seconds: 0,
//   });
//   const [currentQuestion, setCurrentQuestion] = useState(1);
//   const [contestInfo, setContestInfo] = useState({});
//   const params = useParams(); // returns an object of dynamic params
//   const [contestId, setContesId] = useState(params.id);
//   const [ongoing, setOngoing] = useState(false);

//   // console.log(params);

//   // Mock questions for the contest
//   const [questions, setQuestions] = useState([
//     {
//       id: 1,
//       title: "Find all users who made a purchase in the last 30 days",
//       description:
//         "Write a SQL query to retrieve all users who made at least one purchase in the last 30 days. Include their user ID, name, email, and total purchase amount.",
//       difficulty: "Easy",
//       asnwer: "C1 | C2 | C3",
//       points: 10,
//     },
//     {
//       id: 2,
//       title: "Calculate average order value by category",
//       description:
//         "Write a SQL query to calculate the average order value grouped by product category. Sort the results by average order value in descending order.",
//       difficulty: "Medium",
//       points: 20,
//     },
//     {
//       id: 3,
//       title: "Find products with inventory anomalies",
//       description:
//         "Write a SQL query to identify products where the current inventory count doesn't match the calculated inventory based on purchase and sales records.",
//       difficulty: "Hard",
//       points: 30,
//     },
//   ]);

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

//         const parseDateTime = (datetimeStr) => {
//           // Split "Month Date, Year | HH:MM:SS AM/PM"
//           const [datePart, timePart] = datetimeStr.split(" | ");
//           // Combine and parse
//           return new Date(`${datePart} ${timePart}`);
//         };

//         const start = parseDateTime(data.contest.startTime);
//         const end = parseDateTime(data.contest.endTime);
//         // console.log(start, end);

//         const now = new Date();

//         if (now >= start && now <= end) {
//           setOngoing(true);
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
//   }, []);

//   // Timer countdown effect
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setTimeLeft((prev) => {
//         if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
//           clearInterval(timer);
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
//   }, [timeLeft]);

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
//     difficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
//     switch (difficulty) {
//       case "Easy":
//         return "bg-green-500/30 text-green-200";
//       case "Medium":
//         return "bg-yellow-500/30 text-yellow-200";
//       case "Hard":
//         return "bg-red-500/30 text-red-200";
//       default:
//         return "bg-gray-500/30 text-gray-200";
//     }
//   };

//   // console.log(timeLeft);

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

//           <div className="flex flex-col items-end">
//             <div className="flex items-center space-x-2 text-red-200">
//               <Clock className="w-5 h-5" />
//               <span className="text-xl font-mono">
//                 {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:
//                 {formatTime(timeLeft.seconds)}
//               </span>
//             </div>
//             <div className="text-sm text-red-300">
//               {ongoing
//                 ? "Time Remaining"
//                 : timeLeft.hours == 0 &&
//                   timeLeft.seconds == 0 &&
//                   timeLeft.minutes == 0
//                 ? "Ended"
//                 : "Starts In"}
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
import Logo from "@/app/Components/Logo";
import QuestionsTab from "./Components/QuestionsTab";
import DDLTab from "./Components/DDLTab";
import VisualSchemaTab from "./Components/VisualSchemaTab";
import Leaderboard from "./Components/Leaderboard";
import { useParams } from "next/navigation";
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
import { showTimerUpdatedToast } from "@/app/Components/Dumped/utils/toast";

const ContestPage = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [contestInfo, setContestInfo] = useState({});
  const params = useParams(); // returns an object of dynamic params
  const [contestId, setContestId] = useState(params.id);
  const [contestStatus, setContestStatus] = useState("upcoming"); // upcoming, ongoing, ended

  // States for timer edit dialog
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock questions for the contest
  const [questions, setQuestions] = useState([
    {
      id: 1,
      title: "Find all users who made a purchase in the last 30 days",
      description:
        "Write a SQL query to retrieve all users who made at least one purchase in the last 30 days. Include their user ID, name, email, and total purchase amount.",
      difficulty: "Easy",
      asnwer: "C1 | C2 | C3",
      points: 10,
    },
    {
      id: 2,
      title: "Calculate average order value by category",
      description:
        "Write a SQL query to calculate the average order value grouped by product category. Sort the results by average order value in descending order.",
      difficulty: "Medium",
      points: 20,
    },
    {
      id: 3,
      title: "Find products with inventory anomalies",
      description:
        "Write a SQL query to identify products where the current inventory count doesn't match the calculated inventory based on purchase and sales records.",
      difficulty: "Hard",
      points: 30,
    },
  ]);

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

  useEffect(() => {
    const fetchContestData = async () => {
      try {
        const response = await axios.get(`/api/contest-info/${contestId}`);
        console.log(response);

        const data = response.data;
        setContestInfo(data.contest);
        setQuestions(data.questions);
        console.log(contestInfo);
        console.log(questions);

        const start = parseDateTime(data.contest.startTime);
        const end = parseDateTime(data.contest.endTime);
        // console.log(start, end);

        const now = new Date();

        // Set contest status
        if (now < start) {
          setContestStatus("upcoming");
        } else if (now >= start && now <= end) {
          setContestStatus("ongoing");
        } else {
          setContestStatus("ended");
        }

        // Prepare initial values for edit form
        setEditStartTime(formatDateTimeForInput(start));
        setEditEndTime(formatDateTimeForInput(end));

        const diffInSeconds = end >= now ? Math.floor((end - now) / 1000) : 0;
        const hours = end >= now ? Math.floor(diffInSeconds / 3600) : 0;
        const minutes =
          end >= now ? Math.floor((diffInSeconds % 3600) / 60) : 0;
        const seconds = end >= now ? diffInSeconds % 60 : 0;

        setTimeLeft({ hours, minutes, seconds });
        // console.log(timeLeft);
      } catch (err) {
        console.error(err);
      }
    };

    fetchContestData();
  }, [contestId]);

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
    difficulty = difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/30 text-green-200";
      case "Medium":
        return "bg-yellow-500/30 text-yellow-200";
      case "Hard":
        return "bg-red-500/30 text-red-200";
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
  const handleEditTimerSubmit = async () => {
    try {
      setIsSubmitting(true);

      // Format times for API
      const formattedStartTime = formatDateTimeForAPI(editStartTime);
      const formattedEndTime = formatDateTimeForAPI(editEndTime);

      // Validate times
      const startDate = new Date(editStartTime);
      const endDate = new Date(editEndTime);
      const now = new Date();

      if (endDate <= startDate) {
        toast({
          title: "Invalid time range",
          description: "End time must be after start time",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      if (contestStatus === "ongoing" && endDate <= now) {
        toast({
          title: "Invalid end time",
          description:
            "For ongoing contests, new end time must be in the future",
          variant: "destructive",
        });
        setIsSubmitting(false);
        return;
      }

      // Prepare update data based on contest status
      const updateData = {
        status: contestStatus,
        endTime: formattedEndTime,
        startTime: formattedStartTime,
      };

      console.log(updateData);

      // Send update to API
      const response = await axios.put(
        `/api/contest-info/${contestId}/update-timer`,
        updateData
      );

      if (response.status === 200) {
        // Update local contest info
        setContestInfo((prev) => ({
          ...prev,
          endTime: formattedEndTime,
          ...(contestStatus === "upcoming"
            ? { startTime: formattedStartTime }
            : {}),
        }));

        // Update contest status if needed
        if (contestStatus === "upcoming" && startDate <= now && endDate > now) {
          setContestStatus("ongoing");
        }

        // Recalculate time left
        const diffInSeconds = Math.floor((endDate - now) / 1000);
        const hours = Math.floor(diffInSeconds / 3600);
        const minutes = Math.floor((diffInSeconds % 3600) / 60);
        const seconds = diffInSeconds % 60;

        setTimeLeft({ hours, minutes, seconds });
        showTimerUpdatedToast();

        setShowEditDialog(false);
      }
    } catch (error) {
      console.error("Failed to update contest timer:", error);
      toast({
        title: "Error",
        description: "Failed to update contest timer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen text-white">
      {/* Header with logo and contest info */}
      <header className="bg-red-900/30 border-b border-red-500/30 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 flex items-center justify-center">
              {/* <Database className="w-8 h-8" /> */}
              <Logo extraClasses="h-12 w-12" />
            </div>
            <div>
              {/* <h1 className="text-2xl font-bold">SQL Masters Challenge</h1> */}
              <h1 className="text-2xl font-bold">{contestInfo.name}</h1>
              <p className="text-red-300">Database Contest - Advanced Level</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex flex-col items-end">
              <div className="flex items-center space-x-2 text-red-200">
                <Clock className="w-5 h-5" />
                <span className="text-xl font-mono">
                  {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:
                  {formatTime(timeLeft.seconds)}
                </span>

                {/* Edit Icon - only visible for upcoming or ongoing contests */}
                {contestStatus !== "ended" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6 rounded-full hover:bg-red-500/20 p-1"
                    onClick={() => setShowEditDialog(true)}
                    title="Edit Timer"
                  >
                    <Edit className="h-4 w-4 text-red-300" />
                  </Button>
                )}
              </div>
              <div className="text-sm text-red-300">
                {contestStatus === "ongoing"
                  ? "Time Remaining"
                  : contestStatus === "ended"
                  ? "Ended"
                  : "Starts In"}
              </div>
            </div>
          </div>
        </div>
      </header>

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
              value="leaderboard"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              Leaderboard
            </TabsTrigger>
            <TabsTrigger
              value="ddl"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
            >
              <Database className="w-4 h-4 mr-2" />
              DDL Statements
            </TabsTrigger>
            <TabsTrigger
              value="schema"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              Visualize Schema
            </TabsTrigger>
          </TabsList>

          <QuestionsTab
            currentQuestion={currentQuestion}
            questions={questions}
            setQuestions={setQuestions}
            getDifficultyStyles={getDifficultyStyles}
            navigateQuestion={navigateQuestion}
            contestId={contestId}
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

          <VisualSchemaTab schema={{}} />
        </Tabs>
      </main>

      {/* Edit Timer Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="bg-black border border-red-500/30 text-white">
          <DialogHeader>
            <DialogTitle className="text-xl">Edit Contest Timer</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Start time field - only editable for upcoming contests */}
            <div className="space-y-2">
              <label htmlFor="startTime" className="text-sm font-medium">
                Start Time
              </label>
              <Input
                id="startTime"
                type="datetime-local"
                value={editStartTime}
                onChange={(e) => setEditStartTime(e.target.value)}
                className="bg-gray-800 border-gray-700"
                disabled={contestStatus !== "upcoming"}
              />
              {contestStatus !== "upcoming" && (
                <p className="text-xs text-red-300">
                  Start time cannot be modified for ongoing contests
                </p>
              )}
            </div>

            {/* End time field - editable for both upcoming and ongoing contests */}
            <div className="space-y-2">
              <label htmlFor="endTime" className="text-sm font-medium">
                End Time
              </label>
              <Input
                id="endTime"
                type="datetime-local"
                value={editEndTime}
                onChange={(e) => setEditEndTime(e.target.value)}
                className="bg-gray-800 border-gray-700"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowEditDialog(false)}
              className="hover:bg-gray-800"
            >
              Cancel
            </Button>
            <Button
              variant="default"
              onClick={handleEditTimerSubmit}
              className="bg-red-600 hover:bg-red-700"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Updating..." : "Update Timer"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ContestPage;
