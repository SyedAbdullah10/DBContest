import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  User,
  CheckCircle,
  XCircle,
  UserCircle,
  CheckSquare,
} from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "react-toastify";
import {
  showErrorToast,
  showUpdatedToast,
} from "@/app/Components/Dumped/utils/toast";

const Leaderboard = ({ contestId }) => {
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedSubmissions, setSelectedSubmissions] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);

  useEffect(() => {
    const fetchLeaderboardData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/leaderboard/${contestId}`);
        setLeaderboardData(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to load leaderboard data");
        setLoading(false);
        console.error("Error fetching leaderboard data:", err);
      }
    };

    if (contestId) {
      fetchLeaderboardData();
    }
  }, [contestId]);

  const handleCellClick = (participant, questionNumber) => {
    // Find the question in the participant's questions array
    const question = participant.questions.find(
      (q) => q.questionNumber === questionNumber
    );

    if (question && question.submissions.length > 0) {
      setSelectedSubmissions({
        username: participant.username,
        participantId: participant.id,
        questionNumber: questionNumber,
        questionTitle: question.questionTitle,
        questionId: question.id,
        submissions: question.submissions,
      });
      setDialogOpen(true);
    }
  };

  const handleAcceptSubmission = async (submission_id) => {
    if (!selectedSubmissions) return;

    setAcceptLoading(true);
    try {
      // Call the correct API route with submission_id in the URL
      await axios.post(`/api/submission/${submission_id}/accept`);

      showUpdatedToast();
      // Optionally refresh leaderboard
      // const response = await axios.get(`/api/leaderboard/${contestId}`);
      // setLeaderboardData(response.data);

      // Close the dialog
      setDialogOpen(false);
    } catch (err) {
      showErrorToast();
      console.error("Error accepting submission:", err);
    } finally {
      setAcceptLoading(false);
    }
  };

  if (loading)
    return (
      <TabsContent value="leaderboard">
        <div className="text-white text-center py-8">
          Loading leaderboard...
        </div>
        ); if (error) return{" "}
        <div className="text-red-500 text-center py-8">{error}</div>; if
        (!leaderboardData) return (
        <div className="text-white text-center py-8">
          No leaderboard data available
        </div>
      </TabsContent>
    );

  const { contest, questions, leaderboard } = leaderboardData;

  // Create an array of problems with solved count information
  const problems = questions.map((question) => {
    // Count how many participants solved this question
    const solvedCount = leaderboard.filter((participant) => {
      const questionData = participant.questions.find(
        (q) => q.id === question.id
      );
      return questionData && questionData.solved;
    }).length;

    return {
      id: question.questionNumber,
      title: question.questionTitle,
      solved: `${solvedCount} / ${leaderboard.length}`,
      difficulty: question.difficulty,
      points: question.points,
    };
  });

  return (
    <TabsContent value="leaderboard">
      <Card className="bg-black/40 border border-red-600/40 relative w-full shadow-lg px-5 pb-5">
        <CardContent className="p-6 flex flex-col items-center">
          <div className="flex justify-center items-center mb-4 w-full">
            <h3 className="text-xl font-bold text-white">
              {contest.name} Leaderboard
            </h3>
          </div>

          <div className="w-full overflow-x-auto rounded-lg border border-red-500/30">
            <Table className="w-full border-collapse">
              <TableHeader className="bg-red-900/20">
                <TableRow className="border-b border-red-500/30 hover:bg-transparent">
                  <TableHead className="border border-red-900/50 p-2 text-left text-white font-medium">
                    Rank
                  </TableHead>
                  <TableHead className="border border-red-900/50 p-2 text-left text-white font-medium">
                    Participant
                  </TableHead>
                  <TableHead className="border border-red-900/50 p-2 text-center text-white font-medium">
                    Score
                  </TableHead>
                  <TableHead className="border border-red-900/50 p-2 text-center text-white font-medium">
                    Penalty
                  </TableHead>
                  {problems.map((problem) => (
                    <TableHead
                      key={problem.id}
                      className="border border-red-900/50 p-2 text-center text-white font-medium"
                    >
                      <div className="flex flex-col items-center">
                        <div className="font-bold">{problem.id}</div>
                        <div className="text-xs text-white">
                          {problem.solved}
                        </div>
                      </div>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>

              <TableBody>
                {leaderboard.map((participant) => (
                  <TableRow
                    key={participant.id}
                    className={
                      participant.rank % 2 === 0
                        ? "hover:bg-red-900/10 transition-colors"
                        : "hover:bg-red-900/10 transition-colors"
                    }
                  >
                    <TableCell className="border border-red-900/30 p-2 text-white text-center font-mono">
                      {participant.rank}
                    </TableCell>
                    <TableCell className="border border-red-900/30 p-2">
                      <div className="flex items-center gap-2">
                        <span className="mr-1">
                          <User color="red" />
                        </span>
                        <span className="text-white">
                          {participant.username}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="border border-red-900/30 p-2 text-center font-mono font-bold text-white">
                      {participant.score}
                    </TableCell>
                    <TableCell className="border border-red-900/30 p-2 text-center font-mono text-white">
                      {participant.penalty}
                    </TableCell>

                    {problems.map((problem, index) => {
                      const questionData = participant.questions.find(
                        (q) => q.questionNumber === problem.id
                      );

                      console.log(questionData);

                      // Determine the time to display and the status
                      let timeDisplay = "";
                      let status = "unsolved";

                      if (questionData) {
                        const acceptedSubmission =
                          questionData.submissions.find(
                            (s) => s.status === "Accepted"
                          );

                        if (acceptedSubmission) {
                          // Extract time from the submission time string (format: "Apr 10, 2025 | 10:22:00 AM")
                          const timeMatch =
                            acceptedSubmission.submittedAt.match(/\d+:\d+:\d+/);
                          timeDisplay = timeMatch ? timeMatch[0] : "";

                          // Count wrong submissions
                          const wrongSubmissions =
                            // questionData.submissions.filter(
                            //   (s) =>
                            //     s.status === "Wrong Answer" &&
                            //     new Date(s.submittedAt) <
                            //       new Date(acceptedSubmission.submittedAt)
                            // ).length;
                            questionData.wrongAnswers;

                          if (wrongSubmissions > 0) {
                            timeDisplay += ` | (-${wrongSubmissions})`;
                            status = "solved-penalty";
                          } else {
                            status = questionData.firstSolve
                              ? "solved-highlight"
                              : "solved";
                          }
                        } else {
                          // If there are only wrong submissions
                          const wrongCount =
                            // questionData.submissions.filter(
                            //   (s) => s.status === "Wrong Answer"
                            // ).length;
                            questionData.wrongAnswers;

                          if (wrongCount > 0) {
                            timeDisplay = `(-${wrongCount})`;
                            status = "failed";
                          }
                        }
                      }

                      return (
                        <TableCell
                          key={`${participant.id}-${problem.id}`}
                          className={`border border-red-900/30 p-2 text-center text-white font-mono cursor-pointer ${
                            status === "solved-highlight"
                              ? "bg-green-900/90"
                              : status === "solved" ||
                                status === "solved-penalty"
                              ? "bg-green-600"
                              : status === "failed"
                              ? "bg-red-900/100"
                              : ""
                          } hover:opacity-80`}
                          onClick={() =>
                            handleCellClick(participant, problem.id)
                          }
                          title={
                            questionData && questionData.submissions.length > 0
                              ? "Click to view submissions"
                              : ""
                          }
                        >
                          {timeDisplay.split("|").map((t, t_index) => {
                            return <div key={t_index}>{t}</div>;
                          })}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="bg-black text-white border border-red-500/30 max-w-5xl rounded-lg shadow-xl">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-xl font-bold flex items-center">
              {selectedSubmissions && (
                <span className="flex items-center">
                  <UserCircle className="w-5 h-5 mr-2 text-red-400" />
                  <span className="text-red-400 font-medium">
                    {selectedSubmissions.username}
                  </span>
                  <span className="mx-2">-</span>
                  <span className="font-semibold">
                    {selectedSubmissions.questionNumber}:{" "}
                    {selectedSubmissions.questionTitle}
                  </span>
                </span>
              )}
            </DialogTitle>
          </DialogHeader>

          {selectedSubmissions && (
            <div className="max-h-96 overflow-y-auto custom-scrollbar rounded-md border border-red-500/20">
              <Table className="w-full">
                <TableHeader className="bg-gradient-to-r from-red-900/30 to-gray-800/50 sticky top-0 z-10">
                  <TableRow>
                    <TableHead className="text-white font-medium py-3">
                      Submitted At
                    </TableHead>
                    <TableHead className="text-white font-medium">
                      Status
                    </TableHead>
                    <TableHead className="text-white font-medium">
                      SQL Mode
                    </TableHead>
                    <TableHead className="text-white font-medium">
                      Solution
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {selectedSubmissions.submissions.map((submission, index) => {
                    // Find the accepted submission for reference
                    const acceptedSubmission =
                      selectedSubmissions.submissions.find(
                        (s) => s.status === "Accepted"
                      );

                    // Count how many wrong attempts before this one if it's the accepted submission
                    let wrongAttemptsBeforeAccepted = 0;
                    if (submission.status === "Accepted") {
                      wrongAttemptsBeforeAccepted =
                        selectedSubmissions.submissions.filter(
                          (s) =>
                            s.status === "Wrong Answer" &&
                            new Date(s.submittedAt) <
                              new Date(submission.submittedAt)
                        ).length;
                    }

                    return (
                      <TableRow
                        key={index}
                        className={`border-t border-red-500/30 transition-colors hover:bg-gray-800/50 ${
                          submission.status === "Accepted"
                            ? "bg-green-900/10"
                            : submission.status === "Wrong Answer"
                            ? "bg-red-900/10"
                            : "bg-yellow-900/10"
                        }`}
                      >
                        <TableCell className="text-gray-300 text-sm">
                          {/* {new Date(
                            
                          ).toLocaleString()} */}
                          {submission.submittedAt.split("|").join("\n")}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium flex items-center w-fit ${
                              submission.status === "Accepted"
                                ? "bg-green-600/80 text-white"
                                : submission.status === "Wrong Answer"
                                ? "bg-red-600/80 text-white"
                                : "bg-yellow-600/80 text-white"
                            }`}
                          >
                            {submission.status === "Accepted" && (
                              <CheckCircle className="w-3 h-3 mr-1" />
                            )}
                            {submission.status === "Wrong Answer" && (
                              <XCircle className="w-3 h-3 mr-1" />
                            )}
                            {submission.status === "Processing" && (
                              <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                            )}
                            {submission.status}
                            {submission.status === "Accepted" &&
                              wrongAttemptsBeforeAccepted > 0 && (
                                <span className="ml-1 text-gray-200 text-xs">
                                  (after {wrongAttemptsBeforeAccepted} wrong{" "}
                                  {wrongAttemptsBeforeAccepted === 1
                                    ? "attempt"
                                    : "attempts"}
                                  )
                                </span>
                              )}
                          </span>
                        </TableCell>
                        <TableCell className="text-gray-300 text-sm">
                          {submission.sql_mode}
                        </TableCell>
                        <TableCell className="max-w-md">
                          <div className="bg-gray-800 p-2 rounded border border-gray-700 overflow-x-auto">
                            <pre className="text-xs font-mono text-gray-200">
                              <code>{submission.userAnswer}</code>
                            </pre>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              className="border-red-500/50 text-black hover:bg-red-900/20 hover:text-white transition-colors"
              onClick={() => setDialogOpen(false)}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Close
            </Button>
            {/* {selectedSubmissions &&
              selectedSubmissions.submissions.some(
                (s) => s.status === "Wrong Answer"
              ) && (
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white transition-colors"
                  onClick={() => handleReviewAll()}
                >
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Review All
                </Button>
              )} */}
          </div>
        </DialogContent>
      </Dialog>
    </TabsContent>
  );
};

export default Leaderboard;
