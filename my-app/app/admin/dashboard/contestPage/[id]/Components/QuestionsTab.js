// "use client";

// import React, { useState, useEffect } from "react";
// import { TabsContent } from "@/components/ui/tabs";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent } from "@/components/ui/card";
// import {
//   Award,
//   ChevronLeft,
//   ChevronRight,
//   Edit,
//   Table as TableIcon,
//   Trash2,
// } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import axios from "axios";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   showDeletedToast,
//   showEditedToast,
// } from "@/app/Components/Dumped/utils/toast";

// const QuestionsTab = React.memo(
//   ({
//     currentQuestion,
//     questions,
//     setQuestions,
//     getDifficultyStyles,
//     navigateQuestion,
//     contestId,
//   }) => {
//     const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//     const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//     const [editedTitle, setEditedTitle] = useState("");
//     const [editedDescription, setEditedDescription] = useState("");
//     const [editedAnswer, setEditedAnswer] = useState("");
//     const [editedPoints, setEditedPoints] = useState(0);
//     const [editedDifficulty, setEditedDifficulty] = useState("");
//     const [isTableView, setIsTableView] = useState(true);
//     const [isSubmitting, setIsSubmitting] = useState(false);

//     useEffect(() => {
//       if (!questions || questions.length === 0 || currentQuestion < 1) return;

//       const currentQuestionData = questions[currentQuestion - 1];
//       if (!currentQuestionData) return;

//       // Initialize form fields with current question data
//       setEditedTitle(currentQuestionData.questionTitle || "");
//       setEditedDescription(currentQuestionData.questionDescription || "");
//       setEditedAnswer(currentQuestionData.Answer || "");
//       setEditedPoints(currentQuestionData.points || 0);
//       setEditedDifficulty(currentQuestionData.difficulty || "easy");

//       // Determine if question has table format Answer
//       setIsTableView(
//         currentQuestionData.AnswerFormat === "table" ||
//           (currentQuestionData.Answer &&
//             isTableData(currentQuestionData.Answer))
//       );
//     }, [currentQuestion, questions]);

//     // Function to detect if Answer appears to be table data
//     const isTableData = (answerText) => {
//       // console.log(answerText);

//       if (Array.isArray(answerText)) answerText = "[]";

//       // Check if the answer appears to be in CSV format
//       const lines = answerText?.split("\n");
//       if (lines.length > 1) {
//         // If multiple lines with commas, likely CSV data
//         const commaCount = (answerText?.match(/,/g) || []).length;
//         return commaCount > 0;
//       }
//       return false;
//     };

//     // Parse CSV-style data
//     const parseTableData = (tableText) => {
//       if (!tableText) return { headers: [], rows: [] };

//       const lines = tableText.split("\n").filter((line) => line.trim());
//       if (lines.length < 1) return { headers: [], rows: [] };

//       // For CSV format, first line contains headers
//       const headers = lines[0].split(",").map((h) => h.trim());

//       // Rest of the lines are data rows
//       const rows = [];
//       for (let i = 1; i < lines.length; i++) {
//         const rowData = lines[i].split(",").map((cell) => cell.trim());
//         if (rowData.length > 0) {
//           rows.push(rowData);
//         }
//       }

//       return { headers, rows };
//     };

//     const handleEditClick = () => {
//       const currentQuestionData = questions[currentQuestion - 1];
//       setEditedTitle(currentQuestionData.questionTitle);
//       setEditedDescription(currentQuestionData.questionDescription);
//       setEditedAnswer(currentQuestionData.Answer || "");
//       setEditedPoints(currentQuestionData.points);
//       setEditedDifficulty(currentQuestionData.difficulty);
//       setIsEditDialogOpen(true);
//     };

//     const handleDeleteClick = () => {
//       setIsDeleteDialogOpen(true);
//     };

//     const handleSaveEdit = async () => {
//       setIsSubmitting(true);

//       try {
//         const questionId = questions[currentQuestion - 1].id;

