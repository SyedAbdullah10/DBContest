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
// import SqlEditor from "@/app/Components/Dumped/SqlEditor";

// const CreateContest = () => {
//   const [startTime, setStartTime] = useState(null);
//   const [endTime, setEndTime] = useState(null);
//   const [database, setDatabase] = useState("mysql");
//   const [contestPassword, setContestPassword] = useState("");
//   const [questions, setQuestions] = useState([{ question: "", answer: "" }]);
//   const [DDL, setDDL] = useState("");

//   const addQuestion = () => {
//     setQuestions([...questions, { question: "", answer: "" }]);
//   };

//   const removeQuestion = (indexToRemove) => {
//     // Prevent removing the last question
//     if (questions.length > 1) {
//       setQuestions(questions.filter((_, index) => index !== indexToRemove));
//     }
//   };

//   const updateQuestion = (index, field, value) => {
//     const newQuestions = [...questions];
//     newQuestions[index][field] = value;
//     setQuestions(newQuestions);
//   };

//   const handleCreateContest = () => {
//     const contestData = {
//       startTime,
//       endTime,
//       database,
//       contestPassword,
//       questions,
//       DDL,
//     };
//     console.log(contestData);
//     // Add logic to submit contest data
//   };

//   return (
//     // <div className="min-h-screen flex items-center justify-center w-full p-8">
//     <motion.div
//       initial={{ opacity: 0, y: 20 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ duration: 0.5 }}
//       className="min-h-screen flex items-center justify-center w-full p-8"
//     >
//       <main className="w-[65%] bg-black/40 backdrop-blur-lg p-8 rounded-2xl shadow-xl border border-red-500/20">
//         <header className="flex items-center mb-8 transform translate-y-0 transition-transform duration-500">
//           {/* <Database className="text-red-800 mr-3 h-8 w-8" /> */}
//           <Logo />
//           <h1 className="text-4xl font-bold text-white">Create Contest</h1>{" "}
//         </header>
//         <div className="space-y-5">
//           {/* Time Pickers */}
//           <LocalizationProvider dateAdapter={AdapterDayjs}>
//             <div className="flex space-x-4">
//               {/* Start Time */}
//               <div className="w-1/2">
//                 <label className="block text-sm font-medium mb-2 text-white">
//                   Start Time
//                 </label>
//                 <DateTimePicker
//                   value={startTime}
//                   onChange={setStartTime}
//                   slotProps={{
//                     textField: {
//                       fullWidth: true,
//                       sx: {
//                         backgroundColor: "rgba(0, 0, 0, 0.4)",
//                         backdropFilter: "blur(8px)",
//                         color: "white",
//                         borderRadius: "10px",
//                         input: { color: "white" },
//                         "& .MuiOutlinedInput-root": {
//                           "& fieldset": {
//                             borderColor: "rgba(239, 68, 68, 0.2)",
//                             borderRadius: "10px",
//                           },
//                           "&.Mui-focused fieldset": {
//                             borderColor: "rgba(239, 68, 68, 0.2) !important",
//                           },
//                           "&.Mui-focused": {
//                             backgroundColor: "rgba(0, 0, 0, 0.4)",
//                           },
//                         },
//                       },
//                     },
//                     // Ensures the calendar icon is visible
//                     inputAdornment: {
//                       position: "end",
//                       sx: {
//                         "& .MuiSvgIcon-root": {
//                           color: "gray", // Sets the icon color to white
//                         },
//                       },
//                     },
//                   }}
//                 />
//               </div>

//               {/* End Time */}
//               <div className="w-1/2">
//                 <label className="block text-sm font-medium mb-2 text-white">
//                   End Time
//                 </label>
//                 <DateTimePicker
//                   value={endTime}
//                   onChange={setEndTime}
//                   slotProps={{
//                     textField: {
//                       fullWidth: true,
//                       sx: {
//                         backgroundColor: "rgba(0, 0, 0, 0.4)",
//                         backdropFilter: "blur(8px)",
//                         color: "white",
//                         borderRadius: "10px",
//                         input: { color: "white" },
//                         "& .MuiOutlinedInput-root": {
//                           "& fieldset": {
//                             borderColor: "rgba(239, 68, 68, 0.2)",
//                             borderRadius: "10px",
//                           },
//                           "&.Mui-focused fieldset": {
//                             borderColor: "rgba(239, 68, 68, 0.2) !important",
//                           },
//                           "&.Mui-focused": {
//                             backgroundColor: "rgba(0, 0, 0, 0.4)",
//                           },
//                         },
//                       },
//                     },
//                     inputAdornment: {
//                       position: "end",
//                       sx: {
//                         "& .MuiSvgIcon-root": {
//                           color: "gray", // Ensures visibility of the calendar icon
//                         },
//                       },
//                     },
//                   }}
//                 />
//               </div>
//             </div>
//           </LocalizationProvider>

