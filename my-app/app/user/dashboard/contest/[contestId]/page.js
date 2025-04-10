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
  const [currentAnswers, setCurrentAnswers] = useState({}); // Store current answers
  const [query, setQuery] = useState('');
  const [dbType, setDbType] = useState('postgres');
  const [ddl, setDdl] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

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
          console.log("questions: ", data)
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

  // Modify the handleSubmit function to accept questionId
  const handleSubmit = async (e, questionId) => {
    e.preventDefault(); // Prevent page reload
    
    if (!session) {
      alert("You must be logged in to submit answers.");
      return;
    }
  
    const { error } = await supabase.from("Submissions").insert([
      {
        submitted_at: new Date(),
        user_answer: currentAnswers[questionId], // Use the answer from the state
        status: "pending",
        user_id: session.user.id,
        contest_id: contestId,
        question_id: questionId,
      },
    ]);
  
    if (error) {
      console.error("Error submitting answers:", error.message);
      alert("Failed to submit answers. Please try again.");
    } else {
      alert("Answer submitted successfully!");
      // Clear just this answer
      setCurrentAnswers({...currentAnswers, [questionId]: ''});
    }
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
        <div>
          <h2 className="text-2xl font-bold text-white mb-4">Questions</h2>
          {questions.map((question, index) => (
            <div key={index} className="mb-4">
              <label className="text-white">{question.questionText}</label>
              <input
                type="text"
                value={currentAnswers[question.id] || ''}
                onChange={(e) => setCurrentAnswers({...currentAnswers, [question.id]: e.target.value})}
                className="w-full p-2 mt-2 rounded-lg bg-black/50 border border-red-500/30 text-white"
                required
              />
              <button 
                onClick={(e) => handleSubmit(e, question.id)} 
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg"
              >
                Submit Answer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}