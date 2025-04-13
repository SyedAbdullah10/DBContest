// "use client";

// import React from "react";
// import { TabsContent } from "@/components/ui/tabs";
// import { Card, CardContent } from "@/components/ui/card";

// const StatusTab = ({ questions, getDifficultyStyles, currentQuestion }) => {
//   return (
//     <TabsContent value="status">
//       <Card className="bg-black/40 border border-red-500/30">
//         <CardContent className="p-6">
//           <h3 className="text-xl font-bold mb-4 text-center text-white">
//             Contest Progress
//           </h3>
//           <div className="space-y-4">
//             {questions.map((q) => (
//               <div
//                 key={q.id}
//                 className="flex items-center justify-between p-3 border border-red-500/20 rounded-lg"
//               >
//                 <div>
//                   <h4 className="font-medium text-white">
//                     Question {q.id}: {q.title}
//                   </h4>
//                   <div className="flex items-center mt-1 space-x-2">
//                     <span
//                       className={`px-2 py-0.5 rounded text-xs ${getDifficultyStyles(
//                         q.difficulty
//                       )}`}
//                     >
//                       {q.difficulty}
//                     </span>
//                     <span className="text-red-300 text-sm">
//                       {q.points} points
//                     </span>
//                   </div>
//                 </div>
//                 <div className="flex items-center">
//                   {currentQuestion > q.id ? (
//                     <span className="bg-green-500/30 text-green-200 px-3 py-1 rounded-full text-sm">
//                       Completed
//                     </span>
//                   ) : currentQuestion === q.id ? (
//                     <span className="bg-yellow-500/30 text-yellow-200 px-3 py-1 rounded-full text-sm">
//                       In Progress
//                     </span>
//                   ) : (
//                     <span className="bg-gray-500/30 text-gray-300 px-3 py-1 rounded-full text-sm">
//                       Not Started
//                     </span>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         </CardContent>
//       </Card>
//     </TabsContent>
//   );
// };

// export default StatusTab;

"use client";

import React, { useEffect, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";

const StatusTab = ({ contest_id, getDifficultyStyles }) => {
  const { data: session, status } = useSession();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      const fetchSubmissions = async () => {
        try {
          const res = await fetch("/api/get-submissions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: session.user.id,
              contest_id: "b557de9a-01b1-4bc6-87c7-dae48116cc1d",
            }),
          });

          const data = await res.json();
          if (data.success) {
            setSubmissions(data.submissions);
          } else {
            console.error(data.error);
          }
        } catch (err) {
          console.error("Error fetching submissions", err);
        } finally {
          setLoading(false);
        }
      };

      fetchSubmissions();
    }
  }, [session, contest_id, status]);

  return (
    <TabsContent value="status">
      <Card className="bg-black/40 border border-red-500/30">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4 text-center text-white">
            All Submissions
          </h3>

          {loading ? (
            <p className="text-center text-white">Loading...</p>
          ) : submissions.length === 0 ? (
            <p className="text-center text-white">No submissions yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-white text-sm border border-red-500/30">
                <thead className="bg-red-500/20">
                  <tr>
                    <th className="px-4 py-2 border border-red-500/30 text-center">Question</th>
                    <th className="px-4 py-2 border border-red-500/30 text-center">SQL Mode</th>
                    <th className="px-4 py-2 border border-red-500/30 text-center">Status</th>
                    <th className="px-4 py-2 border border-red-500/30 text-center">Submitted At</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((sub, idx) => (
                    <Dialog key={sub.id || idx}>
                      <DialogTrigger asChild>
                        <tr className="cursor-pointer hover:bg-red-500/10 transition">
                          <td className="px-4 py-2 border border-red-500/30  text-center">
                            Question {sub.questionNumber}
                          </td>
                          <td className="px-4 py-2 border border-red-500/30 text-center">
                            <span className={`px-2 py-0.5 rounded ${getDifficultyStyles(sub.sql_mode)}`}>
                              {sub.sql_mode}
                            </span>
                          </td>
                          <td className="px-4 py-2 border border-red-500/30 text-center">
                            <span
                              className={`px-3 py-1 rounded-full text-sm ${
                                sub.status === "Accepted"
                                  ? "bg-green-500/30 text-green-200"
                                  : "bg-red-500/30 text-red-200"
                              }`}
                            >
                              {sub.status}
                            </span>
                          </td>
                          <td className="px-4 py-2 border border-red-500/30  text-center">
                            {sub.submitted_at.split(" | ")[1]}
                          </td>
                        </tr>
                      </DialogTrigger>

                      {/* ✅ Your existing popup untouched */}
                      <DialogContent className="bg-black/80 border border-red-500/30 max-w-xl text-white">
                        <DialogHeader>
                          <DialogTitle className="text-lg">
                            Question {sub.questionNumber}
                          </DialogTitle>
                        </DialogHeader>

                        <div className="text-sm mb-2 space-y-1">
                          <p>
                            <strong>Sql Mode:</strong>{" "}
                            <span className={getDifficultyStyles(sub.sql_mode)}>
                              {sub.sql_mode}
                            </span>
                          </p>
                          <p>
                            <strong>Status:</strong>{" "}
                            <span
                              className={
                                sub.status === "Accepted"
                                  ? "text-green-500"
                                  : "text-red-500"
                              }
                            >
                              {sub.status}
                            </span>
                          </p>
                          <p>
                            <strong>Submitted At:</strong>{" "}
                            {sub.submitted_at.split(" | ")[1]}
                          </p>
                        </div>

                        <div>
                          <p className="font-semibold mb-1">Your Answer:</p>
                          <pre className="bg-red-500/10 p-4 rounded text-white text-sm whitespace-pre-wrap border border-red-500/30">
                            {sub.user_answer}
                          </pre>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default StatusTab;





