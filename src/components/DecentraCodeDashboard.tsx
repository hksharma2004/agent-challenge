"use client";

import { useState } from 'react';
import type { DecentraCodeDashboardProps } from '@/types/schema';
import { TopNavBar } from './navigation/TopNavBar';
import { StatsCard } from './dashboard/StatsCard';
import { ActivityFeed } from './dashboard/ActivityFeed';
import { QuickActions } from './dashboard/QuickActions';
import { SubmissionsList } from './submissions/SubmissionsList';
import { CreditBalanceCards } from './credits/CreditBalanceCards';
import { StakingTierCard } from './credits/StakingTierCard';
import { TransactionHistory } from './credits/TransactionHistory';
import { ReviewsList } from './reviews/ReviewsList';
import { ProfileHeader } from './profile/ProfileHeader';
import { ClippedAreaChart } from './charts/ClippedAreaChart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatCredits } from '@/types/formatters';
import { BadgeCent, Star, TrendingUp, FileCode2 } from 'lucide-react';

export function DecentraCodeDashboard(props: DecentraCodeDashboardProps) {
  const [activeSection, setActiveSection] = useState('dashboard');

  const chartData = [
    { month: "January", score: 80 },
    { month: "February", score: 82 },
    { month: "March", score: 85 },
    { month: "April", score: 84 },
    { month: "May", score: 86 },
    { month: "June", score: 88 },
    { month: "July", score: 90 },
    { month: "August", score: 91 },
    { month: "September", score: 89 },
    { month: "October", score: 92 },
    { month: "November", score: 93 },
    { month: "December", score: 95 },
  ];


  const renderDashboard = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Credits Balance"
          value={formatCredits(props.currentUser.creditsAvailable)}
          icon={<BadgeCent className="h-5 w-5" />}
          description={`${formatCredits(props.currentUser.creditsStaked)} staked`}
        />
        <StatsCard
          title="Reputation Score"
          value={props.currentUser.reputation}
          icon={<Star className="h-5 w-5" />}
          description={props.currentUser.level}
        />
        <StatsCard
          title="Reviews Given"
          value={props.currentUser.totalReviewsGiven}
          icon={<FileCode2 className="h-5 w-5" />}
          description="Total reviews completed"
        />
        <StatsCard
          title="Average Score"
          value={props.currentUser.averageReviewScore.toFixed(1)}
          icon={<TrendingUp className="h-5 w-5" />}
          description="Review quality"
        />
      </div>

      <QuickActions
        onSubmitCode={() => setActiveSection('submissions')}
        onStartReviewing={() => setActiveSection('submissions')}
        onStakeCredits={() => setActiveSection('credits')}
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ActivityFeed activities={props.recentActivities} />
        <ClippedAreaChart data={chartData} />
      </div>
    </div>
  );

  const renderSubmissions = () => (
    <div className="space-y-6">
      <div>
        <h2 className="heading-xl mb-2">Code Submissions</h2>
        <p className="body-lg text-muted-foreground">
          Browse and claim submissions for review
        </p>
      </div>
      <SubmissionsList
        submissions={props.submissions}
        onClaimSubmission={props.onClaimSubmission}
      />
    </div>
  );

  const renderReviews = () => (
    <div className="space-y-6">
      <div>
        <h2 className="heading-xl mb-2">Your Reviews</h2>
        <p className="body-lg text-muted-foreground">
          Track your review history and earnings
        </p>
      </div>
      <ReviewsList reviews={props.reviews} />
    </div>
  );

  const renderCredits = () => (
    <div className="space-y-6">
      <div>
        <h2 className="heading-xl mb-2">Credits & Staking</h2>
        <p className="body-lg text-muted-foreground">
          Manage your credits and unlock premium features
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <CreditBalanceCards
            available={props.currentUser.creditsAvailable}
            staked={props.currentUser.creditsStaked}
          />
        </div>
        <div className="lg:col-span-2">
          <Tabs defaultValue="staking" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="staking">Staking Tiers</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
            </TabsList>
            <TabsContent value="staking" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {props.stakingTiers.map((tier) => (
                  <StakingTierCard
                    key={tier.tier}
                    tierInfo={tier}
                    currentTier={props.currentUser.stakingTier}
                    onStake={props.onStakeCredits}
                  />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="transactions" className="mt-6">
              <TransactionHistory transactions={props.creditTransactions} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );

  const renderProfile = () => (
    <div className="space-y-6">
      <ProfileHeader user={props.currentUser} />
      <ClippedAreaChart data={chartData} />
      <ReviewsList reviews={props.reviews} />
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <TopNavBar user={props.currentUser} onNavigate={setActiveSection} />
      <main className="container mx-auto px-4 py-8">
        {activeSection === 'dashboard' && renderDashboard()}
        {activeSection === 'submissions' && renderSubmissions()}
        {activeSection === 'reviews' && renderReviews()}
        {activeSection === 'credits' && renderCredits()}
        {activeSection === 'profile' && renderProfile()}
      </main>
    </div>
  );
}
