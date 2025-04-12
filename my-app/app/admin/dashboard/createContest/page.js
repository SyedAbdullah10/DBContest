// "use client";
// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Calendar as CalendarIcon, X } from "lucide-react";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import Logo from "@/app/Components/Logo";
// import { Textarea } from "@/components/ui/textarea";
// import { motion } from "framer-motion";
// import SqlEditor from "@/app/Components/SQL_Compiler/SqlEditor";
// import axios from "axios";
// import { toast } from "react-toastify";
// import dayjs from "dayjs";
// import { ImSpinner2 } from "react-icons/im";

// const showContestCreatedToast = () => {
//   toast.success(`Contest Created successfully!`, {
//     position: "top-center",
//     autoClose: 5000,
//     hideProgressBar: false,
//     closeOnClick: true,
//     pauseOnHover: true,
//     draggable: false,
//   });
// };

// const showErrorToast = (error) => {
//   toast.error(`Error Occurred! ${error}`, {
//     position: "top-center",
//     autoClose: 5000,
//     hideProgressBar: false,
//     closeOnClick: true,
//     pauseOnHover: true,
//     draggable: false,
//   });
// };

// const CreateContest = () => {
//   const [startTime, setStartTime] = useState(dayjs());
//   const [endTime, setEndTime] = useState(dayjs());
//   const [sqlDialect, setSqlDialect] = useState("mysql");
//   const [contestPassword, setContestPassword] = useState("");
//   const [contestName, setContestName] = useState("");
//   const [questions, setQuestions] = useState([
//     { question: "", answer: "", points: 0 },
//   ]);
//   const [ddlContent, setDdlContent] = useState({
//     mysql: "",
//     postgresql: "",
//     oraclesql: "",
//   });
//   const [isCreating, setIsCreating] = useState(false);

//   const addQuestion = () => {
//     setQuestions([...questions, { question: "", answer: "", points: 0 }]);
//   };

//   const removeQuestion = (indexToRemove) => {
//     if (questions.length > 1) {
//       setQuestions(questions.filter((_, index) => index !== indexToRemove));
//     }
//   };

//   const updateQuestion = (index, field, value) => {
//     const newQuestions = [...questions];
//     newQuestions[index][field] = value;
//     setQuestions(newQuestions);
//   };

//   const handleDdlChange = (value) => {
//     setDdlContent({
//       ...ddlContent,
//       [sqlDialect]: value,
//     });
//   };

//   const handleCreateContest = async () => {
//     try {
//       const formatDateTime = (dateTimeValue) => {
//         if (!dateTimeValue) return null;

//         const date = new Date(dateTimeValue);
//         const month = date.toLocaleString("default", { month: "long" });
//         const day = date.getDate();
//         const year = date.getFullYear();
//         const time = date.toLocaleString("en-US", {
//           hour: "2-digit",
//           minute: "2-digit",
//           second: "2-digit",
//           hour12: true,
//         });

//         return `${month} ${day}, ${year} | ${time}`;
//       };

//       const contestData = {
//         contestName,
//         startTime: formatDateTime(startTime),
//         endTime: formatDateTime(endTime),
//         contestPassword,
//         ddlContent,
//         questions,
//       };

//       console.log("Submitting contest data:", contestData);

//       setIsCreating(true);
//       const response = await axios.post("/api/create-contest", contestData);

//       console.log("Contest created successfully:", response.data);

//       setContestName("");
//       setStartTime(dayjs());
//       setEndTime(dayjs());
//       setContestPassword("");
//       setDdlContent({
//         mysql: "",
//         postgresql: "",
//         oraclesql: "",
//       });
//       setQuestions([{ question: "", answer: "", points: 0 }]);

//       window.scrollTo({ top: 0, behavior: "smooth" });
//       showContestCreatedToast();
//       setIsCreating(false);
//     } catch (error) {
//       console.error("Error creating contest:", error);

//       window.scrollTo({ top: 0, behavior: "smooth" });
//       showErrorToast(error);
//       setIsCreating(false);

//       const errorMessage =
//         error.response?.data?.message || error.message || "An error occurred";
//       console.error("Error message:", errorMessage);
//     }
//   };

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="min-h-screen flex items-center justify-center w-full p-8"
//     >
//       <main className="w-[65%] bg-black/60 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl border-2 border-red-500/30 relative overflow-hidden">
//         {/* Enhanced Glow Effects */}
//         <div className="absolute -top-20 -right-20 w-72 h-72 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
//         <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-red-500/10 rounded-full blur-2xl"></div>

