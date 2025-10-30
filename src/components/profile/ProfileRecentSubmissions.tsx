"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Code2, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { useUser } from "@/hooks/use-user";
import { SubmissionStatus } from "@/types/enums";

interface RecentSubmission {
  id: string;
  title: string;
  ai_score: number | null;
  review_count: number;
  avg_score: number | null;
  status: SubmissionStatus;
}

export function ProfileRecentSubmissions() {
  const { user } = useUser();
  const [recentSubmissions, setRecentSubmissions] = useState<RecentSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserSubmissions = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        const response = await fetch('/api/profile/submissions', {
          headers: {
            'x-user-id': user.id,
          },
        });
        if (!response.ok) {
          throw new Error('Failed to fetch user submissions');
        }
        const data = await response.json();
        setRecentSubmissions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchUserSubmissions();
  }, [user]);

  if (loading) {
    return <div className="text-center py-12">Loading submissions...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  }

  return (
    <Card className="rounded-2xl shadow-soft-md border border-neutral-200 bg-white p-6">
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-6">
        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Code2 className="w-5 h-5 text-gray-700" />
          Recent Submissions
        </CardTitle>
        <Link href="/submissions" className="text-neon-green hover:text-green-500 text-sm flex items-center group">
          View All
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-4">
          {recentSubmissions.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">No submissions found.</div>
          ) : (
            recentSubmissions.map((submission, index) => (
              <motion.div
                key={submission.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ backgroundColor: 'var(--neutral-50)', borderLeftColor: 'var(--neon-green)' }}
                className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-white shadow-soft-sm border border-transparent transition-all duration-300 group overflow-hidden"
              >
                <div className="absolute top-0 left-0 h-full w-1 bg-transparent group-hover:bg-neon-green transition-all duration-300"></div>
                <div className="flex-1 mb-2 sm:mb-0">
                  <p className="font-semibold text-gray-900 mb-2">{submission.title}</p>
                  <div className="flex items-center gap-4 text-sm">
                    {submission.ai_score !== null && (
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <span className="text-gray-700 font-medium">AI Score:</span>
                        <ProgressBar value={submission.ai_score} className="w-24 h-2" indicatorColor="bg-neon-green" />
                        <span className="text-gray-700 font-medium">{submission.ai_score}/100</span>
                      </div>
                    )}
                    <span className="text-gray-500">{submission.review_count} reviews</span>
                    {submission.avg_score && (
                      <span className="text-gray-700">Avg: {Math.round(submission.avg_score)}/10</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <span
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      submission.status === SubmissionStatus.REVIEWED
                        ? "bg-neon-green/20 text-neon-green"
                        : "bg-yellow-500/20 text-yellow-500"
                    )}
                  >
                    {submission.status === SubmissionStatus.REVIEWED ? "Reviewed" : "Awaiting Review"}
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
