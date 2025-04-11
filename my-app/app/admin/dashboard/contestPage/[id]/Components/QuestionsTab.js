// "use client";

// import React, { useState, useEffect } from "react";
// import { TabsContent } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import { Award, ChevronLeft, ChevronRight, Edit } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";

// const QuestionsTab = React.memo(
//   ({
//     currentQuestion,
//     questions,
//     setQuestions,
//     getDifficultyStyles,
//     navigateQuestion,
//   }) => {
//     const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//     const [editedTitle, setEditedTitle] = useState("");
//     const [editedDescription, setEditedDescription] = useState("");

//     const handleEditClick = () => {
//       setEditedTitle(questions[currentQuestion - 1].title);
//       setEditedDescription(questions[currentQuestion - 1].description);
//       setIsEditDialogOpen(true);
//     };

//     const handleSaveEdit = () => {
//       const updatedQuestions = [...questions];
//       updatedQuestions[currentQuestion - 1] = {
//         ...updatedQuestions[currentQuestion - 1],
//         title: editedTitle,
//         description: editedDescription,
//       };

//       // send API call to supabase!
//       setQuestions(updatedQuestions);
//       setIsEditDialogOpen(false);
//     };

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
//               {questions[currentQuestion - 1].points} pts
//             </span>
//             <span
//               className={`px-2 py-1 rounded text-xs font-bold ${getDifficultyStyles(
//                 questions[currentQuestion - 1].difficulty
//               )}`}
//             >
//               {questions[currentQuestion - 1].difficulty}
//             </span>
//           </div>
//         </div>