//         <header className="flex items-center mb-10 gap-4">
//           <Logo className="w-12 h-12 text-red-500" />
//           <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">
//             Create Contest
//           </h1>
//         </header>

//         <div className="space-y-8">
//           {/* Contest Info Section */}
//           <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-red-500/20">
//             <h2 className="text-xl font-semibold text-white mb-4 border-b border-red-500/20 pb-2">
//               Contest Information
//             </h2>

//             {/* Contest Name */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium mb-2 text-white/80">
//                 Contest Name
//               </label>
//               <Input
//                 type="text"
//                 value={contestName}
//                 onChange={(e) => setContestName(e.target.value)}
//                 className="bg-black/50 backdrop-blur-lg text-white border-2 focus:border-red-500/70 border-red-500/30 placeholder-gray-400 rounded-xl h-12"
//                 placeholder="Enter a unique contest name"
//               />
//             </div>

//             {/* Time Pickers */}
//             <LocalizationProvider dateAdapter={AdapterDayjs}>
//               <div className="flex flex-col md:flex-row gap-6 mb-6">
//                 {/* Start Time */}
//                 <div className="w-full md:w-1/2">
//                   <label className="block text-sm font-medium mb-2 text-white/80">
//                     Start Time
//                   </label>
//                   <DateTimePicker
//                     value={startTime}
//                     onChange={setStartTime}
//                     slotProps={{
//                       textField: {
//                         fullWidth: true,
//                         sx: {
//                           backgroundColor: "rgba(0, 0, 0, 0.5)",
//                           backdropFilter: "blur(10px)",
//                           color: "white",
//                           borderRadius: "12px",
//                           input: { color: "white" },
//                           "& .MuiOutlinedInput-root": {
//                             "& fieldset": {
//                               borderColor: "rgba(239, 68, 68, 0.3)",
//                               borderRadius: "12px",
//                             },
//                             "&.Mui-focused fieldset": {
//                               borderColor: "rgba(239, 68, 68, 0.5) !important",
//                             },
//                           },
//                         },
//                       },
//                       inputAdornment: {
//                         position: "end",
//                         sx: {
//                           "& .MuiSvgIcon-root": {
//                             color: "gray",
//                           },
//                         },
//                       },
//                     }}
//                   />
//                 </div>

//                 {/* End Time */}
//                 <div className="w-full md:w-1/2">
//                   <label className="block text-sm font-medium mb-2 text-white/80">
//                     End Time
//                   </label>
//                   <DateTimePicker
//                     value={endTime}
//                     onChange={setEndTime}
//                     slotProps={{
//                       textField: {
//                         fullWidth: true,
//                         sx: {
//                           backgroundColor: "rgba(0, 0, 0, 0.5)",
//                           backdropFilter: "blur(10px)",
//                           color: "white",
//                           borderRadius: "12px",
//                           input: { color: "white" },
//                           "& .MuiOutlinedInput-root": {
//                             "& fieldset": {
//                               borderColor: "rgba(239, 68, 68, 0.3)",
//                               borderRadius: "12px",
//                             },
//                             "&.Mui-focused fieldset": {
//                               borderColor: "rgba(239, 68, 68, 0.5) !important",
//                             },
//                           },
//                         },
//                       },
//                       inputAdornment: {
//                         position: "end",
//                         sx: {
//                           "& .MuiSvgIcon-root": {
//                             color: "gray",
//                           },
//                         },
//                       },
//                     }}
//                   />
//                 </div>
//               </div>
//             </LocalizationProvider>

//             {/* Contest Password */}
//             <div>
//               <label className="block text-sm font-medium mb-2 text-white/80">
//                 Contest Password
//               </label>
//               <Input
//                 type="password"
//                 value={contestPassword}
//                 onChange={(e) => setContestPassword(e.target.value)}
//                 className="bg-black/50 backdrop-blur-lg text-white border-2 focus:border-red-500/70 border-red-500/30 placeholder-gray-400 rounded-xl h-12"
//                 placeholder="Enter contest password"
//               />
//             </div>
//           </div>

