"use client";

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/hooks/use-user';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

const reviewSchema = z.object({
  score: z.number().min(1).max(10),
  rating: z.number().min(1).max(5),
  feedback: z.string().min(10, { message: "Feedback must be at least 10 characters." }),

});

interface SubmissionReviewFormProps {
  submissionId: string;
  onReviewSubmitted: () => void;
}

export default function SubmissionReviewForm({ submissionId, onReviewSubmitted }: SubmissionReviewFormProps) {
  const { user } = useUser();
  const router = useRouter();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      score: 5,
      rating: 3,
      feedback: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof reviewSchema>) => {
    if (!user) {
      alert('You must be logged in to submit a review.');
      router.push('/signin');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id, 
        },
        body: JSON.stringify({
          submission_id: submissionId,
          ...values,
        }),
      });

      if (response.ok) {
        console.log('Review submitted successfully');
        toast({
          title: 'Review Submitted!',
          description: 'Your review has been successfully submitted.',
        });
        onReviewSubmitted();
        form.reset();
      } else {
        const errorData = await response.json();
        console.error('Failed to submit review:', errorData.error);
        alert(`Failed to submit review: ${errorData.error}`);
      }
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('An unexpected error occurred while submitting the review.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="border-2 border-gray-800 shadow-neobrutalism-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Submit Your Review</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Overall Score (1-10)</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={10}
                      step={1}
                      value={[field.value]}
                      onValueChange={(val) => field.onChange(val[0])}
                      className="w-[60%]"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground mt-2">Current Score: {field.value}</p>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rating"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Rating (1-5 stars)</FormLabel>
                  <FormControl>
                    <Slider
                      min={1}
                      max={5}
                      step={1}
                      value={[field.value]}
                      onValueChange={(val) => field.onChange(val[0])}
                      className="w-[60%]"
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground mt-2">Current Rating: {field.value} stars</p>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="feedback"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Feedback</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Provide detailed feedback..." {...field} rows={5} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
