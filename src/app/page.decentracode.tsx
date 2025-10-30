"use client";

import { DecentraCodeDashboard } from '@/components/DecentraCodeDashboard';
import { Toaster } from 'sonner';
import { supabase } from '@/lib/supabase';
import { useEffect, useState } from 'react';
import { StakingTier } from '@/types/enums';

export default function DecentraCodePage() {
  const [user, setUser] = useState(null);
  const [submissions, setSubmissions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [creditTransactions, setCreditTransactions] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: userData } = await supabase.from('users').select('*').eq('id', session.user.id).single();
        setUser(userData);

        const { data: submissionsData } = await supabase.from('submissions').select('*').eq('user_id', session.user.id);
        setSubmissions(submissionsData);

        const { data: reviewsData } = await supabase.from('reviews').select('*').eq('reviewer_id', session.user.id);
        setReviews(reviewsData);

        const { data: creditTransactionsData } = await supabase.from('credit_transactions').select('*').eq('user_id', session.user.id);
        setCreditTransactions(creditTransactionsData);
      }
    };
    fetchData();
  }, []);

  const handleSubmitCode = () => {
    console.log('Submit code clicked');
  };

  const handleSubmitReview = () => {
    console.log('Submit review clicked');
  };

  const handleStakeCredits = (amount: number) => {
    console.log('Stake credits:', amount);
  };

  const handleUnstakeCredits = (amount: number) => {
    console.log('Unstake credits:', amount);
  };

  const handleClaimSubmission = (id: string) => {
    console.log('Claim submission:', id);
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  const dashboardProps = {
    currentUser: {
        id: user.id,
        username: user.username,
        avatar: user.avatar_url,
        email: user.email,
        reputation: user.reputation_score,
        level: "Beginner",
        creditsAvailable: user.credits,
        creditsStaked: user.staked_credits,
        stakingTier: StakingTier.BRONZE,
        totalReviewsGiven: reviews.length,
        totalReviewsReceived: 0,
        averageReviewScore: 0,
        joinedDate: new Date(user.created_at)
    },
    recentActivities: [],
    submissions: submissions,
    reviews: reviews,
    creditTransactions: creditTransactions,
    stakingTiers: []
  }

  return (
    <>
      <DecentraCodeDashboard
        {...dashboardProps}
        onSubmitCode={handleSubmitCode}
        onSubmitReview={handleSubmitReview}
        onStakeCredits={handleStakeCredits}
        onUnstakeCredits={handleUnstakeCredits}
        onClaimSubmission={handleClaimSubmission}
        isSocketConnected={true}
      />
      <Toaster position="top-right" />
    </>
  );
}
