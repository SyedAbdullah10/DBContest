"use client";

import React from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, ChevronLeft, ChevronRight } from "lucide-react";
import SqlEditor from "@/app/Components/SQL_Compiler/SqlEditor";

const QuestionsTab = ({
  currentQuestion,
  questions,
  sqlQuery,
  setSqlQuery,
  sqlMode,
  setSqlMode,
  handleRun,
  handleSubmit,
  submitted,
  getDifficultyStyles,
  navigateQuestion,
}) => {
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
            {questions[currentQuestion - 1].points} pts
          </span>
          <span
            className={`px-2 py-1 rounded text-xs font-bold ${getDifficultyStyles(
              questions[currentQuestion - 1].difficulty
            )}`}
          >
            {questions[currentQuestion - 1].difficulty}
          </span>
        </div>
      </div>

      <Card className="bg-black/40 border border-red-500/30">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-2 text-white">
            {questions[currentQuestion - 1].title}
          </h3>
          <p className="text-gray-300 mb-6">
            {questions[currentQuestion - 1].description}
          </p>

          <h4 className="text-lg font-semibold mb-2 text-red-300">
            Your Solution
          </h4>
          <div className="mb-4">
            <SqlEditor
              query={sqlQuery}
              setQuery={setSqlQuery}
              sqlMode={sqlMode}
              setSqlMode={setSqlMode}
            />
          </div>

          <div className="flex justify-end space-x-4 mt-6">
            <Button
              variant="outline"
              onClick={handleRun}
              className="hover:border-red-500/50 text-black hover:bg-red-900/30 hover:text-white"
            >
              Run Query
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={submitted}
              className={`bg-red-500 hover:bg-red-600 text-white ${
                submitted ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {submitted ? "Submitting..." : "Submit Answer"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default QuestionsTab;
