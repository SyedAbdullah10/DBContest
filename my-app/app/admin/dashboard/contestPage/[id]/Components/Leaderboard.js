import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { User } from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const Leaderboard = () => {
  const contestants = [
    {
      rank: 1,
      username: "akhyarahmed",
      score: 4,
      penalty: 154,
      problems: {
        A: { time: "0:04:44", status: "solved" },
        B: { time: "0:13:14", status: "solved-highlight" },
        C: { time: "1:03:46", status: "solved" },
        D: { time: "1:13:01", status: "solved-highlight" },
        E: { time: "", status: "unsolved" },
        F: { time: "", status: "unsolved" },
        G: { time: "", status: "unsolved" },
        H: { time: "", status: "unsolved" },
        I: { time: "", status: "unsolved" },
      },
    },
    {
      rank: 2,
      username: "Muhammad_Sameed",
      score: 3,
      penalty: 69,
      problems: {
        A: { time: "0:09:15", status: "solved" },
        B: { time: "0:26:10", status: "solved" },
        C: { time: "0:34:06", status: "solved" },
        D: { time: "", status: "unsolved" },
        E: { time: "", status: "unsolved" },
        F: { time: "", status: "unsolved" },
        G: { time: "", status: "unsolved" },
        H: { time: "", status: "unsolved" },
        I: { time: "", status: "unsolved" },
      },
    },
    {
      rank: 3,
      username: "Umar26",
      score: 3,
      penalty: 105,
      problems: {
        A: { time: "0:02:54", status: "solved" },
        B: { time: "1:14:25", status: "solved" },
        C: { time: "0:28:12", status: "solved" },
        D: { time: "", status: "unsolved" },
        E: { time: "", status: "unsolved" },
        F: { time: "", status: "unsolved" },
        G: { time: "", status: "unsolved" },
        H: { time: "", status: "unsolved" },
        I: { time: "", status: "unsolved" },
      },
    },
    {
      rank: 4,
      username: "Huzaifa_Bari",
      score: 3,
      penalty: 119,
      problems: {
        A: { time: "0:01:36", status: "solved-highlight" },
        B: { time: "0:54:53 (-1)", status: "solved-penalty" },
        C: { time: "0:43:25", status: "solved" },
        D: { time: "(-4)", status: "failed" },
        E: { time: "", status: "unsolved" },
        F: { time: "", status: "unsolved" },
        G: { time: "", status: "unsolved" },
        H: { time: "", status: "unsolved" },
        I: { time: "", status: "unsolved" },
      },
    },
    {
      rank: 5,
      username: "Ali_Hadi787",
      score: 2,
      penalty: 28,
      problems: {
        A: { time: "0:09:36", status: "solved" },
        B: { time: "", status: "unsolved" },
        C: { time: "0:19:04", status: "solved-highlight" },
        D: { time: "(-1)", status: "failed" },
        E: { time: "", status: "unsolved" },
        F: { time: "", status: "unsolved" },
        G: { time: "", status: "unsolved" },
        H: { time: "", status: "unsolved" },
        I: { time: "", status: "unsolved" },
      },
    },
    {
      rank: 6,
      username: "Kirsh_Kumar",
      score: 2,
      penalty: 50,
      problems: {
        A: { time: "0:05:24", status: "solved" },
        B: { time: "", status: "unsolved" },
        C: { time: "0:44:52", status: "solved" },
        D: { time: "", status: "unsolved" },
        E: { time: "", status: "unsolved" },
        F: { time: "", status: "unsolved" },
        G: { time: "", status: "unsolved" },
        H: { time: "", status: "unsolved" },
        I: { time: "", status: "unsolved" },
      },
    },
    {
      rank: 7,
      username: "rahmanazam_ai",
      score: 2,
      penalty: 58,
      problems: {
        A: { time: "0:09:43 (-1)", status: "solved-penalty" },
        B: { time: "", status: "unsolved" },
        C: { time: "0:28:18", status: "solved" },
        D: { time: "", status: "unsolved" },
        E: { time: "", status: "unsolved" },
        F: { time: "", status: "unsolved" },
        G: { time: "", status: "unsolved" },
        H: { time: "", status: "unsolved" },
        I: { time: "", status: "unsolved" },
      },
    },
    {
      rank: 8,
      username: "Shareeq",
      score: 2,
      penalty: 60,
      problems: {
        A: { time: "0:06:21", status: "solved" },
        B: { time: "", status: "unsolved" },
        C: { time: "0:54:03", status: "solved" },
        D: { time: "", status: "unsolved" },
        E: { time: "", status: "unsolved" },
        F: { time: "", status: "unsolved" },
        G: { time: "", status: "unsolved" },
        H: { time: "", status: "unsolved" },
        I: { time: "", status: "unsolved" },
      },
    },
    {
      rank: 9,
      username: "Mureed_Hussain",
      score: 2,
      penalty: 68,
      problems: {
        A: { time: "0:11:39 (-1)", status: "solved-penalty" },
        B: { time: "(-1)", status: "failed" },
        C: { time: "0:36:29", status: "solved" },
        D: { time: "", status: "unsolved" },
        E: { time: "", status: "unsolved" },
        F: { time: "", status: "unsolved" },
        G: { time: "", status: "unsolved" },
        H: { time: "", status: "unsolved" },
        I: { time: "", status: "unsolved" },
      },
    },
    {
      rank: 10,
      username: "alimo223",
      score: 2,
      penalty: 72,
      problems: {
        A: { time: "0:27:38", status: "solved" },
        B: { time: "", status: "unsolved" },
        C: { time: "0:45:06", status: "solved" },
        D: { time: "", status: "unsolved" },
        E: { time: "", status: "unsolved" },
        F: { time: "", status: "unsolved" },
        G: { time: "", status: "unsolved" },
        H: { time: "", status: "unsolved" },
        I: { time: "", status: "unsolved" },
      },
    },
    {
      rank: 11,
      username: "legacyyyyyy",
      score: 2,
      penalty: 94,
      problems: {
        A: { time: "0:07:45", status: "solved" },
        B: { time: "", status: "unsolved" },
        C: { time: "1:27:11", status: "solved" },
        D: { time: "", status: "unsolved" },
        E: { time: "", status: "unsolved" },
        F: { time: "", status: "unsolved" },
        G: { time: "", status: "unsolved" },
        H: { time: "", status: "unsolved" },
        I: { time: "", status: "unsolved" },
      },
    },
    {
      rank: 12,
      username: "khanahsanali",
      score: 1,
      penalty: 2273,
      problems: {
        A: { time: "", status: "unsolved" },
        B: { time: "", status: "unsolved" },
        C: { time: "", status: "unsolved" },
        D: { time: "", status: "unsolved" },
        E: { time: "", status: "unsolved" },
        F: { time: "", status: "unsolved" },
        G: { time: "", status: "unsolved" },
        H: { time: "", status: "unsolved" },
        I: { time: "", status: "unsolved" },
      },
    },
  ];

  const problems = [
    { id: "A", solved: "12 / 14" },
    { id: "B", solved: "4 / 6" },
    { id: "C", solved: "11 / 11" },
    { id: "D", solved: "1 / 6" },
    { id: "E", solved: "0 / 0" },
    { id: "F", solved: "0 / 0" },
    { id: "G", solved: "0 / 0" },
    { id: "H", solved: "0 / 0" },
    { id: "I", solved: "0 / 0" },
  ];

  const formulate_leaderboard = () => {
    const db_rows = [
      {
        submitted_id: "1213",
        submitted_at: "00:02:34",
        status: "Wrong Answer",
        username: "ahsan_ali",
        question_name: "Q2",
        sql_mode: "mysql",
        user_answer: "SELECT * FROM TABLES",
      },
      {
        submitted_id: "1214",
        submitted_at: "00:05:12",
        status: "Correct Answer",
        username: "john_doe",
        question_name: "Q1",
        sql_mode: "postgresql",
        user_answer: "SELECT * FROM users",
      },
      {
        submitted_id: "1215",
        submitted_at: "00:10:45",
        status: "Wrong Answer",
        username: "ahsan_ali",
        question_name: "Q3",
        sql_mode: "mysql",
        user_answer: "SELECT * FROM wrong_table",
      },
      {
        submitted_id: "1216",
        submitted_at: "00:12:30",
        status: "Correct Answer",
        username: "jane_doe",
        question_name: "Q2",
        sql_mode: "sqlite",
        user_answer: "SELECT * FROM employees",
      },
      {
        submitted_id: "1217",
        submitted_at: "00:15:11",
        status: "Pending",
        username: "mike_smith",
        question_name: "Q1",
        sql_mode: "mysql",
        user_answer: "SELECT * FROM customers",
      },
      {
        submitted_id: "1218",
        submitted_at: "00:20:50",
        status: "Wrong Answer",
        username: "john_doe",
        question_name: "Q4",
        sql_mode: "postgresql",
        user_answer: "SELECT * FORM users",
      },
      {
        submitted_id: "1219",
        submitted_at: "00:25:00",
        status: "Correct Answer",
        username: "ahsan_ali",
        question_name: "Q5",
        sql_mode: "mysql",
        user_answer: "SELECT * FROM orders",
      },
      {
        submitted_id: "1220",
        submitted_at: "00:30:20",
        status: "Pending",
        username: "alex_jones",
        question_name: "Q3",
        sql_mode: "sqlite",
        user_answer: "SELECT * FROM products",
      },
      {
        submitted_id: "1221",
        submitted_at: "00:35:05",
        status: "Correct Answer",
        username: "jane_doe",
        question_name: "Q1",
        sql_mode: "mysql",
        user_answer: "SELECT * FROM students",
      },
      {
        submitted_id: "1222",
        submitted_at: "00:40:10",
        status: "Wrong Answer",
        username: "mike_smith",
        question_name: "Q2",
        sql_mode: "postgresql",
        user_answer: "SELECT * FROM wrong_table",
      },
    ];

    let data = new Map();
    for (let i in db_rows) {
      let element = db_rows[i];

      // If the username doesn't exist, create a new Map for that username
      if (!data.has(element.username)) {
        data.set(element.username, new Map());
      }

      // If the question_name doesn't exist for that username, create an empty array
      if (!data.get(element.username).has(element.question_name)) {
        data.get(element.username).set(element.question_name, []);
      }

      // Push the element details to the array for the specific question_name
      data
        .get(element.username)
        .get(element.question_name)
        .push([
          element.submitted_at,
          element.status,
          element.sql_mode,
          element.user_answer,
        ]);
    }

    // console.log(data);
    data.forEach((usernameMap, username) => {
      console.log(`${username}:`);
      usernameMap.forEach((submissions, question) => {
        console.log(`  ${question}:`);
        submissions.forEach((submission) => {
          console.log(
            `    - Submitted at: ${submission[0]}, Status: ${submission[1]}, SQL Mode: ${submission[2]}, Answer: ${submission[3]}`
          );
        });
      });
    });
  };

  return (
    <TabsContent value="leaderboard">
      <Card className="bg-black/40 border border-red-600/40 relative w-full shadow-lg px-5 pb-5">
        <CardContent className="p-6 flex flex-col items-center">
          <div className="flex justify-center items-center mb-4 w-full">
            <h3 className="text-xl font-bold text-white">Leaderboard</h3>
          </div>

          <div className="w-full overflow-x-auto rounded-lg border border-red-500/30">
            <Table className="w-full border-collapse">
              <TableHeader className="bg-red-900/20">
                <TableRow className="border-b border-red-500/30 hover:bg-transparent">
                  <TableHead className="border border-red-900/50 p-2 text-left text-white font-medium">
                    Rank
                  </TableHead>
                  <TableHead className="border border-red-900/50 p-2 text-left text-white font-medium">
                    Team
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
                {contestants.map((contestant) => (
                  <TableRow
                    key={contestant.rank}
                    className={
                      contestant.rank % 2 === 0
                        ? "hover:bg-red-900/10 transition-colors"
                        : "hover:bg-red-900/10 transition-colors"
                    }
                  >
                    <TableCell className="border border-red-900/30 p-2 text-white text-center font-mono">
                      {contestant.rank}
                    </TableCell>
                    <TableCell className="border border-red-900/30 p-2">
                      <div className="flex items-center gap-2">
                        <span className="mr-1">
                          <User color="red" />
                        </span>
                        <span className="text-white">
                          {contestant.username}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="border border-red-900/30 p-2 text-center font-mono font-bold text-white">
                      {contestant.score}
                    </TableCell>
                    <TableCell className="border border-red-900/30 p-2 text-center font-mono text-white">
                      {contestant.penalty}
                    </TableCell>

                    {["A", "B", "C", "D", "E", "F", "G", "H", "I"].map(
                      (problemId) => {
                        const problem = contestant.problems[problemId];

                        return (
                          <TableCell
                            key={`${contestant.rank}-${problemId}`}
                            className={`border border-red-900/30 p-2 text-center text-white font-mono ${
                              problem.status === "solved-highlight"
                                ? "bg-green-900/90"
                                : problem.status === "solved" ||
                                  problem.status === "solved-penalty"
                                ? "bg-green-600"
                                : problem.status === "failed"
                                ? "bg-red-900/100"
                                : ""
                            }`}
                          >
                            {problem.time}
                          </TableCell>
                        );
                      }
                    )}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default Leaderboard;
