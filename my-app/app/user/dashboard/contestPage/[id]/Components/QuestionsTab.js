"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Award,
  ChevronLeft,
  ChevronRight,
  Lightbulb,
  Code,
  Sparkles,
  Clock,
  ClipboardCopy,
} from "lucide-react";
import SqlEditor from "@/app/Components/SQL_Compiler/SqlEditor";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useSession } from "next-auth/react";
import { toast } from "react-toastify";

const showAcceptedToast = () => {
  toast.success(`ACCEPTED!`, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
  });
};

const showWrongAnswerToast = () => {
  toast.error(`WRONG ANSWER!`, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
  });
};

const showUnexpectedErrorToast = () => {
  toast.error(`UNEXPECTED ERROR OCCURRED`, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
  });
};

const QuestionsTab = React.memo(
  ({
    currentQuestion,
    questions,
    setQuestions,
    getDifficultyStyles,
    navigateQuestion,
    contestId,
    ddl,
    solvedStatus,
    setSolvedStatus,
  }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [dialogError, setDialogError] = useState("mysql");
    const [sqlQuery, setSqlQuery] = useState("");
    const [sqlMode, setSqlMode] = useState("mysql");
    const { data: session, status } = useSession();
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
      // Check if navigator and clipboard exist
      if (
        navigator &&
        navigator.clipboard &&
        typeof navigator.clipboard.writeText === "function"
      ) {
        // Modern browsers - use Clipboard API
        navigator.clipboard
          .writeText(ddl[sqlMode])
          .then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          })
          .catch((err) => {
            console.error("Clipboard write failed: ", err);
            fallbackCopyToClipboard();
          });
      } else {
        // Fallback for browsers without Clipboard API
        fallbackCopyToClipboard();
      }

      // Fallback function using document.execCommand
      function fallbackCopyToClipboard() {
        try {
          const textArea = document.createElement("textarea");
          textArea.value = ddl[sqlMode];

          // Make the textarea invisible but still part of the document
          textArea.style.position = "fixed";
          textArea.style.opacity = "0";
          document.body.appendChild(textArea);

          // Select and copy
          textArea.focus();
          textArea.select();

          const successful = document.execCommand("copy");
          if (successful) {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
          } else {
            console.error("Fallback copy failed");
          }

          // Clean up
          document.body.removeChild(textArea);
        } catch (err) {
          console.error("Fallback copy failed: ", err);
        }
      }
    };

    useEffect(() => {
      if (!questions || questions.length === 0 || currentQuestion < 1) return;

      const currentQuestionData = questions[currentQuestion - 1];
      if (!currentQuestionData) return;
    }, [currentQuestion, questions]);

    const openSubmitDialog = () => {
      setShowSubmitDialog(true);
      setDialogError("");
    };

    const handleSubmit = async () => {
      if (sqlQuery.split(" ")[0].toLowerCase() != "select") {
        setDialogError("Only DQL Queries Allowed");
        return;
      }
      if (solvedStatus[questions[currentQuestion - 1].id] == 1) {
        setDialogError("Already Solved!");
        return;
      }
      if (!sqlQuery.trim()) {
        setDialogError("Please enter a SQL query before submitting");
        return;
      }

      try {
        setIsSubmitting(true);
        const now = new Date();

        const datePart = now.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        });

        const timePart = now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });

        const formattedSubmittedAt = `${datePart} | ${timePart}`;

        let updatedSqlQuery = sqlQuery;
        if (updatedSqlQuery[updatedSqlQuery?.length - 1] == ";") {
          updatedSqlQuery = updatedSqlQuery?.substr(
            0,
            updatedSqlQuery?.length - 1
          );
        }

        let question_id = questions[currentQuestion - 1]?.id;
        const submissionData = {
          user_id: session.user.id,
          username: session.user.username,
          contest_id: contestId,
          question_id: questions[currentQuestion - 1]?.id,
          questionNumber: questions[currentQuestion - 1]?.questionNumber,
          submitted_at: formattedSubmittedAt,
          sql_mode: sqlMode,
          user_answer: updatedSqlQuery,
          ddl: false,
        };

        // console.log(submissionData);

        const response = await axios.post("/api/evaluate", submissionData);
        // console.log("Submission response:", response.data);

        if (response.data.result.status === "Accepted") {
          showAcceptedToast();
          setSolvedStatus((prev) => ({
            ...prev,
            question_id: 1,
          }));
        } else if (response.data.result.status === "Wrong Answer") {
          showWrongAnswerToast();
          if (solvedStatus[question_id == -1]) {
            setSolvedStatus((prev) => ({
              ...prev,
              question_id: 0,
            }));
          }
        } else {
          showUnexpectedErrorToast();
        }

        setSubmitted(true);
        setShowSubmitDialog(false);
      } catch (err) {
        console.log("Something went wrong!!", err);
        setDialogError("Failed to submit answer. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    const difficultyIcons = {
      easy: <Lightbulb className="w-4 h-4 mr-1" />,
      medium: <Code className="w-4 h-4 mr-1" />,
      hard: <Sparkles className="w-4 h-4 mr-1" />,
    };

    const currentQ = questions[currentQuestion - 1] || {};

    return (
      <TabsContent value="questions" className="space-y-4">
        <div className="flex justify-between items-center mb-4 ">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={() => navigateQuestion("prev")}
              disabled={currentQuestion === 1}
              className="hover:border-red-500/50 bg-white text-black hover:bg-red-900/30 hover:text-white"
            >
              <ChevronLeft className="mr-1" />
            </Button>
            {/*<div className="px-4 py-2 bg-red-900/20 rounded-md border border-red-500/30">
              Question {currentQuestion} of {questions.length}
            </div>*/}
            <div className="px-4 py-2 bg-red-900/20 rounded-md border border-red-500/30">
              Total Questions: {questions.length}
            </div>
            
            <Button
              variant="outline"
              onClick={() => navigateQuestion("next")}
              disabled={currentQuestion === questions.length}
              className="hover:border-red-500/50 bg-white text-black hover:bg-red-900/30 hover:text-white"
            >
              <ChevronRight className="ml-1" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            {solvedStatus[questions[currentQuestion - 1]?.id] == -1 ? (
              <>
                <span className="text-red-300 flex items-center">
                  <Award className="w-4 h-4 mr-1" />
                  {questions[currentQuestion - 1]?.points} pts
                </span>
                <span
                  className={`px-2 py-1 rounded text-xs font-bold ${getDifficultyStyles(
                    questions[currentQuestion - 1]?.difficulty
                  )}`}
                >
                  {questions[currentQuestion - 1]?.difficulty
                    .charAt(0)
                    .toUpperCase() +
                    questions[currentQuestion - 1]?.difficulty.slice(1) ||
                    "None"}
                </span>
              </>
            ) : solvedStatus[questions[currentQuestion - 1]?.id] == 1 ? (
              <span className="px-3 py-1 text-sm font-semibold text-white bg-green-500 rounded-full shadow-sm">
                SOLVED
              </span>
            ) : (
              <span className="px-3 py-1 text-sm font-semibold text-white bg-yellow-500 rounded-full shadow-sm">
                ATTEMPTED
              </span>
            )}
          </div>
        </div>

        {/* Question Card */}
        <Card className="bg-black/40 border border-red-500/30">
          <CardContent className="p-6">
            <div className="flex flex-col gap-5 justify-between items-start">
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  {questions[currentQuestion - 1]?.questionTitle}
                </h3>
                <p className="text-gray-300">
                  {questions[currentQuestion - 1]?.questionDescription}
                </p>
              </div>
            </div>
            <div className="bg-red-900/50 w-full h-1 my-8"></div>
            <div className="text-lg font-semibold flex justify-between text-red-300 mb-4">
              <span>Your Solution</span>
              <div className="flex gap-4">
                {" "}
                <Select
                  onValueChange={setSqlMode}
                  value={sqlMode}
                  defaultValue="Select DDL Type"
                >
                  <SelectTrigger className="w-56 mb-3 bg-black/40 backdrop-blur-lg text-white border focus:border-red-500/50 border-red-500/20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-black/40 backdrop-blur-lg text-white border border-red-500/20">
                    <SelectItem value="oracle">Oracle SQL</SelectItem>
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  onClick={handleCopy}
                  variant="outline"
                  size="sm"
                  className="hover:border-red-500/50 bg-white text-black hover:bg-red-900/30 hover:text-white transition w-max"
                >
                  <ClipboardCopy className="w-4 h-4 mr-1" />
                  {copied ? "Copied!" : `Copy ${sqlMode} DDL`}
                </Button>
              </div>
            </div>
            <div className="flex justify-start space-x-4">
              <Button
                onClick={() => window.open("/user/oneCompiler", "_blank")}
                className=" bg-blue-600 hover:bg-blue-700 "
              >
                Open Compiler
              </Button>
              <Button
                onClick={openSubmitDialog}
                disabled={
                  isSubmitting ||
                  solvedStatus[questions[currentQuestion - 1]?.id] == 1
                }
                className={`bg-red-900/80 hover:bg-red-800 text-white ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : "Submit Answer"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Submit Dialog */}
        <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
          <DialogContent className="bg-black/90 border border-red-500/50 text-white max-w-md">
            <DialogHeader>
              <DialogTitle className="text-red-300">
                Submit Your Answer
              </DialogTitle>
              <DialogDescription className="text-gray-300">
                Please confirm your submission details
              </DialogDescription>
            </DialogHeader>

            {dialogError && (
              <div className="bg-red-900/30 border border-red-500 p-3 rounded text-white mb-4">
                {dialogError}
              </div>
            )}

            <div className="space-y-4 py-2">
              <div>
                <Label htmlFor="sqlMode" className="text-gray-200">
                  SQL Mode
                </Label>
                <Select value={sqlMode} onValueChange={setSqlMode}>
                  <SelectTrigger className="bg-black/60 border-red-500/30 text-white">
                    <SelectValue placeholder="Select SQL Mode" />
                  </SelectTrigger>
                  <SelectContent className="bg-black/90 border-red-500/30 text-white">
                    <SelectItem value="mysql">MySQL</SelectItem>
                    <SelectItem value="postgresql">PostgreSQL</SelectItem>
                    <SelectItem value="oracle">OracleSQL</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="sql_query" className="text-gray-200">
                  Answer Query
                </Label>
                <textarea
                  id="sql_query"
                  className="w-full h-24 bg-black/60 border border-red-500/30 rounded p-2 text-white"
                  placeholder="Enter your SQL Query here. . . ."
                  value={sqlQuery}
                  onChange={(e) => setSqlQuery(e.target.value)}
                />
              </div>
            </div>

            <DialogFooter className="flex space-x-2 justify-end">
              <Button
                variant="outline"
                onClick={() => setShowSubmitDialog(false)}
                className="border-red-500/30 hover:bg-red-900/20 text-black hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`bg-red-800 hover:bg-red-700 text-white ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {isSubmitting ? "Submitting..." : "Confirm Submission"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TabsContent>
    );
  }
);

export default QuestionsTab;
