"use client";

import React, { useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

const SubmissionTrackingPage = () => {
  // Sample data - replace with your actual data
  const submissions = [
    {
      id: 1,
      username: "khanahsanali",
      prob: "A",
      result: "Accepted",
      submitTime: "3 hr ago",
      lang: "SQL",
    },
    {
      id: 2,
      username: "khanahsanali",
      prob: "A",
      result: "Compilation Error",
      submitTime: "3 hr ago",
      lang: "PostgreSql",
    },
    {
      id: 3,
      username: "Huzaifa_Bari",
      prob: "D",
      result: "Wrong Answer",
      submitTime: "39 hr ago",
      lang: "PostgreSql",
    },
    {
      id: 4,
      username: "Huzaifa_Bari",
      prob: "D",
      result: "Wrong Answer",
      submitTime: "39 hr ago",
      lang: "PostgreSql",
    },
    {
      id: 5,
      username: "Huzaifa_Bari",
      prob: "D",
      result: "Wrong Answer",
      submitTime: "39 hr ago",
      lang: "PostgreSql",
    },
    {
      id: 6,
      username: "legacyyyyyy",
      prob: "C",
      result: "Accepted",
      submitTime: "39 hr ago",
      lang: "PostgreSql",
    },
    {
      id: 7,
      username: "Huzaifa_Bari",
      prob: "D",
      result: "Wrong Answer",
      submitTime: "39 hr ago",
      lang: "PostgreSql",
    },
    {
      id: 8,
      username: "Mureed_Hussain",
      prob: "B",
      result: "Wrong Answer",
      submitTime: "39 hr ago",
      lang: "PostgreSql",
    },
    {
      id: 9,
      username: "Umar26",
      prob: "B",
      result: "Accepted",
      submitTime: "39 hr ago",
      lang: "PostgreSql",
    },
    {
      id: 10,
      username: "akhyarahmed",
      prob: "D",
      result: "Accepted",
      submitTime: "40 hr ago",
      lang: "PostgreSql",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [usernameFilter, setUsernameFilter] = useState("");
  const [probFilter, setProbFilter] = useState("All");
  const [resultFilter, setResultFilter] = useState("All");
  const [langFilter, setLangFilter] = useState("All");

  // Navigation functions
  const goToPage = (page) => setCurrentPage(page);
  const goToPrevious = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const goToNext = () => setCurrentPage((prev) => prev + 1);

  // Reset all filters
  const resetFilters = () => {
    setUsernameFilter("");
    setProbFilter("All");
    setResultFilter("All");
    setLangFilter("All");
  };

  // Apply styles based on result
  const getResultVariant = (result) => {
    if (result === "Accepted") return "success";
    if (result === "Wrong Answer") return "destructive";
    if (result === "Compilation Error") return "warning";
    return "secondary";
  };

  // Get language variant
  const getLangVariant = (lang) => {
    if (lang === "SQL") return "success";
    if (lang === "PostgreSql") return "default";
    return "secondary";
  };

  return (
    <TabsContent value="submissions" className="p-0">
      <Card className="bg-black/40 border border-red-500/30">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl font-bold text-center text-white">
            Submission Status
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* Pagination with shadcn components */}
          <div className="flex items-center mb-4">
            <Pagination className={"flex justify-start"} >
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    onClick={goToPrevious}
                    className="border border-red-500/30 bg-black/50 text-gray-300 hover:bg-red-900/20 hover:text-white hover:border-red-500/50"
                  />
                </PaginationItem>
                {[1, 2, 3, 4, 5].map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      onClick={() => goToPage(page)}
                      isActive={currentPage === page}
                      className={
                        currentPage === page
                          ? "bg-red-900/30 text-red-300 border-red-500/50"
                          : "bg-black/50 text-gray-300 border-red-500/30 hover:bg-red-900/20 hover:text-white"
                      }
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationEllipsis className="text-gray-500" />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    onClick={goToNext}
                    className="border border-red-500/30 bg-black/50 text-gray-300 hover:bg-red-900/20 hover:text-white hover:border-red-500/50"
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>

          {/* Filters using shadcn components */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Username
              </label>
              <Input
                value={usernameFilter}
                onChange={(e) => setUsernameFilter(e.target.value)}
                className="bg-black/70 border-red-500/30 text-white focus:border-red-500/50 focus:ring-red-500/20"
                placeholder="Enter username"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Prob</label>
              <Select value={probFilter} onValueChange={setProbFilter}>
                <SelectTrigger className="bg-black/70 border-red-500/30 text-white focus:border-red-500/50 focus:ring-red-500/20">
                  <SelectValue placeholder="Select problem" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-red-500/30">
                  <SelectItem
                    value="All"
                    className="text-white hover:bg-red-900/20"
                  >
                    All
                  </SelectItem>
                  <SelectItem
                    value="A"
                    className="text-white hover:bg-red-900/20"
                  >
                    A
                  </SelectItem>
                  <SelectItem
                    value="B"
                    className="text-white hover:bg-red-900/20"
                  >
                    B
                  </SelectItem>
                  <SelectItem
                    value="C"
                    className="text-white hover:bg-red-900/20"
                  >
                    C
                  </SelectItem>
                  <SelectItem
                    value="D"
                    className="text-white hover:bg-red-900/20"
                  >
                    D
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">
                Result
              </label>
              <Select value={resultFilter} onValueChange={setResultFilter}>
                <SelectTrigger className="bg-black/70 border-red-500/30 text-white focus:border-red-500/50 focus:ring-red-500/20">
                  <SelectValue placeholder="Select result" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-red-500/30">
                  <SelectItem
                    value="All"
                    className="text-white hover:bg-red-900/20"
                  >
                    All
                  </SelectItem>
                  <SelectItem
                    value="Accepted"
                    className="text-white hover:bg-red-900/20"
                  >
                    Accepted
                  </SelectItem>
                  <SelectItem
                    value="Wrong Answer"
                    className="text-white hover:bg-red-900/20"
                  >
                    Wrong Answer
                  </SelectItem>
                  <SelectItem
                    value="Compilation Error"
                    className="text-white hover:bg-red-900/20"
                  >
                    Compilation Error
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300">Lang</label>
              <Select value={langFilter} onValueChange={setLangFilter}>
                <SelectTrigger className="bg-black/70 border-red-500/30 text-white focus:border-red-500/50 focus:ring-red-500/20">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent className="bg-black/90 border-red-500/30">
                  <SelectItem
                    value="All"
                    className="text-white hover:bg-red-900/20"
                  >
                    All
                  </SelectItem>
                  <SelectItem
                    value="PostgreSql"
                    className="text-white hover:bg-red-900/20"
                  >
                    PostgreSql
                  </SelectItem>
                  <SelectItem
                    value="SQL"
                    className="text-white hover:bg-red-900/20"
                  >
                    SQL
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Results Table using shadcn Table component */}
          <div className="rounded-lg border border-red-500/30 overflow-hidden">
            <Table>
              <TableHeader className="bg-red-900/20">
                <TableRow className="border-b border-red-500/30 hover:bg-transparent">
                  <TableHead className="text-gray-200 font-medium">
                    Username
                  </TableHead>
                  <TableHead className="text-gray-200 font-medium">
                    Prob
                  </TableHead>
                  <TableHead className="text-gray-200 font-medium">
                    Result
                  </TableHead>
                  <TableHead className="text-gray-200 font-medium">
                    Lang
                  </TableHead>
                  <TableHead className="text-gray-200 font-medium">
                    Submit Time
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map((submission) => (
                  <TableRow
                    key={submission.id}
                    className="border-b border-red-500/20 hover:bg-red-900/10 transition-colors"
                  >
                    <TableCell className="font-medium">
                      <a
                        href="#"
                        className="text-blue-400 hover:text-blue-300 hover:underline transition-colors"
                      >
                        {submission.username}
                      </a>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-900/30 text-white">
                        {submission.prob}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getResultVariant(submission.result)}
                        className={`${
                          submission.result === "Accepted"
                            ? "bg-green-500/20 border-0 py-1 px-2 rounded-full text-green-400 hover:bg-green-500/30"
                            : submission.result === "Wrong Answer"
                            ? "bg-red-500/20 border-0 py-1 px-2 rounded-full text-red-400 hover:bg-red-500/30"
                            : "bg-yellow-500/20 border-0 py-1 px-2 rounded-full text-yellow-400 hover:bg-yellow-500/30"
                        }`}
                      >
                        {submission.result}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getLangVariant(submission.lang)}
                        className={`${
                          submission.lang === "SQL"
                            ? "bg-green-500/20 border-0 py-1 px-2 rounded-full text-green-400 hover:bg-green-500/30"
                            : "bg-blue-500/20 border-0 py-1 px-2 rounded-full text-blue-400 hover:bg-blue-500/30"
                        }`}
                      >
                        {submission.lang}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-400">
                      {submission.submitTime}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default SubmissionTrackingPage;
