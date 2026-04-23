"use client";

import { DecentraCodeDashboard } from '@/components/DecentraCodeDashboard';
import { Toaster } from 'sonner';
import { useEffect, useState } from 'react';
import { StakingTier } from '@/types/enums';

export default function DecentraCodePage() {
  const [user, setUser] = useState<any>(null);
  const [submissions, setSubmissions] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [creditTransactions, setCreditTransactions] = useState([]);

  useEffect(() => {
    // Mock user data for the hardcoded Guest User
    setUser({
      id: '00000000-0000-0000-0000-000000000000',
      username: 'Guest User',
      avatar_url: '/placeholder-user.jpg',
      email: 'guest@example.com',
      reputation_score: 1500,
      credits: 1000,
      staked_credits: 500,
      created_at: new Date().toISOString()
    });
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
        level: "Expert",
        creditsAvailable: user.credits,
        creditsStaked: user.staked_credits,
        stakingTier: StakingTier.GOLD,
        totalReviewsGiven: reviews.length,
        totalReviewsReceived: 0,
        averageReviewScore: 92,
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