//           {/* Contest Password */}
//           <div>
//             <label className="block text-sm font-medium mb-2 text-white">
//               Contest Password
//             </label>
//             <Input
//               type="password"
//               value={contestPassword}
//               onChange={(e) => setContestPassword(e.target.value)}
//               className="bg-black/40 backdrop-blur-lg text-white border focus:border-red-500/50 border-red-500/20 placeholder-gray-500"
//               placeholder="Enter contest password"
//             />
//           </div>

//           {/* DDL */}
//           <div>
//             <label className="block text-sm font-medium mb-2 text-white">
//               Enter DDL
//             </label>
//             <div className="border border-red-500/20 p-4 rounded-lg bg-black/40">
//               <SqlEditor
//                 query={DDL}
//                 setQuery={setDDL}
//                 setSqlMode={setDatabase}
//               />
//             </div>
//           </div>

//           {/* Questions */}
//           {questions.map((q, index) => (
//             <div key={index} className="flex items-center space-x-2">
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="flex-grow space-y-2"
//               >
//                 <Textarea
//                   placeholder="Enter Question"
//                   value={q.question}
//                   onChange={(e) =>
//                     updateQuestion(index, "question", e.target.value)
//                   }
//                   className="bg-black/40 backdrop-blur-lg text-white border border-red-500/20 focus:border-red-500/50 placeholder-gray-500"
//                 />
//                 <Textarea
//                   placeholder="Enter Answer"
//                   value={q.answer}
//                   onChange={(e) =>
//                     updateQuestion(index, "answer", e.target.value)
//                   }
//                   className="bg-black/40 backdrop-blur-lg text-white border border-red-500/20 focus:border-red-500/50 placeholder-gray-500"
//                 />
//               </motion.div>
//               {questions.length > 1 && (
//                 <Button
//                   variant="destructive"
//                   size="icon"
//                   onClick={() => removeQuestion(index)}
//                   className="bg-gradient-to-r from-red-600 to-red-700 shadow-lg hover:from-red-700 hover:to-red-800 transition-all border border-red-400/30 text-white rounded-full"
//                 >
//                   <X className="h-4 w-4" />
//                 </Button>
//               )}
//             </div>
//           ))}

//           {/* Add Question Button */}
//           <Button
//             onClick={addQuestion}
//             className="w-full bg-gradient-to-r from-red-600 to-red-700 shadow-lg hover:from-red-700 hover:to-red-800 transition-all border border-red-400/30 text-white"
//           >
//             Add Question
//           </Button>

//           {/* Create Contest Button */}
//           <Button
//             onClick={handleCreateContest}
//             className="w-full bg-gradient-to-r from-red-600 to-red-700 shadow-lg hover:from-red-700 hover:to-red-800 transition-all border border-red-400/30 text-white"
//           >
//             Create Contest
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

