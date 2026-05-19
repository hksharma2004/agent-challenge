import type { UserProfile } from '@/types/schema';
import { TopNavBar } from "@/components/navigation/TopNavBar";
import { DashboardClient } from "@/components/dashboard/DashboardClient";

export default async function Dashboard() {
  const displayUser: UserProfile = {
      id: '00000000-0000-0000-0000-000000000000',
      username: 'Guest User',
      avatar_url: '/placeholder-user.jpg', 
      email: 'guest@example.com',
      reputation: 1500, 
      level: 'Expert', 
      totalReviewsGiven: 45,
      totalReviewsReceived: 28,
      totalSubmissions: 12,
      averageReviewScore: 92,
      joinedDate: new Date(),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-neutral-50 text-foreground">
      <TopNavBar />
      <DashboardClient displayUser={displayUser} />
    </div>
  );
}