//           {/* DDL Section */}
//           <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-red-500/20">
//             <h2 className="text-xl font-semibold text-white mb-4 border-b border-red-500/20 pb-2">
//               Database Schema
//             </h2>

//             {/* SQL Dialect Selector */}
//             <div className="mb-6">
//               <label className="block text-sm font-medium mb-2 text-white/80">
//                 SQL Dialect for DDL
//               </label>
//               <div className="grid grid-cols-3 gap-3">
//                 {["mysql", "postgresql", "oraclesql"].map((dialect) => (
//                   <Button
//                     key={dialect}
//                     type="button"
//                     onClick={() => setSqlDialect(dialect)}
//                     className={`py-2 capitalize transition-all duration-300 ${
//                       sqlDialect === dialect
//                         ? "bg-gradient-to-br from-red-600 to-red-800 border-2 border-red-400/50 shadow-lg shadow-red-500/20"
//                         : "bg-black/40 border-2 border-red-500/20 hover:bg-black/60 hover:border-red-500/30"
//                     }`}
//                   >
//                     {dialect === "oraclesql" ? "Oracle SQL" : dialect}
//                   </Button>
//                 ))}
//               </div>
//             </div>

//             {/* DDL Editor */}
//             <div>
//               <label className="block text-sm font-medium mb-2 text-white/80">
//                 Enter DDL for{" "}
//                 <span className="text-red-400 font-semibold">
//                   {sqlDialect === "oraclesql" ? "Oracle SQL" : sqlDialect}
//                 </span>
//               </label>
//               <div className="border-2 border-red-500/30 px-4 py-8 rounded-xl bg-black/50 backdrop-blur-lg flex items-center justify-center shadow-inner shadow-red-500/5">
//                 <SqlEditor
//                   query={ddlContent[sqlDialect]}
//                   setQuery={handleDdlChange}
//                   setSqlMode={setSqlDialect}
//                   sqlMode={"mysql"}
//                   showOptions={false}
//                 />
//               </div>
//             </div>

//             {/* DDL Completion Status */}
//             <div className="flex justify-between text-sm text-white/70 mt-4 p-3 bg-black/30 rounded-lg">
//               <div className="flex items-center space-x-2">
//                 <div
//                   className={`w-3 h-3 rounded-full ${
//                     ddlContent.mysql
//                       ? "bg-green-500 animate-pulse"
//                       : "bg-gray-500"
//                   }`}
//                 ></div>
//                 <span>MySQL</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div
//                   className={`w-3 h-3 rounded-full ${
//                     ddlContent.postgresql
//                       ? "bg-green-500 animate-pulse"
//                       : "bg-gray-500"
//                   }`}
//                 ></div>
//                 <span>PostgreSQL</span>
//               </div>
//               <div className="flex items-center space-x-2">
//                 <div
//                   className={`w-3 h-3 rounded-full ${
//                     ddlContent.oraclesql
//                       ? "bg-green-500 animate-pulse"
//                       : "bg-gray-500"
//                   }`}
//                 ></div>
//                 <span>Oracle SQL</span>
//               </div>
//             </div>
//           </div>

//           {/* Questions Section */}
//           <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-red-500/20">
//             <h2 className="text-xl font-semibold text-white mb-4 border-b border-red-500/20 pb-2">
//               Contest Questions
//             </h2>

//             <div className="space-y-6">
//               {questions?.map((q, index) => (
//                 <motion.div
//                   key={index}
//                   initial={{ opacity: 0, y: 20 }}
//                   animate={{ opacity: 1, y: 0 }}
//                   transition={{ duration: 0.5 }}
//                   className="p-5 bg-black/30 rounded-xl border border-red-500/20 relative"
//                 >
//                   <div className="absolute -top-3 -left-3 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg">
//                     {index + 1}
//                   </div>

//                   <div className="flex-grow space-y-4 mt-2">
//                     {/* Question */}
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-white/80">
//                         Question Text
//                       </label>
//                       <Textarea
//                         placeholder="Enter the SQL challenge question"
//                         value={q.question}
//                         onChange={(e) =>
//                           updateQuestion(index, "question", e.target.value)
//                         }
//                         className="bg-black/50 backdrop-blur-lg text-white border-2 border-red-500/30 focus:border-red-500/70 placeholder-gray-400 rounded-xl min-h-[100px]"
//                       />
//                     </div>

