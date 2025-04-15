// "use client";

// import React, { useState, useEffect } from "react";
// import { TabsContent } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Award,
//   ChevronLeft,
//   ChevronRight,
//   Lightbulb,
//   Code,
//   Sparkles,
//   Clock,
// } from "lucide-react";
// import SqlEditor from "@/app/Components/SQL_Compiler/SqlEditor";

// const QuestionsTab = React.memo(
//   ({
//     currentQuestion,
//     questions,
//     setQuestions,
//     getDifficultyStyles,
//     navigateQuestion,
//     contestId

//     /*

//           currentQuestion={currentQuestion}
//     questions={questions}
//     setQuestions={setQuestions}
//     getDifficultyStyles={getDifficultyStyles}
//     navigateQuestion={navigateQuestion}
//     contestId={contestId}

//     */

//   }) => {
//     const handleSubmit = () => {
//       try {
//         // user_id,
//         // contest_id,
//         // question_id,
//         // submitted_at,
//         // sql_mode,
//         // user_answer,
//         // dbType,
//         // ddl,

//       } catch (err) {
//         console.log("Something went wrong!!", err);
//       }
//     };

//     const [isSubmitting, setIsSubmitting] = useState(false);

//     // sqlQuery,
//     // setSqlQuery,
//     // sqlMode,
//     // setSqlMode,

//     useEffect(() => {
//       if (!questions || questions.length === 0 || currentQuestion < 1) return;

//       const currentQuestionData = questions[currentQuestion - 1];
//       if (!currentQuestionData) return;
//     }, [currentQuestion, questions]);

//     const difficultyIcons = {
//       easy: <Lightbulb className="w-4 h-4 mr-1" />,
//       medium: <Code className="w-4 h-4 mr-1" />,
//       hard: <Sparkles className="w-4 h-4 mr-1" />,
//     };

//     const currentQ = questions[currentQuestion - 1] || {};

//     return (
//       <TabsContent value="questions" className="space-y-4">
//         <div className="flex justify-between items-center mb-4 ">
//           <div className="flex items-center space-x-4">
//             <Button
//               variant="outline"
//               onClick={() => navigateQuestion("prev")}
//               disabled={currentQuestion === 1}
//               className="hover:border-red-500/50 bg-white text-black hover:bg-red-900/30 hover:text-white"
//             >
//               <ChevronLeft className="mr-1" /> Previous
//             </Button>
//             <div className="px-4 py-2 bg-red-900/20 rounded-md border border-red-500/30">
//               Question {currentQuestion} of {questions.length}
//             </div>
//             <Button
//               variant="outline"
//               onClick={() => navigateQuestion("next")}
//               disabled={currentQuestion === questions.length}
//               className="hover:border-red-500/50 bg-white text-black hover:bg-red-900/30 hover:text-white"
//             >
//               Next <ChevronRight className="ml-1" />
//             </Button>
//           </div>
//           <div className="flex items-center space-x-2">
//             <span className="text-red-300 flex items-center">
//               <Award className="w-4 h-4 mr-1" />
//               {questions[currentQuestion - 1]?.points} pts
//             </span>
//             <span
//               className={`px-2 py-1 rounded text-xs font-bold ${getDifficultyStyles(
//                 questions[currentQuestion - 1]?.difficulty
//               )}`}
//             >
//               {questions[currentQuestion - 1]?.difficulty
//                 .charAt(0)
//                 .toUpperCase() +
//                 questions[currentQuestion - 1]?.difficulty.slice(1) || "None"}
//             </span>
//           </div>
//         </div>

//         {/* Question Card */}
//         <Card className="bg-black/40 border border-red-500/30">
//           <CardContent className="p-6">
//             <div className="flex flex-col gap-5 justify-between items-start">
//               <div>
//                 <h3 className="text-xl font-bold mb-2 text-white">
//                   {questions[currentQuestion - 1]?.questionTitle}
//                 </h3>
//                 <p className="text-gray-300">
//                   {questions[currentQuestion - 1]?.questionDescription}
//                 </p>
//               </div>
//             </div>
//             <div className="bg-red-900/50 w-full h-1 my-5"></div>
//             <h4 className="text-lg font-semibold mb-2 text-red-300">
//               Your Solution
//             </h4>
//             <div className="mb-4">
//               <SqlEditor
//                 query={sqlQuery}
//                 setQuery={setSqlQuery}
//                 sqlMode={sqlMode}
//                 setSqlMode={setSqlMode}
//               />
//             </div>

//             <div className="flex justify-end space-x-4 mt-6">
//               <Button
//                 variant="outline"
//                 onClick={handleRun}
//                 className="hover:border-red-500/50 text-black hover:bg-red-900/30 hover:text-white"
//               >
//                 Run Query
//               </Button>
//               <Button
//                 onClick={handleSubmit}
//                 disabled={submitted}
//                 className={`bg-red-900/80 hover:bg-red-800 text-white ${
//                   submitted ? "opacity-50 cursor-not-allowed" : ""
//                 }`}
//               >
//                 {submitted ? "Submitting..." : "Submit Answer"}
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </TabsContent>
//     );
//   }
// );

