"use client";

import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";

const StatusTab = ({ questions, getDifficultyStyles, currentQuestion }) => {
  return (
    <TabsContent value="status">
      <Card className="bg-black/40 border border-red-500/30">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4 text-center text-white">
            Contest Progress
          </h3>
          <div className="space-y-4">
            {questions.map((q) => (
              <div
                key={q.id}
                className="flex items-center justify-between p-3 border border-red-500/20 rounded-lg"
              >
                <div>
                  <h4 className="font-medium text-white">
                    Question {q.id}: {q.title}
                  </h4>
                  <div className="flex items-center mt-1 space-x-2">
                    <span
                      className={`px-2 py-0.5 rounded text-xs ${getDifficultyStyles(
                        q.difficulty
                      )}`}
                    >
                      {q.difficulty}
                    </span>
                    <span className="text-red-300 text-sm">
                      {q.points} points
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  {currentQuestion > q.id ? (
                    <span className="bg-green-500/30 text-green-200 px-3 py-1 rounded-full text-sm">
                      Completed
                    </span>
                  ) : currentQuestion === q.id ? (
                    <span className="bg-yellow-500/30 text-yellow-200 px-3 py-1 rounded-full text-sm">
                      In Progress
                    </span>
                  ) : (
                    <span className="bg-gray-500/30 text-gray-300 px-3 py-1 rounded-full text-sm">
                      Not Started
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default StatusTab;
