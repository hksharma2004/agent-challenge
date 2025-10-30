import {
  Zap,
  Trophy,
  Gem,
  ArrowRight,
  Code2,
  Star,
  CreditCard,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import type { UserProfile } from '@/types/schema';
import { TopNavBar } from "@/components/navigation/TopNavBar";
import Link from "next/link";
import { StakingTier } from '@/types/enums';
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export default async function Dashboard() {
  const { data: { user } } = await supabase.auth.getUser();

  let userProfile: UserProfile | null = null;
  if (user) {

    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        username: user.user_metadata?.full_name || user.user_metadata?.name || user.email,
        avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
      }, { onConflict: 'id' }) 
      .single();

    if (error) {
      console.error('Error upserting profile:', error);
    } else {
      userProfile = data as UserProfile; // Explicitly cast data to UserProfile
    }
  }

  const displayUser: UserProfile = {
      id: userProfile?.id || user?.id || '',
      username: userProfile?.username || user?.user_metadata?.full_name || user?.email || 'Guest User',
      avatar_url: userProfile?.avatar_url || user?.user_metadata?.avatar_url || '/placeholder-user.jpg', 
      email: user?.email || '',
      reputation: userProfile?.reputation || 0, 
      level: userProfile?.level || 'Beginner', 
      creditsavailable: userProfile?.creditsavailable || 100, 
      creditsstaked: userProfile?.creditsstaked || 0, 
      stakingTier: userProfile?.stakingTier || StakingTier.BRONZE,
      totalReviewsGiven: userProfile?.totalReviewsGiven || 0,
      totalReviewsReceived: userProfile?.totalReviewsReceived || 0,
      totalSubmissions: userProfile?.totalSubmissions || 0, // Added totalSubmissions
      averageReviewScore: userProfile?.averageReviewScore || 0,
      joinedDate: userProfile?.joinedDate ? new Date(userProfile.joinedDate) : new Date(),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 text-foreground">
      <TopNavBar />
      <DashboardClient displayUser={displayUser} />
    </div>
  );
}
