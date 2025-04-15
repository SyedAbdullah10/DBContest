"use client";

import React, { useEffect, useState } from "react";
import { TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Loader2 } from "lucide-react";
import { useSession } from "next-auth/react";
import { Skeleton } from "@/components/ui/skeleton";

const StatusTab = ({ contest_id, getDifficultyStyles }) => {
  const { data: session, status } = useSession();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      const fetchSubmissions = async () => {
        try {
          const res = await fetch("/api/get-submissions", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              user_id: session.user.id,
              contest_id: contest_id || "b557de9a-01b1-4bc6-87c7-dae48116cc1d",
            }),
          });

          const data = await res.json();
          if (data.success) {
            setSubmissions(data.submissions);
          } else {
            console.error(data.error);
          }
        } catch (err) {
          console.error("Error fetching submissions", err);
        } finally {
          setLoading(false);
        }
      };

      fetchSubmissions();
    }
  }, [session, contest_id, status]);

  const getStatusBadgeClass = (status) => {
    return status === "Accepted"
      ? "bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/50"
      : "bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/50";
  };

  const formatDateTime = (dateTimeString) => {
    return dateTimeString.split(" | ").join(" ");
  };

  // Skeleton loading UI
  const SkeletonLoader = () => (
    <div className="rounded-md border border-red-500/30 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="bg-red-500/20 hover:bg-red-500/30 border-b border-red-500/30">
            <TableHead className="text-white font-medium text-center">
              <Skeleton className="h-6 w-24 mx-auto bg-red-500/20" />
            </TableHead>
            <TableHead className="text-white font-medium text-center">
              <Skeleton className="h-6 w-20 mx-auto bg-red-500/20" />
            </TableHead>
            <TableHead className="text-white font-medium text-center">
              <Skeleton className="h-6 w-16 mx-auto bg-red-500/20" />
            </TableHead>
            <TableHead className="text-white font-medium text-center">
              <Skeleton className="h-6 w-32 mx-auto bg-red-500/20" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array(5)
            .fill(0)
            .map((_, idx) => (
              <TableRow
                key={idx}
                className="border-b border-red-500/30 hover:bg-red-500/10"
              >
                <TableCell className="text-center">
                  <Skeleton className="h-6 w-24 mx-auto bg-red-500/10" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-6 w-16 mx-auto rounded-full bg-red-500/10" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-6 w-20 mx-auto rounded-full bg-red-500/10" />
                </TableCell>
                <TableCell className="text-center">
                  <Skeleton className="h-6 w-32 mx-auto bg-red-500/10" />
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );

  return (
    <TabsContent value="status">
      <Card className="bg-black/40 border border-red-500/30">
        <CardContent className="p-6">
          <h3 className="text-xl font-bold mb-4 text-center text-white">
            All Submissions
          </h3>

          {loading ? (
            <SkeletonLoader />
          ) : submissions.length === 0 ? (
            <div className="text-center py-8 text-white text-opacity-80">
              <p>No submissions yet.</p>
              <p className="text-sm mt-1 text-red-300">
                Complete challenges to see your submissions here.
              </p>
            </div>
          ) : (
            <div className="rounded-md border border-red-500/30 overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-red-500/20 hover:bg-red-500/30 border-b border-red-500/30">
                    <TableHead className="text-white font-medium text-center">
                      Question
                    </TableHead>
                    <TableHead className="text-white font-medium text-center">
                      SQL Mode
                    </TableHead>
                    <TableHead className="text-white font-medium text-center">
                      Status
                    </TableHead>
                    <TableHead className="text-white font-medium text-center">
                      Submitted At
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {submissions.map((sub, idx) => (
                    <Dialog key={sub.id || idx}>
                      <DialogTrigger asChild>
                        <TableRow className="cursor-pointer border-b border-red-500/30 hover:bg-red-500/10">
                          <TableCell className="text-white text-center font-medium">
                            Question {sub.questionNumber}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="outline"
                              className={`${getDifficultyStyles(
                                sub.sql_mode
                              )} border-none rounded-full`}
                            >
                              {sub.sql_mode}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge
                              variant="outline"
                              className={
                                getStatusBadgeClass(sub.status) +
                                ` border-none rounded-full px-2`
                              }
                            >
                              {sub.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-white text-center text-sm">
                            {formatDateTime(sub.submitted_at)}
                          </TableCell>
                        </TableRow>
                      </DialogTrigger>

                      <DialogContent className="bg-black/95 border border-red-500/30 max-w-xl text-white">
                        <DialogHeader>
                          <DialogTitle className="text-xl text-red-400">
                            Question {sub.questionNumber} Submission
                          </DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 mt-2">
                          <div className="flex flex-wrap flex-col gap-3 bg-red-950/20 p-3 rounded-md border border-red-500/20">
                            <div className="flex items-center gap-2">
                              <span className="text-red-300 text-sm">
                                Mode:
                              </span>
                              <Badge
                                variant="outline"
                                className={`${getDifficultyStyles(
                                  sub.sql_mode
                                )} border-none rounded-full`}
                              >
                                {sub.sql_mode}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-red-300 text-sm">
                                Status:
                              </span>
                              <Badge
                                variant="outline"
                                className={
                                  getStatusBadgeClass(sub.status) +
                                  ` border-none rounded-full`
                                }
                              >
                                {sub.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-red-300 text-sm">
                                Submitted:
                              </span>
                              <span className="text-white text-sm">
                                {formatDateTime(sub.submitted_at)}
                              </span>
                            </div>
                          </div>

                          <div>
                            <h4 className="font-medium mb-2 text-white text-sm uppercase tracking-wider">
                              Your Answer
                            </h4>
                            <pre className="bg-red-950/30 p-4 rounded-md text-white text-sm whitespace-pre-wrap border border-red-500/30 overflow-auto max-h-80">
                              {sub.user_answer}
                            </pre>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </TabsContent>
  );
};

export default StatusTab;