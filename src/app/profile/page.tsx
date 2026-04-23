"use client"

import { useState, useEffect } from "react"
import { Code2, Trophy, Gem, TrendingUp, Star } from "lucide-react"
import { TopNavBar } from "@/components/navigation/TopNavBar"
import { ProfileHeader } from "@/components/profile/ProfileHeader"
import { ProfileStatsGrid } from "@/components/profile/ProfileStatsGrid"
import { ProfileRecentReviews } from "@/components/profile/ProfileRecentReviews"
import { ProfileRecentSubmissions } from "@/components/profile/ProfileRecentSubmissions"
import { ProfileScoreStatistics } from "@/components/profile/ProfileScoreStatistics"
import { ProfileAchievements } from "@/components/profile/ProfileAchievements"
import { ProfileTierInfo } from "@/components/profile/ProfileTierInfo"
import { UserProfile } from "@/types/schema"
import { StakingTier } from "@/types/enums"
import { useUser } from "@/hooks/use-user";

export default function Profile() {
  const { user, loading: authLoading } = useUser()
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  useEffect(() => {
    async function fetchUserProfile() {
      // Mock profile fetch
      setUserProfile({
        id: '00000000-0000-0000-0000-000000000000',
        username: 'Guest User',
        avatar_url: '/placeholder-user.jpg',
        email: 'guest@example.com',
        reputation: 1500,
        level: 'Expert',
        creditsavailable: 1000,
        creditsstaked: 500,
        stakingTier: StakingTier.GOLD,
        totalReviewsGiven: 45,
        totalReviewsReceived: 28,
        totalSubmissions: 12,
        averageReviewScore: 92,
        joinedDate: new Date(),
      });
      setProfileLoading(false)
    }

    if (!authLoading) {
      fetchUserProfile()
    }
  }, [user, authLoading])

  const recentReviews = [
    {
      id: 1,
      score: 85,
      title: "Python API Refactor",
      time: "2 days ago",
      earned: 12,
      feedback: "Well-structured code with good separation of concerns...",
    },
    {
      id: 2,
      score: 72,
      title: "React Component Library",
      time: "5 days ago",
      earned: 10,
      feedback: "Good start, but needs more comprehensive testing...",
    },
    {
      id: 3,
      score: 88,
      title: "Node.js API Server",
      time: "1 week ago",
      earned: 15,
      feedback: "Excellent error handling and clean architecture...",
    },
  ]

  if (authLoading || profileLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-black">Loading profile...</p>
      </div>
    )
  }

  if (!userProfile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-black">No profile found.</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 pb-16">
      <TopNavBar />

      <div className="max-w-7xl mx-auto px-6 pt-12 space-y-8">
        <ProfileHeader user={userProfile} />

        <ProfileStatsGrid
          totalSubmissions={userProfile.totalSubmissions}
          reviewsGivenCount={userProfile.totalReviewsGiven}
          reviewsReceivedCount={userProfile.totalReviewsReceived}
          reputationScore={userProfile.reputation}
          creditsAvailable={userProfile.creditsavailable}
          creditsStaked={userProfile.creditsstaked}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          <div className="md:col-span-2 space-y-8">
            <ProfileRecentReviews recentReviews={recentReviews} />
            <ProfileRecentSubmissions />
          </div>


          <div className="md:col-span-1 space-y-8">
            <ProfileScoreStatistics
              avgScoreGiven={userProfile.averageReviewScore}
              avgScoreReceived={userProfile.averageReviewScore}
              reviewAccuracy={userProfile.averageReviewScore} 
            />
            <ProfileAchievements user={userProfile} />
            <ProfileTierInfo user={userProfile} />
          </div>
        </div>
      </div>
    </div>
  )
}