//         const updatedQuestion = {
//           questionTitle: editedTitle,
//           questionDescription: editedDescription,
//           Answer: editedAnswer == "" ? [] : editedAnswer,
//           points: parseInt(editedPoints),
//           difficulty: editedDifficulty,
//         };

//         // Make API call to update question
//         await axios.put(
//           `/api/contest-info/${contestId}/question/${questionId}`,
//           updatedQuestion
//         );

//         // Update local state
//         const updatedQuestions = [...questions];
//         updatedQuestions[currentQuestion - 1] = {
//           ...updatedQuestions[currentQuestion - 1],
//           ...updatedQuestion,
//         };

//         setQuestions(updatedQuestions);
//         setIsEditDialogOpen(false);
//         showEditedToast();
//       } catch (error) {
//         console.error("Error updating question:", error);
//         alert("Failed to update question. Please try again.");
//       } finally {
//         setIsSubmitting(false);
//       }
//     };

//     const handleConfirmDelete = async () => {
//       setIsSubmitting(true);

//       try {
//         const questionId = questions[currentQuestion - 1].id;

//         // Make API call to delete question
//         await axios.delete(
//           `/api/contest-info/${contestId}/question/${questionId}`
//         );

//         // Update local state
//         const updatedQuestions = questions.filter(
//           (_, index) => index !== currentQuestion - 1
//         );
//         setQuestions(updatedQuestions);
//         showDeletedToast();

//         // Navigate to previous question if current one is deleted
//         if (currentQuestion > 1 && updatedQuestions.length > 0) {
//           navigateQuestion("prev");
//         }

//         setIsDeleteDialogOpen(false);
//       } catch (error) {
//         console.error("Error deleting question:", error);
//         alert("Failed to delete question. Please try again.");
//       } finally {
//         setIsSubmitting(false);
//       }
//     };

//     const toggleAnswerFormat = () => {
//       setIsTableView((prev) => !prev);
//     };

//     const renderTableAnswer = () => {
//       const currentAnswer = questions[currentQuestion - 1]?.Answer;
//       if (!currentAnswer)
//         return (
//           <div className="text-gray-500 italic">No Answer provided yet.</div>
//         );

//       const { headers, rows } = parseTableData(currentAnswer);

//       if (headers.length === 0)
//         return <div className="whitespace-pre-wrap">{currentAnswer}</div>;