//                     {/* Answer */}
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-white/80">
//                         Expected Answer
//                       </label>
//                       <Textarea
//                         placeholder="Enter answer in comma separated CSV format"
//                         value={q.answer}
//                         onChange={(e) =>
//                           updateQuestion(index, "answer", e.target.value)
//                         }
//                         className="bg-black/50 backdrop-blur-lg text-white border-2 border-red-500/30 focus:border-red-500/70 placeholder-gray-400 rounded-xl min-h-[100px]"
//                       />
//                     </div>

//                     {/* Points */}
//                     <div>
//                       <label className="block text-sm font-medium mb-2 text-white/80">
//                         Point Value
//                       </label>
//                       <Input
//                         type="number"
//                         placeholder="Enter points for this question"
//                         value={q.points}
//                         onChange={(e) =>
//                           updateQuestion(index, "points", e.target.value)
//                         }
//                         className="bg-black/50 backdrop-blur-lg text-white border-2 border-red-500/30 focus:border-red-500/70 placeholder-gray-400 rounded-xl"
//                       />
//                     </div>
//                   </div>

//                   {questions.length > 1 && (
//                     <Button
//                       variant="destructive"
//                       size="icon"
//                       onClick={() => removeQuestion(index)}
//                       className="absolute -top-3 -right-3 bg-gradient-to-br from-red-600 to-red-800 shadow-xl hover:from-red-700 hover:to-red-900 transition-all border-2 border-red-400/50 text-white rounded-full p-2"
//                     >
//                       <X className="h-5 w-5" />
//                     </Button>
//                   )}
//                 </motion.div>
//               ))}

//               {/* Add Question Button */}
//               <Button
//                 onClick={addQuestion}
//                 className="w-full bg-gradient-to-br from-green-600 to-green-800 shadow-xl hover:from-green-700 hover:to-green-900 transition-all border-2 border-green-400/50 text-white py-3 rounded-xl flex items-center justify-center gap-2"
//               >
//                 <span className="text-xl font-bold">+</span> Add New Question
//               </Button>
//             </div>
//           </div>

//           {/* Create Contest Button */}
//           <Button
//             onClick={handleCreateContest}
//             disabled={isCreating}
//             className="w-full bg-gradient-to-br from-red-600 to-red-800 shadow-xl hover:from-red-700 hover:to-red-900 transition-all border-2 border-red-400/50 text-white py-6 rounded-xl text-lg font-bold"
//           >
//             {isCreating ? (
//               <div className="flex items-center justify-center gap-3">
//                 <ImSpinner2 className="text-xl animate-spin" />
//                 <span>Creating Contest...</span>
//               </div>
//             ) : (
//               <span>Create Contest</span>
//             )}
//           </Button>
//         </div>
//       </main>
//     </motion.div>
//   );
// };

// export default CreateContest;
"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Calendar as CalendarIcon, X } from "lucide-react";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import Logo from "@/app/Components/Logo";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import SqlEditor from "@/app/Components/SQL_Compiler/SqlEditor";
import axios from "axios";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import { ImSpinner2 } from "react-icons/im";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const showContestCreatedToast = () => {
  toast.success(`Contest Created successfully!`, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
  });
};

const showErrorToast = (error) => {
  toast.error(`Error Occurred! ${error}`, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
  });
};

