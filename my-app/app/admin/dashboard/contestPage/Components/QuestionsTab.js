"use client";

import React, { useState, useEffect } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Award, ChevronLeft, ChevronRight, Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const QuestionsTab = React.memo(
  ({
    currentQuestion,
    questions,
    setQuestions,
    getDifficultyStyles,
    navigateQuestion,
  }) => {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedDescription, setEditedDescription] = useState("");

    const handleEditClick = () => {
      setEditedTitle(questions[currentQuestion - 1].title);
      setEditedDescription(questions[currentQuestion - 1].description);
      setIsEditDialogOpen(true);
    };

    const handleSaveEdit = () => {
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestion - 1] = {
        ...updatedQuestions[currentQuestion - 1],
        title: editedTitle,
        description: editedDescription,
      };

      // send API call to supabase!
      setQuestions(updatedQuestions);
      setIsEditDialogOpen(false);
    };

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
            <div className="flex flex-col gap-5 justify-between items-start">
              <div>
                <h3 className="text-xl font-bold mb-2 text-white">
                  {questions[currentQuestion - 1].title}
                </h3>
                <p className="text-gray-300">
                  {questions[currentQuestion - 1].description}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleEditClick}
                className="bg-transparent text-white border border-red-500 px-4 py-2 rounded-md font-bold transition hover:bg-red-500 hover:border-transparent"
              >
                <Edit className="w-4 h-4 font-bold" /> Edit Question
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-black/90 border border-red-500/30 text-white">
            <DialogHeader>
              <DialogTitle className="text-red-300 w-full text-center">Edit Question</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label
                  htmlFor="title"
                  className="text-sm font-medium text-gray-300"
                >
                  Title
                </label>
                <Input
                  id="title"
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="bg-black/60 border-red-500/30 text-white"
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="text-sm font-medium text-gray-300"
                >
                  Description
                </label>
                <Textarea
                  id="description"
                  value={editedDescription}
                  onChange={(e) => setEditedDescription(e.target.value)}
                  rows={5}
                  className="bg-black/60 border-red-500/30 text-white"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="hover:border-red-500/50 bg-transparent hover:text-white text-white hover:bg-red-900/30"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TabsContent>
    );
  }
);

export default QuestionsTab;