//       return (
//         <div className="overflow-x-auto w-full">
//           <Table className="w-full">
//             <TableHeader>
//               <TableRow className="hover:bg-inherit">
//                 {headers.map((header, idx) => (
//                   <TableHead key={idx} className="text-white border-red-500/30">
//                     {header}
//                   </TableHead>
//                 ))}
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {rows.map((row, rowIdx) => (
//                 <TableRow
//                   key={rowIdx}
//                   className="border-red-500/20 hover:bg-inherit"
//                 >
//                   {row.map((cell, cellIdx) => (
//                     <TableCell
//                       key={cellIdx}
//                       className="text-gray-300 border-red-500/20"
//                     >
//                       {cell}
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </div>
//       );
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
//               {questions[currentQuestion - 1]?.points} pts
//             </span>
//             <span
//               className={`px-2 py-1 rounded text-xs font-bold ${getDifficultyStyles(
//                 questions[currentQuestion - 1]?.difficulty
//               )}`}
//             >
//               {questions[currentQuestion - 1]?.difficulty
//                 ?.charAt(0)
//                 ?.toUpperCase() +
//                 questions[currentQuestion - 1]?.difficulty?.slice(1) || "None"}
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
//           </CardContent>
//         </Card>

//         {/* Answer Card */}
//         <Card className="bg-black/40 border border-red-500/30 mt-4">
//           <CardContent className="p-6">
//             <div className="flex flex-col gap-5 justify-between items-start">
//               <div className="w-full">
//                 <div className="flex justify-between items-center mb-4">
//                   <h3 className="text-xl font-bold text-white">Answer</h3>
//                   {questions[currentQuestion - 1]?.Answer && (
//                     <Button
//                       variant="outline"
//                       size="sm"
//                       onClick={toggleAnswerFormat}
//                       className="bg-transparent text-white border border-red-500 px-4 py-2 rounded-md font-bold transition hover:bg-red-500 hover:border-transparent text-xs"
//                     >
//                       <TableIcon className="w-3 h-3 mr-1" />
//                       {isTableView ? "Show as Text" : "Show as Table"}
//                     </Button>
//                   )}
//                 </div>
//                 <div className="bg-black/60 p-4 rounded-md border border-red-500/20 text-gray-300 min-h-32 w-full">
//                   {questions[currentQuestion - 1]?.Answer ? (
//                     isTableView ? (
//                       renderTableAnswer()
//                     ) : (
//                       <div className="whitespace-pre-wrap">
//                         {questions[currentQuestion - 1]?.Answer}
//                       </div>
//                     )
//                   ) : (
//                     <div className="text-gray-500 italic">
//                       No Answer provided yet.
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           </CardContent>
//         </Card>

//         {/* Edit/Delete Buttons Row */}
//         <div className="flex space-x-4 justify-center mt-6">
//           <Button
//             variant="outline"
//             onClick={handleEditClick}
//             className="bg-transparent text-white border border-red-500 px-4 py-2 rounded-md font-bold transition hover:bg-red-500 hover:border-transparent"
//           >
//             <Edit className="w-4 h-4 mr-2" /> Add Question
//           </Button>
//           <Button
//             variant="outline"
//             onClick={handleDeleteClick}
//             className="bg-transparent text-white border border-red-500 px-4 py-2 rounded-md font-bold transition hover:bg-red-500 hover:border-transparent"
//           >
//             <Trash2 className="w-4 h-4 mr-2" /> Edit Question
//           </Button>
//           <Button
//             variant="outline"
//             onClick={handleDeleteClick}
//             className="bg-transparent text-white border border-red-500 px-4 py-2 rounded-md font-bold transition hover:bg-red-500 hover:border-transparent"
//           >
//             <Trash2 className="w-4 h-4 mr-2" /> Delete Question
//           </Button>
//         </div>

//         {/* Combined Edit Question Dialog */}
//         <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//           <DialogContent className="bg-black/90 border border-red-500/30 text-white max-w-3xl">
//             <DialogHeader>
//               <DialogTitle className="text-red-300 w-full text-center">
//                 Edit Question
//               </DialogTitle>
//             </DialogHeader>
//             <div className="space-y-4 py-4">
//               {/* Question Title */}
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

//               {/* Question Description */}
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
//                   rows={4}
//                   className="bg-black/60 border-red-500/30 text-white"
//                 />
//               </div>

//               {/* Answer Section */}
//               <div className="space-y-2">
//                 <div className="flex justify-between items-center">
//                   <label
//                     htmlFor="answer"
//                     className="text-sm font-medium text-gray-300"
//                   >
//                     Answer
//                   </label>
//                 </div>

//                 <Textarea
//                   id="answer"
//                   value={editedAnswer}
//                   onChange={(e) => setEditedAnswer(e.target.value)}
//                   rows={6}
//                   className="bg-black/60 border-red-500/30 text-white font-mono"
//                   placeholder={
//                     isTableView
//                       ? "Column1,Column2,Column3\nData1,Data2,Data3\nData4,Data5,Data6"
//                       : "Enter the correct answer here..."
//                   }
//                 />
//               </div>

//               {/* Points and Difficulty Section */}
//               <div className="grid grid-cols-2 gap-4">
//                 <div className="space-y-2">
//                   <label
//                     htmlFor="points"
//                     className="text-sm font-medium text-gray-300"
//                   >
//                     Points
//                   </label>
//                   <Input
//                     id="points"
//                     type="number"
//                     value={editedPoints}
//                     onChange={(e) => setEditedPoints(e.target.value)}
//                     className="bg-black/60 border-red-500/30 text-white"
//                     min="0"
//                   />
//                 </div>

//                 <div className="space-y-2">
//                   <label
//                     htmlFor="difficulty"
//                     className="text-sm font-medium text-gray-300"
//                   >
//                     Difficulty
//                   </label>
//                   <Select
//                     value={editedDifficulty}
//                     onValueChange={setEditedDifficulty}
//                   >
//                     <SelectTrigger className="bg-black/60 border-red-500/30 text-white">
//                       <SelectValue placeholder="Select difficulty" />
//                     </SelectTrigger>
//                     <SelectContent className="bg-black/95 border-red-500/30 text-white">
//                       <SelectItem value="easy">Easy</SelectItem>
//                       <SelectItem value="medium">Medium</SelectItem>
//                       <SelectItem value="hard">Hard</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             </div>
//             <DialogFooter>
//               <Button
//                 variant="outline"
//                 onClick={() => setIsEditDialogOpen(false)}
//                 className="hover:border-red-500/50 bg-transparent hover:text-white text-white hover:bg-red-900/30"
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleSaveEdit}
//                 className="bg-red-500 hover:bg-red-600 text-white"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? "Saving..." : "Save Changes"}
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Delete Confirmation Dialog */}
//         <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
//           <DialogContent className="bg-gradient-to-b from-black/70 to-black/90 backdrop-blur-lg border border-red-400/30 text-white rounded-3xl shadow-2xl p-6 w-full max-w-md transition-all duration-300">
//             <DialogHeader className="text-center space-y-2">
//               <DialogTitle className="text-2xl font-bold text-red-400 tracking-wide drop-shadow-md">
//                 ⚠️ Confirm Deletion
//               </DialogTitle>
//               <DialogDescription className="text-gray-300 text-sm leading-relaxed">
//                 Are you absolutely sure you want to delete this question? <br />
//                 <span className="text-red-300 font-medium">
//                   This action is irreversible.
//                 </span>
//               </DialogDescription>
//             </DialogHeader>

//             <DialogFooter className="mt-6 flex justify-center gap-4">
//               <Button
//                 variant="ghost"
//                 onClick={() => setIsDeleteDialogOpen(false)}
//                 className="px-5 py-2 rounded-full border border-red-400/40 hover:bg-red-900/30 text-white hover:shadow-md transition-all duration-200"
//                 disabled={isSubmitting}
//               >
//                 Cancel
//               </Button>
//               <Button
//                 onClick={handleConfirmDelete}
//                 className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold hover:shadow-red-500/40 shadow transition-all duration-200"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? (
//                   <span className="flex items-center">
//                     <svg
//                       className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
//                       xmlns="http://www.w3.org/2000/svg"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                     >
//                       <circle
//                         className="opacity-25"
//                         cx="12"
//                         cy="12"
//                         r="10"
//                         stroke="currentColor"
//                         strokeWidth="4"
//                       ></circle>
//                       <path
//                         className="opacity-75"
//                         fill="currentColor"
//                         d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                       ></path>
//                     </svg>
//                     Deleting...
//                   </span>
//                 ) : (
//                   "Yes, Delete"
//                 )}
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
  Plus,
  Table as TableIcon,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
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
import axios from "axios";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  showDeletedToast,
  showEditedToast,
  showAddedToast,
} from "@/app/Components/Dumped/utils/toast";