const CreateContest = () => {
  const [startTime, setStartTime] = useState(dayjs());
  const [endTime, setEndTime] = useState(dayjs());
  const [sqlDialect, setSqlDialect] = useState("mysql");
  const [contestPassword, setContestPassword] = useState("");
  const [contestName, setContestName] = useState("");
  const [questions, setQuestions] = useState([
    { title: "", description: "", answer: "", points: 0, difficulty: "easy" },
  ]);
  const [ddlContent, setDdlContent] = useState({
    mysql: "",
    postgresql: "",
    oraclesql: "",
  });
  const [isCreating, setIsCreating] = useState(false);

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { title: "", description: "", answer: "", points: 0, difficulty: "easy" },
    ]);
  };

  const removeQuestion = (indexToRemove) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, index) => index !== indexToRemove));
    }
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleDdlChange = (value) => {
    setDdlContent({
      ...ddlContent,
      [sqlDialect]: value,
    });
  };

  const handleCreateContest = async () => {
    try {
      const formatDateTime = (dateTimeValue) => {
        if (!dateTimeValue) return null;

        const date = new Date(dateTimeValue);
        const month = date.toLocaleString("default", { month: "long" });
        const day = date.getDate();
        const year = date.getFullYear();
        const time = date.toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: true,
        });

        return `${month} ${day}, ${year} | ${time}`;
      };

      for (let i = 0; i < questions.length; i++) {
        questions[i]["number"] = "Q" + (i + 1).toString();
      }

      const contestData = {
        contestName,
        startTime: formatDateTime(startTime),
        endTime: formatDateTime(endTime),
        contestPassword,
        ddlContent,
        questions,
      };

      console.log("Submitting contest data:", contestData);

      setIsCreating(true);
      const response = await axios.post("/api/create-contest", contestData);

      console.log("Contest created successfully:", response.data);

      setContestName("");
      setStartTime(dayjs());
      setEndTime(dayjs());
      setContestPassword("");
      setDdlContent({
        mysql: "",
        postgresql: "",
        oraclesql: "",
      });
      setQuestions([
        {
          title: "",
          description: "",
          answer: "",
          points: 0,
          difficulty: "easy",
        },
      ]);

      window.scrollTo({ top: 0, behavior: "smooth" });
      showContestCreatedToast();
      setIsCreating(false);
    } catch (error) {
      console.error("Error creating contest:", error);

      window.scrollTo({ top: 0, behavior: "smooth" });
      showErrorToast(error);
      setIsCreating(false);

      const errorMessage =
        error.response?.data?.message || error.message || "An error occurred";
      console.error("Error message:", errorMessage);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center w-full p-8"
    >
      <main className="w-[70%] bg-black/60 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl border-2 border-red-500/30 relative overflow-hidden">
        {/* Enhanced Glow Effects */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-red-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/3 w-40 h-40 bg-red-500/10 rounded-full blur-2xl"></div>

        <header className="flex items-center mb-10">
          <Logo className="w-12 h-12 text-red-500" />
          <h1 className="text-4xl font-bold text-white bg-gradient-to-r from-white to-red-400 bg-clip-text text-transparent">
            Create Contest
          </h1>
        </header>

        <div className="space-y-8">
          {/* Contest Info Section */}
          <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-red-500/20">
            <h2 className="text-xl font-semibold text-white mb-4 border-b border-red-500/20 pb-2">
              Contest Information
            </h2>

            {/* Contest Name */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-white/80">
                Contest Name
              </label>
              <Input
                type="text"
                value={contestName}
                onChange={(e) => setContestName(e.target.value)}
                className="bg-black/50 backdrop-blur-lg text-white border-2 focus:border-red-500/70 border-red-500/30 placeholder-gray-400 rounded-xl h-12"
                placeholder="Enter a unique contest name"
              />
            </div>

            {/* Time Pickers */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <div className="flex flex-col md:flex-row gap-6 mb-6">
                {/* Start Time */}
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium mb-2 text-white/80">
                    Start Time
                  </label>
                  <DateTimePicker
                    value={startTime}
                    onChange={setStartTime}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: {
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          backdropFilter: "blur(10px)",
                          color: "white",
                          borderRadius: "12px",
                          input: { color: "white" },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "rgba(239, 68, 68, 0.3)",
                              borderRadius: "12px",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "rgba(239, 68, 68, 0.5) !important",
                            },
                          },
                        },
                      },
                      inputAdornment: {
                        position: "end",
                        sx: {
                          "& .MuiSvgIcon-root": {
                            color: "gray",
                          },
                        },
                      },
                    }}
                  />
                </div>

                {/* End Time */}
                <div className="w-full md:w-1/2">
                  <label className="block text-sm font-medium mb-2 text-white/80">
                    End Time
                  </label>
                  <DateTimePicker
                    value={endTime}
                    onChange={setEndTime}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        sx: {
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          backdropFilter: "blur(10px)",
                          color: "white",
                          borderRadius: "12px",
                          input: { color: "white" },
                          "& .MuiOutlinedInput-root": {
                            "& fieldset": {
                              borderColor: "rgba(239, 68, 68, 0.3)",
                              borderRadius: "12px",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "rgba(239, 68, 68, 0.5) !important",
                            },
                          },
                        },
                      },
                      inputAdornment: {
                        position: "end",
                        sx: {
                          "& .MuiSvgIcon-root": {
                            color: "gray",
                          },
                        },
                      },
                    }}
                  />
                </div>
              </div>
            </LocalizationProvider>

            {/* Contest Password */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">
                Contest Password
              </label>
              <Input
                type="password"
                value={contestPassword}
                onChange={(e) => setContestPassword(e.target.value)}
                className="bg-black/50 backdrop-blur-lg text-white border-2 focus:border-red-500/70 border-red-500/30 placeholder-gray-400 rounded-xl h-12"
                placeholder="Enter contest password"
              />
            </div>
          </div>

          {/* DDL Section */}
          <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-red-500/20">
            <h2 className="text-xl font-semibold text-white mb-4 border-b border-red-500/20 pb-2">
              Database Schema
            </h2>

            {/* SQL Dialect Selector */}
            <div className="mb-6">
              <label className="block text-sm font-medium mb-2 text-white/80">
                SQL Dialect for DDL
              </label>
              <div className="grid grid-cols-3 gap-3">
                {["mysql", "postgresql", "oraclesql"].map((dialect) => (
                  <Button
                    key={dialect}
                    type="button"
                    onClick={() => setSqlDialect(dialect)}
                    className={`py-2 capitalize transition-all duration-300 ${
                      sqlDialect === dialect
                        ? "bg-gradient-to-br from-red-600 to-red-800 border-2 border-red-400/50 shadow-lg shadow-red-500/20"
                        : "bg-black/40 border-2 border-red-500/20 hover:bg-black/60 hover:border-red-500/30"
                    }`}
                  >
                    {dialect === "oraclesql" ? "Oracle SQL" : dialect}
                  </Button>
                ))}
              </div>
            </div>

            {/* DDL Editor */}
            <div>
              <label className="block text-sm font-medium mb-2 text-white/80">
                Enter DDL for{" "}
                <span className="text-red-400 font-semibold">
                  {sqlDialect === "oraclesql" ? "Oracle SQL" : sqlDialect}
                </span>
              </label>
              <div className="border-2 border-red-500/30 px-4 py-8 rounded-xl bg-black/50 backdrop-blur-lg flex items-center justify-center shadow-inner shadow-red-500/5">
                <SqlEditor
                  query={ddlContent[sqlDialect]}
                  setQuery={handleDdlChange}
                  setSqlMode={setSqlDialect}
                  sqlMode={"mysql"}
                  showOptions={false}
                />
              </div>
            </div>

            {/* DDL Completion Status */}
            <div className="flex justify-between text-sm text-white/70 mt-4 p-3 bg-black/30 rounded-lg">
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    ddlContent.mysql
                      ? "bg-green-500 animate-pulse"
                      : "bg-gray-500"
                  }`}
                ></div>
                <span>MySQL</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    ddlContent.postgresql
                      ? "bg-green-500 animate-pulse"
                      : "bg-gray-500"
                  }`}
                ></div>
                <span>PostgreSQL</span>
              </div>
              <div className="flex items-center space-x-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    ddlContent.oraclesql
                      ? "bg-green-500 animate-pulse"
                      : "bg-gray-500"
                  }`}
                ></div>
                <span>Oracle SQL</span>
              </div>
            </div>
          </div>

          {/* Questions Section */}
          <div className="bg-black/40 backdrop-blur-md p-6 rounded-2xl border border-red-500/20">
            <h2 className="text-xl font-semibold text-white mb-4 border-b border-red-500/20 pb-2">
              Contest Questions
            </h2>

            <div className="space-y-6">
              {questions?.map((q, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="p-5 bg-black/30 rounded-xl border border-red-500/20 relative"
                >
                  <div className="absolute -top-3 -left-3 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg">
                    {index + 1}
                  </div>

                  <div className="flex-grow space-y-4 mt-2">
                    {/* Question Title */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white/80">
                        Question Title
                      </label>
                      <Input
                        type="text"
                        placeholder="Enter a brief, descriptive title"
                        value={q.title}
                        onChange={(e) =>
                          updateQuestion(index, "title", e.target.value)
                        }
                        className="bg-black/50 backdrop-blur-lg text-white border-2 border-red-500/30 focus:border-red-500/70 placeholder-gray-400 rounded-xl h-12"
                      />
                    </div>

                    {/* Difficulty Dropdown - New Field */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white/80">
                        Difficulty Level
                      </label>
                      <div className="relative">
                        {/* <select
                          value={q.difficulty}
                          onChange={(e) =>
                            updateQuestion(index, "difficulty", e.target.value)
                          }
                          className="bg-black/50 backdrop-blur-lg text-white border-2 border-red-500/30 focus:border-red-500/70 placeholder-gray-400 rounded-xl h-12 w-full appearance-none px-4 capitalize"
                        >
                          {difficultiesOptions.map((option) => (
                            <option
                              key={option}
                              value={option}
                              className="bg-black text-white capitalize"
                            >
                              {option}
                            </option>
                          ))}
                        </select> */}
                        <Select
                          onValueChange={(value) => {
                            updateQuestion(index, "difficulty", value);
                          }}
                        >
                          <SelectTrigger className="w-56 mb-3 bg-black/40 backdrop-blur-lg text-white border focus:border-red-500/50 border-red-500/20">
                            <SelectValue placeholder="Select Difficulty" />
                          </SelectTrigger>
                          <SelectContent className="bg-black/40 backdrop-blur-lg text-white border border-red-500/20">
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                          </SelectContent>
                        </Select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3">
                          <svg
                            className="h-5 w-5 text-red-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Question Description */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white/80">
                        Question Description
                      </label>
                      <Textarea
                        placeholder="Enter a detailed description of the context or problem setup"
                        value={q.description}
                        onChange={(e) =>
                          updateQuestion(index, "description", e.target.value)
                        }
                        className="bg-black/50 backdrop-blur-lg text-white border-2 border-red-500/30 focus:border-red-500/70 placeholder-gray-400 rounded-xl min-h-[100px]"
                      />
                    </div>

                    {/* Answer */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white/80">
                        Expected Answer
                      </label>
                      <Textarea
                        placeholder="Enter answer in comma separated CSV format"
                        value={q.answer}
                        onChange={(e) =>
                          updateQuestion(index, "answer", e.target.value)
                        }
                        className="bg-black/50 backdrop-blur-lg text-white border-2 border-red-500/30 focus:border-red-500/70 placeholder-gray-400 rounded-xl min-h-[100px]"
                      />
                    </div>

                    {/* Points */}
                    <div>
                      <label className="block text-sm font-medium mb-2 text-white/80">
                        Point Value
                      </label>
                      <Input
                        type="number"
                        placeholder="Enter points for this question"
                        value={q.points}
                        onChange={(e) =>
                          updateQuestion(index, "points", e.target.value)
                        }
                        className="bg-black/50 backdrop-blur-lg text-white border-2 border-red-500/30 focus:border-red-500/70 placeholder-gray-400 rounded-xl"
                      />
                    </div>
                  </div>

                  {questions.length > 1 && (
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => removeQuestion(index)}
                      className="absolute -top-3 -right-3 bg-gradient-to-br from-red-600 to-red-800 shadow-xl hover:from-red-700 hover:to-red-900 transition-all border-2 border-red-400/50 text-white rounded-full p-2"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  )}
                </motion.div>
              ))}

              {/* Add Question Button */}
              <Button
                onClick={addQuestion}
                className="w-full bg-gradient-to-br from-green-600 to-green-800 shadow-xl hover:from-green-700 hover:to-green-900 transition-all border-2 border-green-400/50 text-white py-3 rounded-xl flex items-center justify-center gap-2"
              >
                <span className="text-xl font-bold">+</span> Add New Question
              </Button>
            </div>
          </div>

          {/* Create Contest Button */}
          <Button
            onClick={handleCreateContest}
            disabled={isCreating}
            className="w-full bg-gradient-to-br from-red-600 to-red-800 shadow-xl hover:from-red-700 hover:to-red-900 transition-all border-2 border-red-400/50 text-white py-6 rounded-xl text-lg font-bold"
          >
            {isCreating ? (
              <div className="flex items-center justify-center gap-3">
                <ImSpinner2 className="text-xl animate-spin" />
                <span>Creating Contest...</span>
              </div>
            ) : (
              <span>Create Contest</span>
            )}
          </Button>
        </div>
      </main>
    </motion.div>
  );
};

export default CreateContest;
