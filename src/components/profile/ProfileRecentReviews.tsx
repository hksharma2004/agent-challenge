import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface RecentReview {
  id: number;
  score: number;
  title: string;
  time: string;
  earned: number;
  feedback: string;
}

interface ProfileRecentReviewsProps {
  recentReviews: RecentReview[];
}

export function ProfileRecentReviews({ recentReviews }: ProfileRecentReviewsProps) {
  return (
    <Card className="rounded-2xl shadow-soft-md border border-neutral-200 bg-white p-6">
      <CardHeader className="flex flex-row items-center justify-between p-0 mb-6">
        <CardTitle className="text-xl font-semibold text-gray-900 flex items-center gap-2">
          <Star className="w-5 h-5 text-yellow-400" />
          Recent Reviews Given
        </CardTitle>
        <Link href="#" className="text-neon-green hover:text-green-500 text-sm flex items-center group">
          View All
          <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-4">
          {recentReviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ backgroundColor: 'var(--neutral-50)', borderLeftColor: 'var(--neon-green)' }}
              className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg bg-white shadow-soft-sm border border-transparent transition-all duration-300 group overflow-hidden"
            >
              <div className="absolute top-0 left-0 h-full w-1 bg-transparent group-hover:bg-neon-green transition-all duration-300"></div>
              <div className="flex-1 mb-2 sm:mb-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-4 h-4",
                          i < Math.round(review.score / 20) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-base font-semibold text-gray-800">{review.score}/100</span>
                </div>
                <p className="font-medium text-gray-900">{review.title}</p>
                <p className="text-sm text-gray-500 mt-1 line-clamp-1">{review.feedback}</p>
              </div>
              <div className="text-right flex flex-col items-end">
                <p className="text-neon-green font-semibold text-base">+{review.earned} DCC</p>
                <p className="text-xs text-gray-400 mt-1">{review.time}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