const CreateContest = () => {
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [database, setDatabase] = useState("mysql");
  const [contestPassword, setContestPassword] = useState("");
  const [contestName, setContestName] = useState("");
  const [questions, setQuestions] = useState([{ question: "", answer: "" }]);
  const [DDL, setDDL] = useState("");

  const addQuestion = () => {
    setQuestions([...questions, { question: "", answer: "" }]);
  };

  const removeQuestion = (indexToRemove) => {
    // Prevent removing the last question
    if (questions.length > 1) {
      setQuestions(questions.filter((_, index) => index !== indexToRemove));
    }
  };

  const updateQuestion = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleCreateContest = () => {
    const contestData = {
      startTime,
      endTime,
      database,
      contestName,
      contestPassword,
      questions,
      DDL,
    };
    console.log(contestData);
    // Add logic to submit contest data
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex items-center justify-center w-full p-8"
    >
      <main className="w-[65%] bg-black/60 backdrop-blur-2xl p-10 rounded-3xl shadow-2xl border-2 border-red-500/30 relative overflow-hidden">
        {/* Subtle Glow Effect */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-red-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-red-600/20 rounded-full blur-3xl"></div>

        <header className="flex items-center mb-10">
          <Logo className="w-12 h-12 text-red-500" />
          {/* <h1 className="text-5xl font-bold text-white tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-red-400"> */}
          <h1 className="text-4xl font-bold text-white ">Create Contest</h1>
        </header>

        <div className="space-y-6">
          {/* Time Pickers */}
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="flex space-x-6">
              {/* Start Time */}
              <div className="w-1/2">
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
              <div className="w-1/2">
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

          {/* Contest Name */}
          <div>
            <label className="block text-sm font-medium mb-2 text-white/80">
              Contest Name
            </label>
            <Input
              type="text"
              value={contestName}
              onChange={(e) => setContestName(e.target.value)}
              className="bg-black/50 backdrop-blur-lg text-white border-2 focus:border-red-500/70 border-red-500/30 placeholder-gray-400 rounded-xl"
              placeholder="Enter a unique contest name"
            />
          </div>

          {/* Contest Password */}
          <div>
            <label className="block text-sm font-medium mb-2 text-white/80">
              Contest Password
            </label>
            <Input
              type="password"
              value={contestPassword}
              onChange={(e) => setContestPassword(e.target.value)}
              className="bg-black/50 backdrop-blur-lg text-white border-2 focus:border-red-500/70 border-red-500/30 placeholder-gray-400 rounded-xl"
              placeholder="Enter contest password"
            />
          </div>

          {/* DDL */}
          <div>
            <label className="block text-sm font-medium mb-2 text-white/80">
              Enter DDL
            </label>
            <div className="border-2 border-red-500/30 p-4 rounded-xl bg-black/50 backdrop-blur-lg">
              <SqlEditor
                query={DDL}
                setQuery={setDDL}
                setSqlMode={setDatabase}
              />
            </div>
          </div>

          {/* Questions */}
          {questions.map((q, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex items-center space-x-4"
            >
              <div className="flex-grow space-y-4">
                <Textarea
                  placeholder="Enter Question"
                  value={q.question}
                  onChange={(e) =>
                    updateQuestion(index, "question", e.target.value)
                  }
                  className="bg-black/50 backdrop-blur-lg text-white border-2 border-red-500/30 focus:border-red-500/70 placeholder-gray-400 rounded-xl min-h-[100px]"
                />
                <Textarea
                  placeholder="Enter Answer"
                  value={q.answer}
                  onChange={(e) =>
                    updateQuestion(index, "answer", e.target.value)
                  }
                  className="bg-black/50 backdrop-blur-lg text-white border-2 border-red-500/30 focus:border-red-500/70 placeholder-gray-400 rounded-xl min-h-[100px]"
                />
              </div>
              {questions.length > 1 && (
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => removeQuestion(index)}
                  className="bg-gradient-to-br from-red-600 to-red-800 shadow-xl hover:from-red-700 hover:to-red-900 transition-all border-2 border-red-400/50 text-white rounded-full p-2 self-start"
                >
                  <X className="h-5 w-5" />
                </Button>
              )}
            </motion.div>
          ))}

          {/* Add Question Button */}
          <Button
            onClick={addQuestion}
            className="w-full bg-gradient-to-br from-red-600 to-red-800 shadow-xl hover:from-red-700 hover:to-red-900 transition-all border-2 border-red-400/50 text-white py-3 rounded-xl"
          >
            Add Question
          </Button>

          {/* Create Contest Button */}
          <Button
            onClick={handleCreateContest}
            className="w-full bg-gradient-to-br from-red-600 to-red-800 shadow-xl hover:from-red-700 hover:to-red-900 transition-all border-2 border-red-400/50 text-white py-3 rounded-xl"
          >
            Create Contest
          </Button>
        </div>
      </main>
    </motion.div>
  );
};

export default CreateContest;
