import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

interface ScoreStatisticsProps {
  avgScoreGiven: number;
  avgScoreReceived: number;
  reviewAccuracy: number;
}

export function ProfileScoreStatistics({
  avgScoreGiven,
  avgScoreReceived,
  reviewAccuracy,
}: ScoreStatisticsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    >
      <Card className="rounded-2xl shadow-soft-md border border-neutral-200 bg-white p-6">
        <CardHeader className="p-0 mb-4">
          <CardTitle className="text-xl font-semibold text-gray-900">Score Statistics</CardTitle>
        </CardHeader>
        <CardContent className="p-0 space-y-5">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Avg Score Given</span>
              <span className="text-base font-semibold text-gray-800">{(avgScoreGiven ?? 0).toFixed(1)}%</span>
            </div>
            <ProgressBar value={avgScoreGiven ?? 0} className="h-2" indicatorColor="bg-neon-green" />
          </div>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-600">Avg Score Received</span>
              <span className="text-base font-semibold text-gray-800">{(avgScoreReceived ?? 0).toFixed(1)}%</span>
            </div>
            <ProgressBar value={avgScoreReceived ?? 0} className="h-2" indicatorColor="bg-neon-green" />
          </div>
          <div className="pt-4 border-t border-neutral-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-neon-green" />
              <span className="text-base text-gray-700">Review Accuracy</span>
            </div>
            <span className="text-2xl font-bold text-neon-green">{(reviewAccuracy ?? 0).toFixed(0)}%</span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
