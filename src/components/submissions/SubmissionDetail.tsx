"use client";

import { useState, useEffect } from 'react';
import { CodeSubmission, Review } from '@/types/schema';
import { SubmissionCard } from './SubmissionCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { formatDistanceToNow } from 'date-fns';
import { Button } from '@/components/ui/button';
import SubmissionReviewForm from './SubmissionReviewForm';
import { useUser } from '@/hooks/use-user';

interface SubmissionDetailProps {
  submissionId: string;
}

export default function SubmissionDetail({ submissionId }: SubmissionDetailProps) {
  const { user } = useUser();
  const [submission, setSubmission] = useState<CodeSubmission | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showReviewForm, setShowReviewForm] = useState(false);

  useEffect(() => {
    const fetchSubmissionDetails = async () => {
      try {
        const response = await fetch(`/api/submissions/${submissionId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch submission details');
        }
        const data = await response.json();
        setSubmission(data);

        // Assuming there's an API endpoint for reviews by submission ID
        const reviewsResponse = await fetch(`/api/reviews?submissionId=${submissionId}`);
        if (!reviewsResponse.ok) {
          throw new Error('Failed to fetch reviews');
        }
        const reviewsData = await reviewsResponse.json();
        setReviews(reviewsData);

      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSubmissionDetails();
  }, [submissionId, showReviewForm]); 

  if (loading) {
    return <div className="text-center py-12">Loading submission details...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">Error: {error}</div>;
  }

  if (!submission) {
    return <div className="text-center py-12">Submission not found.</div>;
  }

  return (
    <div className="space-y-8">
      <SubmissionCard submission={submission} />

      {submission.aiInsights && submission.aiInsights.length > 0 && (
        <Card className="border-2 border-gray-800 shadow-neobrutalism-sm">
          <CardHeader>
            <CardTitle className="text-xl font-bold">AI Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-2">
              {submission.aiInsights.map((insight, index) => (
                <li key={index}>{insight}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <Card className="border-2 border-gray-800 shadow-neobrutalism-sm">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Reviews ({reviews.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {reviews.length === 0 ? (
            <p>No reviews yet.</p>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-4 last:border-b-0 last:pb-0">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="font-semibold">{review.reviewerName}</h3>
                    <Badge variant="secondary">{review.score}/10</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Reviewed {formatDistanceToNow(new Date(review.submittedDate), { addSuffix: true })}
                  </p>
                  <p>{review.feedback}</p>
                  {review.categoryScores && (
                    <div className="mt-2 text-sm">
                      <p className="font-medium">Category Scores:</p>
                      <ul className="list-disc pl-5">
                        {Object.entries(review.categoryScores).map(([category, score]) => (
                          <li key={category}>{category}: {score}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {user && user.id !== submission.authorId && !showReviewForm && (
        <Button onClick={() => setShowReviewForm(true)} className="bg-green-500 hover:bg-green-600 text-white">
          Add Review
        </Button>
      )}

      {showReviewForm && (
        <SubmissionReviewForm
          submissionId={submission.id}
          onReviewSubmitted={() => setShowReviewForm(false)}
        />
      )}
    </div>
  );
}