const QuestionsTab = React.memo(
  ({
    currentQuestion,
    questions,
    setQuestions,
    getDifficultyStyles,
    navigateQuestion,
    contestId,
  }) => {
    const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedDescription, setEditedDescription] = useState("");
    const [editedAnswer, setEditedAnswer] = useState("");
    const [editedPoints, setEditedPoints] = useState(0);
    const [editedDifficulty, setEditedDifficulty] = useState("");
    const [isTableView, setIsTableView] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // New state for add question form
    const [newTitle, setNewTitle] = useState("");
    const [newDescription, setNewDescription] = useState("");
    const [newAnswer, setNewAnswer] = useState("");
    const [newPoints, setNewPoints] = useState(100);
    const [newDifficulty, setNewDifficulty] = useState("medium");

    useEffect(() => {
      if (!questions || questions.length === 0 || currentQuestion < 1) return;

      const currentQuestionData = questions[currentQuestion - 1];
      if (!currentQuestionData) return;

      // Initialize form fields with current question data
      setEditedTitle(currentQuestionData.questionTitle || "");
      setEditedDescription(currentQuestionData.questionDescription || "");
      setEditedAnswer(currentQuestionData.Answer || "");
      setEditedPoints(currentQuestionData.points || 0);
      setEditedDifficulty(currentQuestionData.difficulty || "easy");

      // Determine if question has table format Answer
      setIsTableView(
        currentQuestionData.AnswerFormat === "table" ||
          (currentQuestionData.Answer &&
            isTableData(currentQuestionData.Answer))
      );
    }, [currentQuestion, questions]);

    // Function to detect if Answer appears to be table data
    const isTableData = (answerText) => {
      // console.log(answerText);

      if (Array.isArray(answerText)) answerText = "[]";

      // Check if the answer appears to be in CSV format
      const lines = answerText?.split("\n");
      if (lines.length > 1) {
        // If multiple lines with commas, likely CSV data
        const commaCount = (answerText?.match(/,/g) || []).length;
        return commaCount > 0;
      }
      return false;
    };

    // Parse CSV-style data
    const parseTableData = (tableText) => {
      if (!tableText) return { headers: [], rows: [] };

      const lines = tableText.split("\n").filter((line) => line.trim());
      if (lines.length < 1) return { headers: [], rows: [] };

      // For CSV format, first line contains headers
      const headers = lines[0].split(",").map((h) => h.trim());

      // Rest of the lines are data rows
      const rows = [];
      for (let i = 1; i < lines.length; i++) {
        const rowData = lines[i].split(",").map((cell) => cell.trim());
        if (rowData.length > 0) {
          rows.push(rowData);
        }
      }

      return { headers, rows };
    };

    const handleEditClick = () => {
      const currentQuestionData = questions[currentQuestion - 1];
      setEditedTitle(currentQuestionData.questionTitle);
      setEditedDescription(currentQuestionData.questionDescription);
      setEditedAnswer(currentQuestionData.Answer || "");
      setEditedPoints(currentQuestionData.points);
      setEditedDifficulty(currentQuestionData.difficulty);
      setIsEditDialogOpen(true);
    };

    const handleAddClick = () => {
      // Reset new question form fields
      setNewTitle("");
      setNewDescription("");
      setNewAnswer("");
      setNewPoints(100);
      setNewDifficulty("medium");
      setIsAddDialogOpen(true);
    };

    const handleDeleteClick = () => {
      setIsDeleteDialogOpen(true);
    };

    const handleSaveEdit = async () => {
      setIsSubmitting(true);

      try {
        const questionId = questions[currentQuestion - 1].id;
        console.log("Questions: ", questions);
        console.log("Question_ID: ", questionId);
        
        const updatedQuestion = {
          questionTitle: editedTitle,
          questionDescription: editedDescription,
          Answer: editedAnswer == "" ? [] : editedAnswer,
          points: parseInt(editedPoints),
          difficulty: editedDifficulty,
        };

        // Make API call to update question
        await axios.put(
          `/api/contest-info/${contestId}/question/${questionId}`,
          updatedQuestion
        );

        // Update local state
        const updatedQuestions = [...questions];
        updatedQuestions[currentQuestion - 1] = {
          ...updatedQuestions[currentQuestion - 1],
          ...updatedQuestion,
        };

        setQuestions(updatedQuestions);
        setIsEditDialogOpen(false);
        showEditedToast();
      } catch (error) {
        console.error("Error updating question:", error);
        alert("Failed to update question. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleSaveNewQuestion = async () => {
      setIsSubmitting(true);

      try {
        let maxi = 0;
        for (let i = 0; i < questions.length; i++) {
          maxi = Math.max(
            parseInt(questions[i].questionNumber.substring(1), 10),
            maxi
          );
        }
        maxi++;
        console.log(maxi);

        const newQuestion = {
          questionTitle: newTitle,
          questionDescription: newDescription,
          Answer: newAnswer === "" ? [] : newAnswer,
          points: parseInt(newPoints),
          difficulty: newDifficulty,
          questionNumber: "Q" + maxi.toString(),
        };

        // Make API call to add question
        const response = await axios.post(
          `/api/contest-info/${contestId}/add-question`,
          newQuestion
        );

        // Update local state with the newly created question
        const createdQuestion = response.data;
        const updatedQuestions = [...questions, newQuestion];
        setQuestions(updatedQuestions);

        // Navigate to the newly added question
        navigateQuestion("last");

        setIsAddDialogOpen(false);
        showAddedToast();
      } catch (error) {
        console.error("Error adding question:", error);
        alert("Failed to add question. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    const handleConfirmDelete = async () => {
      setIsSubmitting(true);

      try {
        const questionId = questions[currentQuestion - 1].id;

        // Make API call to delete question
        await axios.delete(
          `/api/contest-info/${contestId}/question/${questionId}`
        );

        // Update local state
        const updatedQuestions = questions.filter(
          (_, index) => index !== currentQuestion - 1
        );
        setQuestions(updatedQuestions);
        showDeletedToast();

        // Navigate to previous question if current one is deleted
        if (currentQuestion > 1 && updatedQuestions.length > 0) {
          navigateQuestion("prev");
        }

        setIsDeleteDialogOpen(false);
      } catch (error) {
        console.error("Error deleting question:", error);
        alert("Failed to delete question. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    };

    const toggleAnswerFormat = () => {
      setIsTableView((prev) => !prev);
    };

    const renderTableAnswer = () => {
      const currentAnswer = questions[currentQuestion - 1]?.Answer;
      if (!currentAnswer)
        return (
          <div className="text-gray-500 italic">No Answer provided yet.</div>
        );

      const { headers, rows } = parseTableData(currentAnswer);

      if (headers.length === 0)
        return <div className="whitespace-pre-wrap">{currentAnswer}</div>;

      return (
        <div className="overflow-x-auto w-full">
          <Table className="w-full">
            <TableHeader>
              <TableRow className="hover:bg-inherit">
                {headers.map((header, idx) => (
                  <TableHead key={idx} className="text-white border-red-500/30">
                    {header}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row, rowIdx) => (
                <TableRow
                  key={rowIdx}
                  className="border-red-500/20 hover:bg-inherit"
                >
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
              {questions[currentQuestion - 1]?.points} pts
            </span>
            <span
              className={`px-2 py-1 rounded text-xs font-bold ${getDifficultyStyles(
                questions[currentQuestion - 1]?.difficulty
              )}`}
            >
              {questions[currentQuestion - 1]?.difficulty
                ?.charAt(0)
                ?.toUpperCase() +
                questions[currentQuestion - 1]?.difficulty?.slice(1) || "None"}
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
          </CardContent>
        </Card>

        {/* Answer Card */}
        <Card className="bg-black/40 border border-red-500/30 mt-4">
          <CardContent className="p-6">
            <div className="flex flex-col gap-5 justify-between items-start">
              <div className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-white">Answer</h3>
                  {questions[currentQuestion - 1]?.Answer && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={toggleAnswerFormat}
                      className="bg-transparent text-white border border-red-500 px-4 py-2 rounded-md font-bold transition hover:bg-red-500 hover:border-transparent text-xs"
                    >
                      <TableIcon className="w-3 h-3 mr-1" />
                      {isTableView ? "Show as Text" : "Show as Table"}
                    </Button>
                  )}
                </div>
                <div className="bg-black/60 p-4 rounded-md border border-red-500/20 text-gray-300 min-h-32 w-full">
                  {questions[currentQuestion - 1]?.Answer ? (
                    isTableView ? (
                      renderTableAnswer()
                    ) : (
                      <div className="whitespace-pre-wrap">
                        {questions[currentQuestion - 1]?.Answer}
                      </div>
                    )
                  ) : (
                    <div className="text-gray-500 italic">
                      No Answer provided yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Edit/Delete Buttons Row */}
        {/* <div className="flex space-x-4 justify-center mt-6">
          <Button
            variant="outline"
            onClick={handleAddClick}
            className="bg-transparent text-white border border-red-500 px-4 py-2 rounded-md font-bold transition hover:bg-red-500 hover:border-transparent"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Question
          </Button>
          <Button
            variant="outline"
            onClick={handleEditClick}
            className="bg-transparent text-white border border-red-500 px-4 py-2 rounded-md font-bold transition hover:bg-red-500 hover:border-transparent"
          >
            <Edit className="w-4 h-4 mr-2" /> Edit Question
          </Button>
          <Button
            variant="outline"
            onClick={handleDeleteClick}
            className="bg-transparent text-white border border-red-500 px-4 py-2 rounded-md font-bold transition hover:bg-red-500 hover:border-transparent"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete Question
          </Button>
        </div> */}

        <div className="flex space-x-4 justify-center mt-6">
          {/* Add (Green Gradient) */}
          <Button
            variant="outline"
            onClick={handleAddClick}
            className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-md font-semibold transition hover:from-green-500 hover:to-green-700 border-none"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Question
          </Button>

          {/* Edit (Blue Gradient) */}
          <Button
            variant="outline"
            onClick={handleEditClick}
            className="bg-gradient-to-r from-blue-400 to-blue-600 text-white px-4 py-2 rounded-md font-semibold transition hover:from-blue-500 hover:to-blue-700 border-none"
          >
            <Edit className="w-4 h-4 mr-2" /> Edit Question
          </Button>

          {/* Delete (Red Gradient - same style, just more gradientified) */}
          <Button
            variant="outline"
            onClick={handleDeleteClick}
            className="bg-gradient-to-r from-red-500 to-red-700 text-white px-4 py-2 rounded-md font-semibold transition hover:from-red-600 hover:to-red-800 border-none"
          >
            <Trash2 className="w-4 h-4 mr-2" /> Delete Question
          </Button>
        </div>

        {/* Add Question Dialog */}
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogContent className="bg-black/90 border border-red-500/30 text-white max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-red-300 w-full text-center">
                Add New Question
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Question Title */}
              <div className="space-y-2">
                <label
                  htmlFor="new-title"
                  className="text-sm font-medium text-gray-300"
                >
                  Title
                </label>
                <Input
                  id="new-title"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="bg-black/60 border-red-500/30 text-white"
                  placeholder="Enter question title"
                />
              </div>

              {/* Question Description */}
              <div className="space-y-2">
                <label
                  htmlFor="new-description"
                  className="text-sm font-medium text-gray-300"
                >
                  Description
                </label>
                <Textarea
                  id="new-description"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={4}
                  className="bg-black/60 border-red-500/30 text-white"
                  placeholder="Enter question description"
                />
              </div>

              {/* Answer Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="new-answer"
                    className="text-sm font-medium text-gray-300"
                  >
                    Answer
                  </label>
                </div>

                <Textarea
                  id="new-answer"
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  rows={6}
                  className="bg-black/60 border-red-500/30 text-white font-mono"
                  placeholder="For table format: Column1,Column2,Column3&#10;Data1,Data2,Data3&#10;Data4,Data5,Data6"
                />
              </div>

              {/* Points and Difficulty Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="new-points"
                    className="text-sm font-medium text-gray-300"
                  >
                    Points
                  </label>
                  <Input
                    id="new-points"
                    type="number"
                    value={newPoints}
                    onChange={(e) => setNewPoints(e.target.value)}
                    className="bg-black/60 border-red-500/30 text-white"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="new-difficulty"
                    className="text-sm font-medium text-gray-300"
                  >
                    Difficulty
                  </label>
                  <Select
                    value={newDifficulty}
                    onValueChange={setNewDifficulty}
                  >
                    <SelectTrigger className="bg-black/60 border-red-500/30 text-white">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/95 border-red-500/30 text-white">
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
                className="hover:border-red-500/50 bg-transparent hover:text-white text-white hover:bg-red-900/30"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveNewQuestion}
                className="bg-red-500 hover:bg-red-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Question"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Question Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent className="bg-black/90 border border-red-500/30 text-white max-w-3xl">
            <DialogHeader>
              <DialogTitle className="text-red-300 w-full text-center">
                Edit Question
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              {/* Question Title */}
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

              {/* Question Description */}
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
                  rows={4}
                  className="bg-black/60 border-red-500/30 text-white"
                />
              </div>

              {/* Answer Section */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="answer"
                    className="text-sm font-medium text-gray-300"
                  >
                    Answer
                  </label>
                </div>

                <Textarea
                  id="answer"
                  value={editedAnswer}
                  onChange={(e) => setEditedAnswer(e.target.value)}
                  rows={6}
                  className="bg-black/60 border-red-500/30 text-white font-mono"
                  placeholder={
                    isTableView
                      ? "Column1,Column2,Column3\nData1,Data2,Data3\nData4,Data5,Data6"
                      : "Enter the correct answer here..."
                  }
                />
              </div>

              {/* Points and Difficulty Section */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label
                    htmlFor="points"
                    className="text-sm font-medium text-gray-300"
                  >
                    Points
                  </label>
                  <Input
                    id="points"
                    type="number"
                    value={editedPoints}
                    onChange={(e) => setEditedPoints(e.target.value)}
                    className="bg-black/60 border-red-500/30 text-white"
                    min="0"
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="difficulty"
                    className="text-sm font-medium text-gray-300"
                  >
                    Difficulty
                  </label>
                  <Select
                    value={editedDifficulty}
                    onValueChange={setEditedDifficulty}
                  >
                    <SelectTrigger className="bg-black/60 border-red-500/30 text-white">
                      <SelectValue placeholder="Select difficulty" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/95 border-red-500/30 text-white">
                      <SelectItem value="easy">Easy</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="hard">Hard</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsEditDialogOpen(false)}
                className="hover:border-red-500/50 bg-transparent hover:text-white text-white hover:bg-red-900/30"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                className="bg-red-500 hover:bg-red-600 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <DialogContent className="bg-gradient-to-b from-black/70 to-black/90 backdrop-blur-lg border border-red-400/30 text-white rounded-3xl shadow-2xl p-6 w-full max-w-md transition-all duration-300">
            <DialogHeader className="text-center space-y-2">
              <DialogTitle className="text-2xl font-bold text-red-400 tracking-wide drop-shadow-md">
                ⚠️ Confirm Deletion
              </DialogTitle>
              <DialogDescription className="text-gray-300 text-sm leading-relaxed">
                Are you absolutely sure you want to delete this question? <br />
                <span className="text-red-300 font-medium">
                  This action is irreversible.
                </span>
              </DialogDescription>
            </DialogHeader>

            <DialogFooter className="mt-6 flex justify-center gap-4">
              <Button
                variant="ghost"
                onClick={() => setIsDeleteDialogOpen(false)}
                className="px-5 py-2 rounded-full border border-red-400/40 hover:bg-red-900/30 text-white hover:shadow-md transition-all duration-200"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold hover:shadow-red-500/40 shadow transition-all duration-200"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Deleting...
                  </span>
                ) : (
                  "Yes, Delete"
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </TabsContent>
    );
  }
);

export default QuestionsTab;
