import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { UserProfile } from '@/types/schema';
import { formatDate } from '@/types/formatters';
import { Star, Award, Calendar } from 'lucide-react';

interface ProfileHeaderProps {
  user: UserProfile;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      transition={{ type: 'spring', stiffness: 400, damping: 10 }}
      className="rounded-2xl shadow-soft-lg hover:shadow-soft-xl transition-all duration-300 overflow-hidden"
    >
      <Card className="bg-gradient-to-r from-white to-neutral-50 border-none">
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <img
              src={user.avatar_url || '/placeholder-user.jpg'}
              alt={user.username || 'User Avatar'}
              className="h-28 w-28 rounded-full border-4 border-white shadow-soft-md"
            />
            <div className="flex-1 flex flex-col md:flex-row md:items-center justify-between gap-4 w-full">
              <div className="flex flex-col items-center md:items-start text-center md:text-left">
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-3xl font-bold text-gray-900">{user.username}</h2>
                  <Badge
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-semibold",
                      "bg-transparent border border-neon-green text-neon-green shadow-sm"
                    )}
                  >
                    {user.level}
                  </Badge>
                </div>
                <p className="text-gray-600 text-sm mb-2">{user.email}</p>
                <div className="flex items-center gap-2 text-gray-400 text-xs">
                  <Calendar className="h-3 w-3" />
                  <span>Joined {formatDate(user.joinedDate)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center md:text-right">
                <div className="flex flex-col items-center md:items-end">
                  <p className="text-sm text-gray-500">Reputation</p>
                  <p className="text-xl font-semibold text-gray-800">{user.reputation}</p>
                </div>
                <div className="flex flex-col items-center md:items-end">
                  <p className="text-sm text-gray-500">Reviews Given</p>
                  <p className="text-xl font-semibold text-gray-800">{user.totalReviewsGiven}</p>
                </div>
                <div className="flex flex-col items-center md:items-end">
                  <p className="text-sm text-gray-500">Reviews Received</p>
                  <p className="text-xl font-semibold text-gray-800">{user.totalReviewsReceived}</p>
                </div>
                <div className="flex flex-col items-center md:items-end">
                  <p className="text-sm text-gray-500">Avg Score</p>
                  <p className="text-xl font-semibold text-gray-800">{(user.averageReviewScore ?? 0).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
