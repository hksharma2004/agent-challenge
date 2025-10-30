import { Trophy, Gem, TrendingUp, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserProfile } from '@/types/schema';
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Achievement {
  id: number;
  name: string;
  description: string;
  icon: any;
  unlocked: boolean;
}

interface ProfileAchievementsProps {
  user: UserProfile;
}

export function ProfileAchievements({ user }: ProfileAchievementsProps) {
  const achievements: Achievement[] = [
    {
      id: 1,
      name: "First Review",
      description: "Completed your first code review",
      icon: Star,
      unlocked: user.totalReviewsGiven > 0,
    },
    {
      id: 2,
      name: "Review Master",
      description: `Completed ${user.totalReviewsGiven} reviews`,
      icon: Trophy,
      unlocked: user.totalReviewsGiven >= 10, 
    },
    {
      id: 3,
      name: "Credit Hoarder",
      description: `Accumulated ${user.creditsavailable + user.creditsstaked} DCC`,
      icon: Gem,
      unlocked: (user.creditsavailable + user.creditsstaked) >= 100, 
    },
    {
      id: 4,
      name: "Reputation Builder",
      description: `Achieved ${user.reputation} reputation points`,
      icon: TrendingUp,
      unlocked: user.reputation >= 50, // Example condition
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.8 }}
    >
      <Card className="rounded-2xl shadow-soft-md border border-neutral-200 bg-white p-6">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Achievements
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="space-y-4">
            {achievements.map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className={cn(
                  "flex items-center gap-4 p-3 rounded-lg transition-all duration-300",
                  achievement.unlocked
                    ? "bg-white shadow-soft-sm border border-transparent hover:border-neon-green hover:shadow-soft-md"
                    : "bg-gray-50 border border-dashed border-gray-300 text-gray-500 grayscale"
                )}
              >
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center",
                    achievement.unlocked ? "bg-neon-green/10" : "bg-gray-200"
                  )}
                >
                  <achievement.icon
                    className={cn(
                      "w-5 h-5",
                      achievement.unlocked ? "text-neon-green" : "text-gray-400"
                    )}
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{achievement.name}</p>
                  <p className="text-xs text-gray-500">{achievement.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
