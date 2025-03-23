"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaUser, FaLock, FaSignInAlt } from "react-icons/fa";
import Image from "next/image";
import styles from "./styles.module.css";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";


// Add keyframes animation at the top of the file
const pulseRotateAnimation = `
@keyframes pulse-rotate {
  0% {
    transform: scale(1) rotate(0deg);
  }
  25% {
    transform: scale(1.05) rotate(2deg);
  }
  50% {
    transform: scale(1) rotate(0deg);
  }
  75% {
    transform: scale(1.05) rotate(-2deg);
  }
  100% {
    transform: scale(1) rotate(0deg);
  }
}
`;

const zoomAnimation = `
@keyframes zoom {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
`;

// Simplified loading animation
const loadingAnimation = `
@keyframes pulse-glow {
  0% {
    box-shadow: 0 0 5px 0 rgba(220, 38, 38, 0.5);
  }
  50% {
    box-shadow: 0 0 10px 2px rgba(220, 38, 38, 0.7);
  }
  100% {
    box-shadow: 0 0 5px 0 rgba(220, 38, 38, 0.5);
  }
}

@keyframes shine {
  0% {
    background-position: 0% 50%;
  }
  100% {
    background-position: 100% 50%;
  }
}
`;

const InputField = ({ Icon, type, placeholder, value, onChange }) => {
  return (
    <div className="w-full">
      <div className="flex items-center bg-black/40 backdrop-blur-lg shadow-lg rounded-full p-4 hover:bg-black/50 transition-all border border-red-500/30">
        <div className="bg-gradient-to-br from-red-500 to-red-800 rounded-full p-3 flex items-center justify-center shadow-md">
          <Icon className="text-white text-xl" />
        </div>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="flex-1 bg-transparent ml-4 p-2 text-white placeholder-white/60 text-lg outline-none"
        />
      </div>
    </div>
  );
};

const ButtonField = ({ Icon, btnText, type, onClick }) => {
  return (
    <div className="w-full">
      <button 
        className="flex items-center justify-center gap-3 w-full rounded-full p-4 bg-gradient-to-r from-red-600 to-red-700 text-white text-xl font-bold shadow-lg hover:from-red-700 hover:to-red-800 transition-all border border-red-400/30"
        type={type}
        onClick={onClick}
      >
        <Icon className="text-xl" />
        {btnText}
      </button>
    </div>
  );
};

const TypewriterText = ({ text, delay = 10, onComplete }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  // Use ref instead of state to track completion across hot reloads
  const completedRef = useRef(false);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + text[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, delay);

      return () => clearTimeout(timer);
    } else if (onComplete && !completedRef.current) {
      // Only call onComplete if it hasn't been called yet
      completedRef.current = true;
      onComplete();
    }
  }, [currentIndex, text, delay, onComplete]);

  // Reset completion state if text changes
  useEffect(() => {
    completedRef.current = false;
    setCurrentIndex(0);
    setDisplayedText("");
  }, [text]);

  return <span>{displayedText}</span>;
};