//         <Card className="bg-black/40 border border-red-500/30">
//           <CardContent className="p-6">
//             <div className="flex flex-col gap-5 justify-between items-start">
//               <div>
//                 <h3 className="text-xl font-bold mb-2 text-white">
//                   {questions[currentQuestion - 1].title}
//                 </h3>
//                 <p className="text-gray-300">
//                   {questions[currentQuestion - 1].description}
//                 </p>
//               </div>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleEditClick}
//                 className="bg-transparent text-white border border-red-500 px-4 py-2 rounded-md font-bold transition hover:bg-red-500 hover:border-transparent"
//               >
//                 <Edit className="w-4 h-4 font-bold" /> Edit Question
//               </Button>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Edit Dialog */}
//         <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//           <DialogContent className="bg-black/90 border border-red-500/30 text-white">
//             <DialogHeader>
//               <DialogTitle className="text-red-300 w-full text-center">Edit Question</DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4 py-4">
//               <div className="space-y-2">
//                 <label
//                   htmlFor="title"
//                   className="text-sm font-medium text-gray-300"
//                 >
//                   Title
//                 </label>
//                 <Input
//                   id="title"
//                   value={editedTitle}
//                   onChange={(e) => setEditedTitle(e.target.value)}
//                   className="bg-black/60 border-red-500/30 text-white"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <label
//                   htmlFor="description"
//                   className="text-sm font-medium text-gray-300"
//                 >
//                   Description
//                 </label>
//                 <Textarea
//                   id="description"
//                   value={editedDescription}
//                   onChange={(e) => setEditedDescription(e.target.value)}
//                   rows={5}
//                   className="bg-black/60 border-red-500/30 text-white"
//                 />
//               </div>
//             </div>
//             <DialogFooter>
//               <Button
//                 variant="outline"
//                 onClick={() => setIsEditDialogOpen(false)}
//                 className="hover:border-red-500/50 bg-transparent hover:text-white text-white hover:bg-red-900/30"
//               >
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleSaveEdit}
//                 className="bg-red-500 hover:bg-red-600 text-white"
//               >
//                 Save Changes
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>
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
  Edit,
  Table as TableIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const QuestionsTab = React.memo(
  ({
    currentQuestion,
    questions,
    setQuestions,
    getDifficultyStyles,
    navigateQuestion,
  }) => {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAnswerDialogOpen, setIsAnswerDialogOpen] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedDescription, setEditedDescription] = useState("");
    const [editedAnswer, setEditedAnswer] = useState("");
    const [isTableView, setIsTableView] = useState(true);

    useEffect(() => {
      // Initialize answer if it exists
      if (questions[currentQuestion - 1]?.answer) {
        setEditedAnswer(questions[currentQuestion - 1].answer);
      } else {
        setEditedAnswer("");
      }

      // Determine if question has table format answer
      const currentQuestionData = questions[currentQuestion - 1];
      setIsTableView(
        currentQuestionData?.answerFormat === "table" ||
          (currentQuestionData?.answer &&
            isTableData(currentQuestionData.answer))
      );
    }, [currentQuestion, questions]);

    // Function to detect if answer appears to be table data
    const isTableData = (answerText) => {
      // Simple heuristic: contains multiple pipe characters or
      // has lines starting with | character
      const lines = answerText.split("\n");
      if (lines.length > 1) {
        const pipeCount = (answerText.match(/\|/g) || []).length;
        const linesWithPipes = lines.filter((line) =>
          line.trim().startsWith("|")
        ).length;
        return pipeCount > 3 || linesWithPipes > 1;
      }
      return false;
    };

    // Parse table data from markdown-style table
    const parseTableData = (tableText) => {
      if (!tableText) return { headers: [], rows: [] };

      const lines = tableText.split("\n").filter((line) => line.trim());
      if (lines.length < 2) return { headers: [], rows: [] };

      // Parse headers
      const headerLine = lines[0].trim();
      const headers = headerLine
        .split("|")
        .map((h) => h.trim())
        .filter((h) => h !== "");

      // Skip separator line
      const dataRows = [];
      for (let i = 2; i < lines.length; i++) {
        const row = lines[i]
          .trim()
          .split("|")
          .map((cell) => cell.trim())
          .filter((_, idx) => idx > 0 && idx <= headers.length);

        if (row.length > 0) {
          dataRows.push(row);
        }
      }

      return { headers, rows: dataRows };
    };

    const handleEditClick = () => {
      setEditedTitle(questions[currentQuestion - 1].title);
      setEditedDescription(questions[currentQuestion - 1].description);
      setIsEditDialogOpen(true);
    };

    const handleEditAnswerClick = () => {
      setEditedAnswer(questions[currentQuestion - 1].answer || "");
      setIsAnswerDialogOpen(true);
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

    const handleSaveAnswer = () => {
      const updatedQuestions = [...questions];
      updatedQuestions[currentQuestion - 1] = {
        ...updatedQuestions[currentQuestion - 1],
        answer: editedAnswer,
        answerFormat: isTableView ? "table" : "text",
      };

      // send API call to supabase!
      setQuestions(updatedQuestions);
      setIsAnswerDialogOpen(false);
    };

    const toggleAnswerFormat = () => {
      setIsTableView((prev) => !prev);
    };

    const renderTableAnswer = () => {
      const currentAnswer = questions[currentQuestion - 1].answer;
      if (!currentAnswer)
        return (
          <div className="text-gray-500 italic">No answer provided yet.</div>
        );

      const { headers, rows } = parseTableData(currentAnswer);

      if (headers.length === 0)
        return <div className="whitespace-pre-wrap">{currentAnswer}</div>;

      return (
        <div className="overflow-x-auto w-full">
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                {headers.map((header, idx) => (
                  <TableHead key={idx} className="text-white border-red-500/30">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, rowIdx) => (
                <TableRow key={rowIdx} className="border-red-500/20">
                  {row.map((cell, cellIdx) => (
                    <TableCell
                      key={cellIdx}
                      className="text-gray-300 border-red-500/20"
                    >
                      {cell}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      );
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

        {/* Question Card */}
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
            </div>
          </CardContent>
        </Card>

        {/* Answer Card */}
        <Card className="bg-black/40 border border-red-500/30 mt-4">
          <CardContent className="p-6">
            <div className="flex flex-col gap-5 justify-between items-start">
              <div className="w-full">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-xl font-bold text-white">Answer</h3>
                  {questions[currentQuestion - 1].answer && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleAnswerFormat}
                      className="bg-transparent text-white border border-red-500/50 rounded-md text-xs transition hover:bg-red-500/20"
                    >
                      <TableIcon className="w-3 h-3 mr-1" />
                      {isTableView ? "Show as Text" : "Show as Table"}
                    </Button>
                  )}
                </div>
                <div className="bg-black/60 p-4 rounded-md border border-red-500/20 text-gray-300 min-h-32 w-full">
                  {questions[currentQuestion - 1].answer ? (
                    isTableView ? (
                      renderTableAnswer()
                    ) : (
                      <div className="whitespace-pre-wrap">
                        {questions[currentQuestion - 1].answer}
                      </div>
                    )
                  ) : (
                    <div className="text-gray-500 italic">
                      No answer provided yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit Buttons Row */}
        <div className="flex space-x-4 justify-center mt-6">
          <Button
            variant="outline"
            onClick={handleEditClick}
            className="bg-transparent text-white border border-red-500 px-4 py-2 rounded-md font-bold transition hover:bg-red-500 hover:border-transparent"
          >
            <Edit className="w-4 h-4 mr-2" /> Edit Question
          </Button>
          <Button
            variant="outline"
            onClick={handleEditAnswerClick}
            className="bg-transparent text-white border border-red-500 px-4 py-2 rounded-md font-bold transition hover:bg-red-500 hover:border-transparent"
          >
            <Edit className="w-4 h-4 mr-2" /> Edit Answer
          </Button>
        </div>

        {/* Edit Question Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-black/90 border border-red-500/30 text-white">
            <DialogHeader>
              <DialogTitle className="text-red-300 w-full text-center">
                Edit Question
              </DialogTitle>
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

        {/* Edit Answer Dialog */}
        <Dialog open={isAnswerDialogOpen} onOpenChange={setIsAnswerDialogOpen}>
          <DialogContent className="bg-black/90 border border-red-500/30 text-white max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-red-300 w-full text-center">
                Edit Answer
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="answer"
                  className="text-sm font-medium text-gray-300"
                >
                  Answer
                </label>
                <div className="flex items-center">
                  <label className="text-xs text-gray-400 mr-2">
                    Format as table:
                  </label>
                  <input
                    type="checkbox"
                    checked={isTableView}
                    onChange={() => setIsTableView((prev) => !prev)}
                    className="accent-red-500"
                  />
                </div>
              </div>
              {isTableView && (
                <div className="text-xs text-gray-400 bg-red-900/10 p-2 rounded border border-red-500/20">
                  <p>For table format, use markdown table syntax:</p>
                  <pre className="mt-1 text-gray-300">
                    | Column1 | Column2 | Column3 |\n| ------- | ------- |
                    ------- |\n| Data1 | Data2 | Data3 |
                  </pre>
                </div>
              )}
              <Textarea
                id="answer"
                value={editedAnswer}
                onChange={(e) => setEditedAnswer(e.target.value)}
                rows={8}
                className="bg-black/60 border-red-500/30 text-white font-mono"
                placeholder={
                  isTableView
                    ? "| Column1 | Column2 | Column3 |\n| ------- | ------- | ------- |\n| Data1   | Data2   | Data3   |"
                    : "Enter the correct answer here..."
                }
              />
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAnswerDialogOpen(false)}
                className="hover:border-red-500/50 bg-transparent hover:text-white text-white hover:bg-red-900/30"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveAnswer}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                Save Answer
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TabsContent>
    );
  }
);

export default QuestionsTab;
