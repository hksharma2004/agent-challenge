import { motion } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: number | string;
  delay: number;
}

function StatCard({ title, value, delay }: StatCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: delay }}
      whileHover={{ y: -2, boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)' }}
      className="relative rounded-2xl bg-white p-6 shadow-soft-md transition-all duration-300 group overflow-hidden border border-transparent hover:border-neon-green"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-transparent group-hover:bg-neon-green transition-all duration-300"></div>
      <CardContent className="p-0">
        <p className="text-sm text-gray-500 mb-2">{title}</p>
        <p className="text-3xl font-semibold text-gray-900">{value}</p>
      </CardContent>
    </motion.div>
  );
}

interface ProfileStatsGridProps {
  totalSubmissions: number;
  reviewsGivenCount: number;
  reviewsReceivedCount: number;
  reputationScore: number;
  creditsAvailable: number;
  creditsStaked: number;
}

export function ProfileStatsGrid({
  totalSubmissions,
  reviewsGivenCount,
  reviewsReceivedCount,
  reputationScore,
  creditsAvailable,
  creditsStaked,
}: ProfileStatsGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <StatCard title="Submissions" value={totalSubmissions} delay={0.1} />
      <StatCard title="Reviews Given" value={reviewsGivenCount} delay={0.2} />
      <StatCard title="Reviews Received" value={reviewsReceivedCount} delay={0.3} />
      <StatCard title="Reputation" value={reputationScore} delay={0.4} />
      <StatCard title="Credits Available" value={creditsAvailable} delay={0.5} />
      <StatCard title="Credits Staked" value={creditsStaked} delay={0.6} />
    </div>
  );
}