const UserLogin = () => {
  const [showProcessing, setShowProcessing] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [bufferPercent, setBufferPercent] = useState(0);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();

  // Use ref for processing state instead of useState for more reliable protection
  const isProcessingRef = useRef(false);

  // Store timer references for proper cleanup
  const timersRef = React.useRef({
    processingTimeout: null,
    resultsTimeout: null,
    progressInterval: null,
    progressTimeouts: [], // Add array to store multiple timeout references
  });

  // Clear all timers function
  const clearAllTimers = React.useCallback(() => {
    const timers = timersRef.current;
    if (timers.processingTimeout) clearTimeout(timers.processingTimeout);
    if (timers.resultsTimeout) clearTimeout(timers.resultsTimeout);
    if (timers.progressInterval) clearTimeout(timers.progressInterval);

    // Clear all progress timeouts
    if (timers.progressTimeouts && timers.progressTimeouts.length > 0) {
      timers.progressTimeouts.forEach((timeout) => clearTimeout(timeout));
      timers.progressTimeouts = []; // Reset the array
    }
  }, []);

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      clearAllTimers();
    };
  }, [clearAllTimers]);

  const handleQueryComplete = () => {
    // Guard clause to prevent multiple simultaneous invocations
    if (isProcessingRef.current) {
      // Silent ignore for better UX
      return;
    }

    // Set processing flag to prevent multiple calls
    isProcessingRef.current = true;

    // Clear any existing timers first
    clearAllTimers();

    setShowProcessing(true);
    // Start with a small percentage to show immediate feedback
    setBufferPercent(5);

    // Reset results state when starting processing
    setShowResults(false);

    // Increase animation time for a more deliberate loading experience
    const totalAnimationTime = 1500; // Increased from 600ms to 1500ms

    // Use direct setTimeout instead of interval for guaranteed progress
    let currentPercent = 5;
    const steps = 25; // Increase steps for smoother animation
    const stepTime = totalAnimationTime / steps;

    // Add variable speed loading - faster at start, slower in middle, faster at end
    const createStepPattern = () => {
      // Custom pattern with variable increments
      const increments = [];

      // First 20% loads quickly (5-25%)
      for (let i = 0; i < 5; i++) {
        increments.push(4); // 4% each step
      }

      // Middle part loads slower (25-75%)
      for (let i = 0; i < 12; i++) {
        increments.push(4.16); // About 4% each step, but slower timing
      }

      // Final part loads faster (75-100%)
      for (let i = 0; i < 8; i++) {
        increments.push(3.125); // About 3% each step, but quicker timing
      }

      return increments;
    };

    const stepIncrements = createStepPattern();

    // Create individual timeouts for each step with non-linear timing
    for (let i = 0; i < steps; i++) {
      // Non-linear timing - middle steps take longer
      let adjustedStepTime;

      if (i < 5) {
        // First 5 steps are quick
        adjustedStepTime = stepTime * 0.7;
      } else if (i >= steps - 8) {
        // Last 8 steps are quick
        adjustedStepTime = stepTime * 0.7;
      } else {
        // Middle steps are slower
        adjustedStepTime = stepTime * 1.3;
      }

      const timeout = setTimeout(() => {
        // Accumulate the percentage based on our custom increments
        currentPercent += stepIncrements[i];
        // Clamp between 5-99% during the animation
        currentPercent = Math.min(99, Math.max(5, currentPercent));
        setBufferPercent(Math.floor(currentPercent));
      }, adjustedStepTime * (i + 1));

      // Store timeout references for cleanup
      timersRef.current.progressTimeouts.push(timeout);

      // Store last timeout reference for cleanup
      if (i === steps - 1) {
        timersRef.current.progressInterval = timeout;
      }
    }

    // Wait for processing animation
    const processingTimeout = setTimeout(() => {
      // Make sure final value is 100%
      setBufferPercent(100);

      // Longer delay before hiding loading and showing results
      setTimeout(() => {
        setShowProcessing(false);
        // Show results immediately after hiding processing
        setShowResults(true);
        // Reset processing flag when completely done
        isProcessingRef.current = false;
      }, 250); // Increased from 100ms to 250ms
    }, totalAnimationTime + 100); // Add slightly more buffer

    timersRef.current.processingTimeout = processingTimeout;
  };

  // Move handleSubmit inside the component
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const result = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
        role: 'user' // Add this to route to user login
      });
  
      if (result?.error) {
        setError(result.error);
      } else {
        // Check role before redirecting
        const session = await getSession();
        if (session?.user?.role === 'user') {
          router.push("/user/dashboard");
        } else {
          setError("Unauthorized access");
          router.push("/user");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("An error occurred during login");
    }
  };

  return (
    <main className="flex flex-col justify-center items-center h-screen w-full bg-black bg-[radial-gradient(circle_at_center,rgba(220,38,38,0.3),rgba(0,0,0,0.9))]">
      <style jsx global>
        {pulseRotateAnimation}
      </style>
      <style jsx global>
        {zoomAnimation}
      </style>
      <style jsx global>
        {loadingAnimation}
      </style>
      {/* Background pattern overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1IiBoZWlnaHQ9IjUiPgo8cmVjdCB3aWR0aD0iNSIgaGVpZ2h0PSI1IiBmaWxsPSIjMDAwIj48L3JlY3Q+CjxwYXRoIGQ9Ik0wIDVMNSAwWk02IDRMNCA2Wk0tMSAxTDEgLTFaIiBzdHJva2U9IiMyMjIiIG9wYWNpdHk9IjAuMiI+PC9wYXRoPgo8L3N2Zz4=')] opacity-20"></div>

      {/* Main Container */}
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="bg-black/40 backdrop-blur-xl p-8 rounded-3xl border border-red-500/30 shadow-2xl w-full">
          {/* Editor Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <div className="w-3 h-3 rounded-full bg-red-400"></div>
              <div className="w-3 h-3 rounded-full bg-red-300"></div>
            </div>
            <div className="text-sm text-red-400/70 font-mono">
              SQL SAGA v1.0
            </div>
          </div>

          <div className="flex gap-12">
            {/* Contest Info */}
            <div className="flex-1">
              <div className="relative h-full">
                {/* SQL Demo Section */}
                <div className="bg-black/40 rounded-xl border border-red-500/20 p-6">
                  {/* Query Editor */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      <span className="text-red-400 text-sm font-mono">
                        SQL Query
                      </span>
                    </div>
                    <div className="bg-black/60 rounded-lg p-4 font-mono text-sm">
                      <div className="text-white/90">
                        <TypewriterText
                          text="SELECT * FROM DevDay_contests WHERE contest_name = 'SQL Saga'"
                          delay={50}
                          onComplete={handleQueryComplete}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Processing State - Simplified Animation */}
                  {showProcessing && (
                    <div className="mb-4 animate-fade-in">
                      <div
                        className="relative bg-black/80 rounded-lg p-5 overflow-hidden border border-red-500/30"
                        style={{
                          animation: "pulse-glow 2.5s infinite ease-in-out",
                        }}
                      >
                        {/* Text indicator */}
                        <div className="relative text-center mb-3">
                          <span className="text-red-400 font-mono text-sm inline-block px-3 py-1 bg-black/50 rounded-md border border-red-500/20">
                            EXECUTING QUERY...
                          </span>
                        </div>

                        {/* Data flow animation - Primary */}
                        <div className="relative h-5 bg-black/50 rounded-full overflow-hidden mb-2 border border-red-500/20">
                          <div
                            style={{
                              height: "100%",
                              width: `${bufferPercent}%`,
                              backgroundImage:
                                "linear-gradient(to right, #b91c1c, #ef4444, #b91c1c)",
                              backgroundSize: "200% 100%",
                              animation: "shine 3s linear infinite",
                              transition: "width 0.15s ease-out",
                            }}
                          ></div>
                          <div className="absolute inset-0 flex items-center justify-center text-white/90 text-xs font-mono">
                            <span className="drop-shadow-[0_0_3px_rgba(0,0,0,0.9)]">
                              {bufferPercent}% COMPLETE
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Results */}
                  {showResults && (
                    <div className="animate-fade-in">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-green-400 text-sm font-mono">
                          Results
                        </span>
                      </div>
                      <div className="bg-black/60 rounded-lg p-4">
                        <div className="font-mono text-sm">
                          <div className="text-white/90 mb-2">
                            <span className="text-green-400">
                              Contest Details
                            </span>
                          </div>
                          <div className="text-white/70 text-sm space-y-2">
                            <div className="grid grid-cols-2 gap-4">
                              <span className="text-green-300">
                                Contest Name:
                              </span>
                              <span>SQL Saga</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <span className="text-green-300">
                                Start Date:
                              </span>
                              <span>2024-03-15</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <span className="text-green-300">Duration:</span>
                              <span>48 hours</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <span className="text-green-300">
                                Participants:
                              </span>
                              <span>1000+</span>
                            </div>
                            <div className="mt-4 text-white/80">
                              <span className="text-green-300">
                                Description:
                              </span>
                              <p className="mt-1 text-sm">
                                A competitive SQL programming contest where
                                participants solve complex database challenges.
                                Test your SQL expertise, problem-solving skills,
                                and optimization techniques in this exciting
                                database showdown.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Login Section */}
            <div className="flex-1 border-l border-red-500/20 pl-12">
              <div className="w-full flex items-center gap-4 mb-6">
                <Image
                  className={`h-16 w-auto ${styles.logo}`}
                  src="/assets/logo-bgremove.png"
                  alt="SQL SAGA Logo"
                  width={64}
                  height={64}
                  priority
                  style={{
                    background: "transparent",
                  }}
                />
                <h1 className="text-white text-4xl font-bold tracking-wide">
                  USER LOGIN
                </h1>
              </div>
  

              <form onSubmit={handleSubmit} className="w-full space-y-6">
                <InputField 
                  Icon={FaUser} 
                  type="text" 
                  placeholder="Username" 
                  value={identifier} 
                  onChange={(e) => setIdentifier(e.target.value)} 
                />
                <InputField
                  Icon={FaLock}
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <ButtonField 
                  Icon={FaSignInAlt} 
                  btnText="LOGIN" 
                  type="submit"
                />
                {error && (
                  <div className="text-red-500 text-sm mt-2 text-center">
                    {error}
                  </div>
                )}
              </form>

              <a
                href="#"
                className="text-white/70 mt-8 text-lg hover:text-red-400 transition-colors block"
              >
                Forgot password?
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Version indicator */}
      <div className="absolute bottom-4 right-4 text-white/40 text-sm">
        User Portal v2.0
      </div>
    </main>
  );
};

export default UserLogin;
