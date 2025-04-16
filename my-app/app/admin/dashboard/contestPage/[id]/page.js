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
import { redirect, useParams, useRouter } from "next/navigation";
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
  const [isLoading, setIsLoading] = useState(true);
  const dataFetchedRef = useRef(false);

  // States for timer edit dialog
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [editStartTime, setEditStartTime] = useState("");
  const [editEndTime, setEditEndTime] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock questions for the contest
  const [questions, setQuestions] = useState([]);

  // ... other state declarations remain the same

  useEffect(() => {
    // Check if user is logged in first
    if (status === "loading") return;

    if (!session || session.user.role !== "admin") {
      router.push("/admin"); // Redirect to login if not authenticated
      return;
    }

    const fetchContestData = async () => {
      if (dataFetchedRef.current) return;
      setIsLoading(true);

      // First check if user has access to this contest
      const hasContestAccess = localStorage.getItem(
        `contest_access_${contestId}`
      );

      if (!hasContestAccess) {
        console.log("No contest access found, redirecting...");
        router.push("/admin/dashboard");
        return;
      }

      try {
        const response = await axios.get(`/api/contest-info/${contestId}`);
        setContestInfo(response.data.contest);
        setQuestions(response.data.questions);

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

        // Prepare initial values for edit form
        setEditStartTime(formatDateTimeForInput(start));
        setEditEndTime(formatDateTimeForInput(end));

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
        setIsLoading(false);
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

  // useEffect(() => {
  //   const fetchContestData = async () => {
  //     setIsLoading(true);
  //     try {
  //       const response = await axios.get(`/api/contest-info/${contestId}`);
  //       console.log(response);

  //       const data = response.data;
  //       setContestInfo(data.contest);
  //       setQuestions(data.questions);
  //       console.log(contestInfo);
  //       console.log(questions);

  //       const start = parseDateTime(data.contest.startTime);
  //       const end = parseDateTime(data.contest.endTime);
  //       // console.log(start, end);

  //       const now = new Date();

  //       // Set contest status
  //       let diffInSeconds = 0;

  //       if (now < start) {
  //         setContestStatus("upcoming");
  //         diffInSeconds = end >= now ? Math.floor((start - now) / 1000) : 0;
  //       } else if (now >= start && now <= end) {
  //         setContestStatus("ongoing");
  //         diffInSeconds = end >= now ? Math.floor((end - now) / 1000) : 0;
  //       } else {
  //         setContestStatus("ended");
  //       }

  //       // Prepare initial values for edit form
  //       setEditStartTime(formatDateTimeForInput(start));
  //       setEditEndTime(formatDateTimeForInput(end));

  //       const hours = end >= now ? Math.floor(diffInSeconds / 3600) : 0;
  //       const minutes =
  //         end >= now ? Math.floor((diffInSeconds % 3600) / 60) : 0;
  //       const seconds = end >= now ? diffInSeconds % 60 : 0;

  //       setTimeLeft({ hours, minutes, seconds });
  //       // console.log(timeLeft);
  //     } catch (err) {
  //       console.error(err);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchContestData();
  // }, [contestId]);

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
    difficulty = difficulty?.charAt(0)?.toUpperCase() + difficulty?.slice(1);
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

  // Header skeleton component
  const HeaderSkeleton = () => (
    <header className="bg-red-900/30 border-b border-red-500/30 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 flex items-center justify-center">
            <Skeleton className="h-12 w-12 bg-gray-800/50 rounded-full" />
          </div>
          <div>
            <Skeleton className="h-8 w-64 bg-gray-800/50 mb-2" />
            <Skeleton className="h-5 w-48 bg-gray-800/50" />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="flex flex-col items-end">
            <Skeleton className="h-7 w-36 bg-gray-800/50 mb-2" />
            <Skeleton className="h-5 w-24 bg-gray-800/50" />
          </div>
        </div>
      </div>
    </header>
  );

  return (
    <div className="min-h-screen text-white">
      {/* Header with logo and contest info */}
      {isLoading ? (
        <HeaderSkeleton />
      ) : (
        <header className="bg-red-900/30 border-b border-red-500/30 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <Logo extraClasses="h-12 w-12" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{contestInfo.name}</h1>
                <p className="text-red-300">
                  Database Contest - Advanced Level
                </p>
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
      )}

      <main className="container mx-auto p-4">
        {isLoading ? (
          <div className="space-y-6">
            {/* Tabs skeleton */}
            <div className="bg-red-500/20 border border-red-500/30 p-1 mb-6 flex space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-9 w-32 bg-gray-800/50 rounded" />
              ))}
            </div>

            {/* Content skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-10 w-full bg-gray-800/50" />
              <div className="grid grid-cols-4 gap-4">
                <Skeleton className="h-32 w-full bg-gray-800/50" />
                <Skeleton className="h-32 w-full bg-gray-800/50" />
                <Skeleton className="h-32 w-full bg-gray-800/50" />
                <Skeleton className="h-32 w-full bg-gray-800/50" />
              </div>
              <Skeleton className="h-64 w-full bg-gray-800/50" />
            </div>
          </div>
        ) : (
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
              isLoading={isLoading}
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
              isLoading={isLoading}
            />

            <VisualSchemaTab schema={{}} isLoading={isLoading} />
          </Tabs>
        )}
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
