"use client";

import {
  Zap,
  Trophy,
  Gem,
  ArrowRight,
  Code2,
  Star,
  CreditCard,
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import type { UserProfile } from '@/types/schema';

interface DashboardClientProps {
  displayUser: UserProfile;
}

export function DashboardClient({ displayUser }: DashboardClientProps) {
  const cardVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.0 } },
  };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 space-y-8">

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-neutral-200 flex flex-col justify-center items-center text-center"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <Gem className="w-8 h-8 text-green-500 mb-3" />
          <p className="text-neutral-600 text-sm mb-1">DCC Balance</p>
          <p className="text-4xl font-semibold text-black">{displayUser.creditsavailable}</p>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-neutral-200 flex flex-col justify-center items-center text-center"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <Zap className="w-8 h-8 text-green-500 mb-3" />
          <p className="text-neutral-600 text-sm mb-1">Staked</p>
          <p className="text-4xl font-semibold text-black">{displayUser.creditsstaked}</p>
        </motion.div>

        <motion.div
          className="bg-white rounded-2xl p-6 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-neutral-200 flex flex-col justify-center items-center text-center"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <Trophy className="w-8 h-8 text-green-500 mb-3" />
          <p className="text-neutral-600 text-sm mb-1">Reputation</p>
          <p className="text-4xl font-semibold text-black">{displayUser.reputation}</p>
        </motion.div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-8">

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <Link
            href="/dashboard/analyze"
            className="relative flex flex-col justify-between h-full bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] group"
          >
            <div>
              <h3 className="font-bold text-2xl text-white mb-2">Analyze Code</h3>
              <p className="text-white/90 text-sm">Submit a repository for AI analysis.</p>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <Code2 className="w-8 h-8 text-white/90" />
              <ArrowRight className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </Link>
        </motion.div>


        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          <Link
            href="/submissions"
            className="relative flex flex-col justify-between h-full bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-neutral-200 group"
          >
            <div>
              <h3 className="font-semibold text-xl text-black mb-2">My Submissions</h3>
              <p className="text-neutral-600 text-sm">View all your code submissions.</p>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <Code2 className="w-7 h-7 text-green-500" />
              <ArrowRight className="w-6 h-6 text-neutral-400 group-hover:text-green-500 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </Link>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.6 }}
        >
          <Link
            href="/submissions/new"
            className="relative flex flex-col justify-between h-full bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-neutral-200 group"
          >
            <div>
              <h3 className="font-semibold text-xl text-black mb-2">New Submission</h3>
              <p className="text-neutral-600 text-sm">Submit new code for review.</p>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <Code2 className="w-7 h-7 text-green-500" />
              <ArrowRight className="w-6 h-6 text-neutral-400 group-hover:text-green-500 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </Link>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.7 }}
        >
          <Link
            href="/reviews"
            className="relative flex flex-col justify-between h-full bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-neutral-200 group"
          >
            <div>
              <h3 className="font-semibold text-xl text-black mb-2">Start Reviewing</h3>
              <p className="text-neutral-600 text-sm">Earn credits by reviewing code.</p>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <Star className="w-7 h-7 text-green-500" />
              <ArrowRight className="w-6 h-6 text-neutral-400 group-hover:text-green-500 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </Link>
        </motion.div>

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.8 }}
        >
          <Link
            href="/credits"
            className="relative flex flex-col justify-between h-full bg-white rounded-2xl p-8 shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.02] border border-neutral-200 group"
          >
            <div>
              <h3 className="font-semibold text-xl text-black mb-2">Manage Credits</h3>
              <p className="text-neutral-600 text-sm">Stake or purchase DCC credits.</p>
            </div>
            <div className="mt-6 flex items-center justify-between">
              <CreditCard className="w-7 h-7 text-green-500" />
              <ArrowRight className="w-6 h-6 text-neutral-400 group-hover:text-green-500 group-hover:translate-x-1 transition-transform duration-200" />
            </div>
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
