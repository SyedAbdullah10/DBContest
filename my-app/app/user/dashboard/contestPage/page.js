"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Clock, FileQuestion, Activity, Database, Eye } from "lucide-react";
import Logo from "@/app/Components/Logo";
import QuestionsTab from "./Components/QuestionsTab";
import StatusTab from "./Components/StatusTab";
import DDLTab from "./Components/DDLTab";
import VisualSchemaTab from "./Components/VisualSchemaTab";

const ContestPage = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 1,
    minutes: 30,
    seconds: 0,
  });
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [sqlQuery, setSqlQuery] = useState("");
  const [sqlMode, setSqlMode] = useState("mysql");
  const [submitted, setSubmitted] = useState(false);

  // Mock questions for the contest
  const questions = [
    {
      id: 1,
      title: "Find all users who made a purchase in the last 30 days",
      description:
        "Write a SQL query to retrieve all users who made at least one purchase in the last 30 days. Include their user ID, name, email, and total purchase amount.",
      difficulty: "Easy",
      points: 10,
    },
    {
      id: 2,
      title: "Calculate average order value by category",
      description:
        "Write a SQL query to calculate the average order value grouped by product category. Sort the results by average order value in descending order.",
      difficulty: "Medium",
      points: 20,
    },
    {
      id: 3,
      title: "Find products with inventory anomalies",
      description:
        "Write a SQL query to identify products where the current inventory count doesn't match the calculated inventory based on purchase and sales records.",
      difficulty: "Hard",
      points: 30,
    },
  ];

  // Mock schema
  const schema = [
    {
      table: "users",
      columns: ["user_id", "username", "email", "created_at", "last_login"],
    },
    {
      table: "products",
      columns: [
        "product_id",
        "name",
        "description",
        "category",
        "price",
        "inventory",
      ],
    },
    {
      table: "orders",
      columns: ["order_id", "user_id", "total_amount", "status", "created_at"],
    },
    {
      table: "order_items",
      columns: ["id", "order_id", "product_id", "quantity", "price"],
    },
  ];

  // Timer countdown effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.hours === 0 && prev.minutes === 0 && prev.seconds === 0) {
          clearInterval(timer);
          return prev;
        }

        let newHours = prev.hours;
        let newMinutes = prev.minutes;
        let newSeconds = prev.seconds - 1;

        if (newSeconds < 0) {
          newSeconds = 59;
          newMinutes -= 1;
        }

        if (newMinutes < 0) {
          newMinutes = 59;
          newHours -= 1;
        }

        return { hours: newHours, minutes: newMinutes, seconds: newSeconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format time with leading zeros
  const formatTime = (val) => val.toString().padStart(2, "0");

  const handleSubmit = () => {
    setSubmitted(true);
    // Here you would normally send the query to your backend for validation
    setTimeout(() => {
      setSubmitted(false);
      // Move to next question
      if (currentQuestion < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
      }
    }, 2000);
  };

  const handleRun = () => {
    // Logic for running the query without submitting
    console.log("Running query:", sqlQuery);
  };

  const navigateQuestion = (direction) => {
    if (direction === "next" && currentQuestion < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else if (direction === "prev" && currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Get difficulty styling
  const getDifficultyStyles = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-500/30 text-green-200";
      case "Medium":
        return "bg-yellow-500/30 text-yellow-200";
      case "Hard":
        return "bg-red-500/30 text-red-200";
      default:
        return "bg-gray-500/30 text-gray-200";
    }
  };

  return (
    <div className="min-h-screen text-white">
      {/* Header with logo and contest info */}
      <header className="bg-red-900/30 border-b border-red-500/30 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 flex items-center justify-center">
              {/* <Database className="w-8 h-8" /> */}
              <Logo extraClasses="h-12 w-12" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">SQL Masters Challenge</h1>
              <p className="text-red-300">Database Contest - Advanced Level</p>
            </div>
          </div>

          <div className="flex flex-col items-end">
            <div className="flex items-center space-x-2 text-red-200">
              <Clock className="w-5 h-5" />
              <span className="text-xl font-mono">
                {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:
                {formatTime(timeLeft.seconds)}
              </span>
            </div>
            <div className="text-sm text-red-300">Time remaining</div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4">
        <Tabs defaultValue="questions" className="w-full">
          <TabsList className="text-white bg-red-500/20 border border-red-500/30 p-1 mb-6">
            <TabsTrigger
              value="questions"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
            >
              <FileQuestion className="w-4 h-4 mr-2" />
              Questions
            </TabsTrigger>
            <TabsTrigger
              value="status"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
            >
              <Activity className="w-4 h-4 mr-2" />
              Status
            </TabsTrigger>
            <TabsTrigger
              value="ddl"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
            >
              <Database className="w-4 h-4 mr-2" />
              DDL Statements
            </TabsTrigger>
            <TabsTrigger
              value="schema"
              className="data-[state=active]:bg-red-500 data-[state=active]:text-white"
            >
              <Eye className="w-4 h-4 mr-2" />
              Visualize Schema
            </TabsTrigger>
          </TabsList>

          <QuestionsTab
            currentQuestion={currentQuestion}
            questions={questions}
            sqlQuery={sqlQuery}
            setSqlQuery={setSqlQuery}
            sqlMode={sqlMode}
            setSqlMode={setSqlMode}
            handleRun={handleRun}
            handleSubmit={handleSubmit}
            submitted={submitted}
            getDifficultyStyles={getDifficultyStyles}
            navigateQuestion={navigateQuestion}
          />

          <StatusTab
            questions={questions}
            getDifficultyStyles={getDifficultyStyles}
            currentQuestion={currentQuestion}
          />

          <DDLTab
            ddl={`CREATE TABLE users (
  user_id INT PRIMARY KEY,
  username VARCHAR(50) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP
);

CREATE TABLE products (
  product_id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  category VARCHAR(50),
  price DECIMAL(10, 2) NOT NULL,
  inventory INT NOT NULL DEFAULT 0
);

CREATE TABLE orders (
  order_id INT PRIMARY KEY,
  user_id INT NOT NULL,
  total_amount DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(user_id)
);

CREATE TABLE order_items (
  id INT PRIMARY KEY,
  order_id INT NOT NULL,
  product_id INT NOT NULL,
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (order_id) REFERENCES orders(order_id),
  FOREIGN KEY (product_id) REFERENCES products(product_id)
);`}
          />

          <VisualSchemaTab schema={schema} />
        </Tabs>
      </main>
    </div>
  );
};

export default ContestPage;