// export default QuestionsTab;

"use client";

import React, { useState, useEffect } from "react";
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
import OneCompiler from "@/app/Components/OneCompiler";

const QuestionsTab = React.memo(
  ({
    currentQuestion,
    questions,
    setQuestions,
    getDifficultyStyles,
    navigateQuestion,
    contestId,
    ddl,
  }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [showSubmitDialog, setShowSubmitDialog] = useState(false);
    const [dialogError, setDialogError] = useState("mysql");
    const [sqlQuery, setSqlQuery] = useState("");
    const [sqlMode, setSqlMode] = useState("mysql");
    const { data: session, status } = useSession();
    const [copied, setCopied] = useState(false);

    const [isDevToolsOpen, setIsDevToolsOpen] = useState(false);

    const handleCopy = () => {
      navigator.clipboard.writeText(ddl[sqlMode]).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      });
    };

    useEffect(() => {
      // Function to check if DevTools is open
      const detectDevTools = () => {
        if (
          window.outerWidth - window.innerWidth > 160 ||
          window.outerHeight - window.innerHeight > 160
        ) {
          setIsDevToolsOpen(true);
        } else {
          setIsDevToolsOpen(false);
        }
      };

      // Block keyboard shortcuts
      const blockShortcuts = (event) => {
        if (
          event.key === "F12" || // DevTools
          (event.ctrlKey &&
            event.shiftKey &&
            ["I", "J", "C"].includes(event.key)) || // Ctrl+Shift+I/J/C
          (event.ctrlKey && ["U", "L"].includes(event.key.toUpperCase())) || // Ctrl+U (View Source), Ctrl+L
          (event.altKey && ["ArrowLeft", "ArrowRight"].includes(event.key)) // Alt + Left/Right
        ) {
          event.preventDefault();
        }
      };

      // Prevent right-click
      const disableRightClick = (event) => event.preventDefault();

      const devToolsCheckInterval = setInterval(detectDevTools, 1000);

      // document.addEventListener("keydown", blockShortcuts);
      // document.addEventListener("contextmenu", disableRightClick);
      // window.addEventListener("resize", detectDevTools); // Recheck when resizing

      return () => {
        document.removeEventListener("keydown", blockShortcuts);
        document.removeEventListener("contextmenu", disableRightClick);
        window.removeEventListener("resize", detectDevTools);
        clearInterval(devToolsCheckInterval);
      };
    }, []);

    useEffect(() => {
      if (!questions || questions.length === 0 || currentQuestion < 1) return;

      const currentQuestionData = questions[currentQuestion - 1];
      if (!currentQuestionData) return;
    }, [currentQuestion, questions]);

    const handleRun = () => {
      // Placeholder for run query functionality
      console.log("Running query:", sqlQuery);
    };

    const openSubmitDialog = () => {
      setShowSubmitDialog(true);
      setDialogError("");
    };

    const handleSubmit = async () => {
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

        const submissionData = {
          user_id: session.user.id,
          contest_id: contestId,
          question_id: questions[currentQuestion - 1]?.id,
          submitted_at: formattedSubmittedAt,
          sql_mode: sqlMode,
          user_answer: sqlQuery,
          ddl: false,
        };

        // user_id,
        // contest_id,
        // question_id,
        // submitted_at,
        // sql_mode,
        // user_answer,
        // ddl,

        console.log(submissionData);

        const response = await axios.post("/api/evaluate", submissionData);
        console.log("Submission response:", response.data);

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
              <ChevronLeft className="mr-1" /> Previous
            </Button>
            <div className="px-4 py-2 bg-red-900/20 rounded-md border border-red-500/30">
              Question {currentQuestion} of {questions.length}
            </div>
            <Button
              variant="outline"
              onClick={() => navigateQuestion("next")}
              disabled={currentQuestion === questions.length}
              className="hover:border-red-500/50 bg-white text-black hover:bg-red-900/30 hover:text-white"
            >
              Next <ChevronRight className="ml-1" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
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
                questions[currentQuestion - 1]?.difficulty.slice(1) || "None"}
            </span>
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
            <div className="text-lg font-semibold flex gap-3 text-red-300 mb-4">
              <span>Your Solution</span>
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
            {/* <div className="mb-4">
              <SqlEditor
                query={sqlQuery}
                setQuery={setSqlQuery}
                sqlMode={sqlMode}
                setSqlMode={setSqlMode}
              />
            </div> */}

            {isDevToolsOpen ? (
              <h1 className="text-red-600 text-2xl font-bold">
                DevTools detected!!
              </h1>
            ) : (
              <OneCompiler />
            )}

            <div className="flex justify-end space-x-4 mt-6">
              <Button
                onClick={openSubmitDialog}
                disabled={isSubmitting}
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
                  placeholder="Enter DDL statements (optional)"
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
