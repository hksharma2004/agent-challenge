import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StakingTier } from "@/types/enums";
import type { UserProfile } from '@/types/schema';
import { motion } from "framer-motion";
import { CheckCircle, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface ProfileTierInfoProps {
  user: UserProfile;
}

export function ProfileTierInfo({ user }: ProfileTierInfoProps) {
  const getBenefitsForTier = (tier: StakingTier) => {
    switch (tier) {
      case StakingTier.BRONZE:
        return ["Basic reviewer matching", "Access to community forums"];
      case StakingTier.SILVER:
        return [
          "Priority reviewer matching",
          "AI pair programming (beta)",
          "Enhanced analytics dashboard",
        ];
      case StakingTier.GOLD:
        return [
          "Priority reviewer matching",
          "AI pair programming (full access)",
          "Private review sessions",
          "Customizable review templates",
          "Dedicated support channel",
        ];
      default:
        return [];
    }
  };

  const benefits = getBenefitsForTier(user.stakingTier);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.9 }}
    >
      <Card className="rounded-2xl shadow-soft-md border border-neutral-200 bg-white p-6">
        <CardHeader className="p-0 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <CardTitle className="text-xl font-semibold text-gray-900">{user.stakingTier} Tier Benefits</CardTitle>
            <Badge className="bg-neon-green/10 text-neon-green text-xs px-2 py-0.5 rounded-full">
              <Award className="h-3 w-3 mr-1" /> {user.stakingTier}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <ul className="space-y-3 text-sm text-gray-700">
            {benefits.map((benefit, index) => (
              <motion.li
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.9 + index * 0.05 }}
                className="flex items-start gap-3"
              >
                <CheckCircle className="h-5 w-5 text-neon-green flex-shrink-0" />
                <span className="font-medium">{benefit}</span>
              </motion.li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </motion.div>
  );
}
