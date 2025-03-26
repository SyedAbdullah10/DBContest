'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Ensure you're using the correct import
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import supabase from "@/supabaseClient";

export default function ContestPage() {
  const { contestId } = useParams(); // Get contest ID from the URL
  const { data: session, status } = useSession();
  const [contest, setContest] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [isFinished, setIsFinished] = useState(false);
  const [answers, setAnswers] = useState({}); // Store answers for ongoing contests

  console.log("id: ", contestId)

  useEffect(() => {
    const fetchContest = async () => {
      const { data, error } = await supabase
        .from('Contests')
        .select('*')
        .eq('id', contestId)
        .single();

        console.log("contest: ", data)

      if (data) {
        setContest(data);
        setIsFinished(data.status === 'finished');
      }
    };

    const fetchSubmissions = async () => {
      if (isFinished && session) {
        const { data, error } = await supabase
          .from('Submissions')
          .select('*')
          .eq('contest_id', contestId)
          .eq('user_id', session.user.id);

        if (data) {
          setSubmissions(data);
        }
      }
    };

    const fetchQuestions = async () => {
        const { data, error } = await supabase
          .from('Questions')
          .select('*')
          .eq('ContestId', contestId);
  
          console.log("contest: ", data)
  
        if (data) {
          setQuestions(data);
        }
      };

    if (contestId) {
      fetchContest();
      fetchSubmissions();
      fetchQuestions();
    }
  }, [contestId, isFinished, session]);

  if (status === "loading") return <div>Loading...</div>;
  if (!contest) return <div>Contest not found.</div>;

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    
    if (!session) {
      alert("You must be logged in to submit answers.");
      return;
    }
  
    // const { error } = await supabase.from("Submissions").insert([
    //   {
    //     contest_id: contestId,
    //     user_id: session.user.id,
    //     answers: answers, // Assuming answers is an object containing user responses
    //     submitted_at: new Date(),
    //   },
    // ]);
  
    // if (error) {
    //   console.error("Error submitting answers:", error.message);
    //   alert("Failed to submit answers. Please try again.");
    // } else {
    //   alert("Answers submitted successfully!");
    //   setAnswers({}); // Clear the answers state after submission
    // }
  };
  

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold text-white mb-4">{contest.title}</h1>
      <p className="text-white/70 mb-6">Status: {isFinished ? "Finished" : "Ongoing"}</p>

      {isFinished ? (
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Your Submissions</h2>
          {submissions.length > 0 ? (
            submissions.map((submission, index) => (
              <div key={index} className="bg-black/40 p-4 rounded-lg mb-4">
                <h3 className="text-white">Submission {index + 1}</h3>
                <pre className="text-white">{JSON.stringify(submission.answers, null, 2)}</pre>
              </div>
            ))
          ) : (
            <p className="text-white">No submissions found for this contest.</p>
          )}
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-white mb-4">Questions</h2>
          {questions.map((question, index) => (
            <div key={index} className="mb-4">
              <label className="text-white">{question.questionText}</label>
              <input
                type="text"
                onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
                className="w-full p-2 mt-2 rounded-lg bg-black/50 border border-red-500/30"
                required
              />
            </div>
          ))}
          <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg">
            Submit Answers
          </button>
        </form>
      )}
    </div>
  );
}

// 'use client';
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation"; // Ensure you're using the correct import
// import { useSession } from "next-auth/react";
// import { useParams } from "next/navigation";

// export default function ContestPage() { // Get the query object
//   const query = useParams();
//   const contestId = query.contestId;
//   console.log("query", contestId); // Get contest ID from the query
//   const { data: session, status } = useSession();
  
//   // Sample contest data
//   const sampleContests = {
//     1: {
//       title: "Spring Coding Challenge",
//       questions: [
//         { id: 1, text: "What is SQL?" },
//         { id: 2, text: "Explain JOIN in SQL." }
//       ],
//       status: "upcoming"
//     },
//     2: {
//       title: "AI Hackathon",
//       questions: [
//         { id: 1, text: "What is AI?" },
//         { id: 2, text: "Describe a neural network." }
//       ],
//       status: "upcoming"
//     },
//     3: {
//       title: "Winter Data Science Contest",
//       questions: [
//         { id: 1, text: "What is data normalization?" },
//         { id: 2, text: "Explain overfitting." }
//       ],
//       status: "finished"
//     },
//     4: {
//       title: "Cybersecurity CTF",
//       questions: [
//         { id: 1, text: "What is a firewall?" },
//         { id: 2, text: "Explain SQL injection." }
//       ],
//       status: "finished"
//     }
//   };

//   const [contest, setContest] = useState(null);
//   const [isFinished, setIsFinished] = useState(false);
//   const [answers, setAnswers] = useState({}); // Store answers for ongoing contests

//   useEffect(() => {
//     if (contestId) {
//       const selectedContest = sampleContests[contestId];
//       if (selectedContest) {
//         setContest(selectedContest);
//         setIsFinished(selectedContest.status === 'finished');
//       }
//     }
//   }, [contestId]);

//   if (status === "loading") return <div>Loading...</div>;
//   if (!contest) return <div>Contest not found.</div>;

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Handle submission logic here
//     alert("Submission successful!");
//   };

//   return (
//     <div className="container mx-auto px-4 py-8 max-w-6xl">
//       <h1 className="text-3xl font-bold text-white mb-4">{contest.title}</h1>
//       <p className="text-white/70 mb-6">Status: {isFinished ? "Finished" : "Ongoing"}</p>

//       {isFinished ? (
//         <div>
//           <h2 className="text-2xl font-bold text-white mb-4">Your Submissions</h2>
//           {/* Display submission details here */}
//           <p className="text-white">No submissions found for this contest.</p>
//         </div>
//       ) : (
//         <form onSubmit={handleSubmit}>
//           <h2 className="text-2xl font-bold text-white mb-4">Questions</h2>
//           {contest.questions.map((question, index) => (
//             <div key={index} className="mb-4">
//               <label className="text-white">{question.text}</label>
//               <input
//                 type="text"
//                 onChange={(e) => setAnswers({ ...answers, [question.id]: e.target.value })}
//                 className="w-full p-2 mt-2 rounded-lg bg-black/50 border border-red-500/30"
//                 required
//               />
//             </div>
//           ))}
//           <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-lg">
//             Submit Answers
//           </button>
//         </form>
//       )}
//     </div>
//   );
// }