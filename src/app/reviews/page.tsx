"use client";

import { useState } from "react";
import { TopNavBar } from "@/components/navigation/TopNavBar";
import { ReviewerInput } from "@/components/reviews/ReviewerInput";
import { ReviewerSummary } from "@/components/reviews/ReviewerSummary";
import { motion } from "framer-motion";

export interface ReviewerData {
  username: string;
  reputation: number;
  languages: string[];
  availability: string;
  stakedCredits: number;
}

export default function ReviewsPage() {
  const [reviewerId, setReviewerId] = useState("");
  const [reviewerData, setReviewerData] = useState<ReviewerData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sectionVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.0 } },
  };

  const handleFetch = async () => {
    alert("handleFetch called!"); 
    console.log("handleFetch called!"); 
    if (!reviewerId) {
      setError("Please enter a reviewer ID.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      console.log("Fetching reviewer data for ID:", reviewerId);
      const response = await fetch("/api/workflows/reviewer-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ reviewerId }),
      });

      console.log("Response status:", response.status);
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Failed to fetch reviewer data:", errorText);
        throw new Error(`Failed to fetch reviewer data: ${errorText}`);
      }

      const data = await response.json();
      console.log("Fetched data:", data);
      setReviewerData(data);
    } catch (err) {
      console.error("Error in handleFetch:", err);
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <TopNavBar />
      <motion.div
        className="max-w-6xl mx-auto px-6 py-8 grid gap-8"
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.1 }}
      >
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-4xl font-semibold text-black">Reviewer Info</h1>
            <p className="text-neutral-500 text-base">
              Run reviewer analysis workflows and track review insights.
            </p>
          </div>
          <button
            onClick={handleFetch}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition-all shadow-sm"
            disabled={isLoading}
          >
            {isLoading ? "Running..." : "Run Workflow"}
          </button>
        </div>

        <ReviewerInput
          reviewerId={reviewerId}
          setReviewerId={setReviewerId}
          onFetch={handleFetch}
          isLoading={isLoading}
        />
        {error && <p className="text-red-500 text-center mt-4">{error}</p>}
        <ReviewerSummary data={reviewerData} />
      </motion.div>
    </div>
  );
}
