'use client';
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { motion } from "framer-motion";

export default function Leaderboard() {
  const [contests, setContests] = useState([]);
  const [selectedContest, setSelectedContest] = useState(null);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      redirect('/user');
    }
  });

  // Sample finished contests
  useEffect(() => {
    const sampleContests = [
      { id: 1, title: "DB Contest #1", end_date: "2024-03-15" },
      { id: 2, title: "Algorithm Challenge", end_date: "2024-02-20" },
      { id: 3, title: "SQL Query Battle", end_date: "2024-01-30" }
    ];
    setContests(sampleContests);
  }, []);

  // Sample leaderboard data
  useEffect(() => {
    if (!selectedContest) return;

    const sampleLeaderboard = {
      1: [
        { username: "Alice", question_scores: { Q1: 100, Q2: 80, Q3: 90 }, total_score: 270 },
        { username: "Bob", question_scores: { Q1: 90, Q2: 70, Q3: 85 }, total_score: 245 },
        { username: "Charlie", question_scores: { Q1: 85, Q2: 75, Q3: 80 }, total_score: 240 }
      ],
      2: [
        { username: "Eve", question_scores: { Q1: 95, Q2: 85 }, total_score: 180 },
        { username: "Mallory", question_scores: { Q1: 80, Q2: 90 }, total_score: 170 }
      ],
      3: [
        { username: "Trudy", question_scores: { Q1: 88, Q2: 76, Q3: 95 }, total_score: 259 }
      ]
    };

    setLeaderboardData(sampleLeaderboard[selectedContest.id] || []);
  }, [selectedContest]);

  if (status === "loading") return <div>Loading...</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 max-w-6xl"
    >
      <h1 className="text-3xl font-bold text-white mb-8">Contest Leaderboards</h1>

      {/* Contest Selection */}
      <div className="mb-8">
        <h2 className="text-xl text-white/80 mb-4">Select a Finished Contest</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contests.map((contest) => (
            <button
              key={contest.id}
              onClick={() => setSelectedContest(contest)}
              className={`p-4 rounded-lg border ${
                selectedContest?.id === contest.id
                  ? 'bg-red-500/20 border-red-500'
                  : 'bg-black/40 border-red-500/30 hover:bg-black/60'
              } transition-all`}
            >
              <h3 className="text-white font-semibold">{contest.title}</h3>
              <p className="text-white/60 text-sm">
                Ended: {new Date(contest.end_date).toLocaleDateString()}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Leaderboard Display */}
      {selectedContest && (
        <div className="bg-black/40 rounded-xl p-6 border border-red-500/30">
          <h2 className="text-2xl font-bold text-white mb-6">
            {selectedContest.title} - Leaderboard
          </h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-red-500/30">
                  <th className="text-left p-3 text-white">Rank</th>
                  <th className="text-left p-3 text-white">Username</th>
                  {leaderboardData.length > 0 &&
                    Object.keys(leaderboardData[0].question_scores || {}).map((key, idx) => (
                      <th key={idx} className="text-center p-3 text-white">
                        {key}
                      </th>
                    ))}
                  <th className="text-center p-3 text-white">Total Score</th>
                </tr>
              </thead>
              <tbody>
                {leaderboardData.map((entry, index) => (
                  <tr
                    key={index}
                    className="border-b border-red-500/10 hover:bg-red-500/5"
                  >
                    <td className="p-3 text-white/90">{index + 1}</td>
                    <td className="p-3 text-white/90">{entry.username}</td>
                    {Object.values(entry.question_scores || {}).map((score, idx) => (
                      <td key={idx} className="text-center p-3 text-white/90">
                        {score}
                      </td>
                    ))}
                    <td className="text-center p-3 font-semibold text-red-400">
                      {entry.total_score}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </motion.div>
  );
}
