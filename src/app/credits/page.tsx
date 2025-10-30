'use client';

import { useState, useEffect } from 'react';
import { motion } from "framer-motion";
import { useCreditsSocket } from '@/hooks/useCreditsSocket';
import { CreditBalanceCards } from '@/components/credits/CreditBalanceCards';
import { StakingInterface } from '@/components/credits/StakingInterface';
import { TransactionList } from '@/components/credits/TransactionList';
import { BenefitsTracker } from '@/components/credits/BenefitsTracker';
import { StakingTierCard } from '@/components/credits/StakingTierCard';
import { TopNavBar } from '@/components/navigation/TopNavBar';
import type { UserProfile } from '@/types/schema';
import { StakingTier } from '@/types/enums';

const cardVariants = {
  hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
  visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.0 } },
};

export default function CreditsPage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [initialData, setInitialData] = useState({
    balance: { available: 0, staked: 0 },
    transactions: [],
    benefits: [],
    tier: StakingTier.BRONZE,
    loading: true,
  });

  async function fetchInitialData() {
    try {
      const [userRes, balanceRes, transactionsRes, benefitsRes] = await Promise.all([

        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            id: '1',
            username: 'Alice',
            email: 'alice@example.com',
            avatar_url: '/public/placeholder-user.jpg',
            reputation: 1200,
            level: 'Gold',
            creditsavailable: 500,
            creditsstaked: 1000,
            stakingTier: StakingTier.GOLD,
            totalReviewsGiven: 50,
            totalReviewsReceived: 20,
            totalSubmissions: 0,
            averageReviewScore: 4.5,
            joinedDate: new Date(),
          })
        }),
        fetch('/api/credits/balance'),
        fetch('/api/credits/transactions?limit=5'),
        fetch('/api/credits/benefits'),
      ]);

      const userData = await userRes.json();
      setUser(userData);

      const balanceData = balanceRes.ok ? await balanceRes.json() : { available: 0, staked: 0 };
      const transactionsData = transactionsRes.ok ? await transactionsRes.json() : [];
      const benefitsData = benefitsRes.ok ? await benefitsRes.json() : [];

      setInitialData({
        balance: balanceData,
        transactions: transactionsData,
        benefits: benefitsData,
        tier: userData.stakingTier as StakingTier,
        loading: false,
      });
    } catch (error) {
      console.error('Failed to fetch initial credits data:', error);
      setInitialData(prev => ({ ...prev, loading: false }));
    }
  }

  useEffect(() => {
    fetchInitialData();
  }, []);

  const { credits } = useCreditsSocket({
    available: initialData.balance.available,
    staked: initialData.balance.staked,
    tier: initialData.tier,
    transactions: initialData.transactions,
  });

  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (initialData.loading) {
    return (
      <>
        <TopNavBar />
        <div className="max-w-6xl mx-auto px-8 py-12 text-center">Loading credits data...</div>
      </>
    );
  }
  
  return (
    <>
      <TopNavBar />
      <div
        className={`max-w-6xl mx-auto px-8 py-12 space-y-12 transition-all duration-700 ease-out ${
          hasMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        <motion.section
          className="space-y-6"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-3xl font-semibold text-black tracking-tight">Credits Overview</h2>
          <CreditBalanceCards balance={{ ...credits, total: credits.available + credits.staked }} />
        </motion.section>

        <motion.section
          className="space-y-6"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-3xl font-semibold text-black tracking-tight">Choose Your Tier</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StakingTierCard
              tierInfo={{ tier: StakingTier.BRONZE, requiredAmount: 1000, benefits: ['Basic analytics', 'Community support'] }}
              currentTier={credits.tier}
              onSelect={() => {}}
            />
            <StakingTierCard
              tierInfo={{ tier: StakingTier.SILVER, requiredAmount: 5000, benefits: ['Advanced analytics', 'Priority support', 'Beta feature access'] }}
              currentTier={credits.tier}
              onSelect={() => {}}
            />
            <StakingTierCard
              tierInfo={{ tier: StakingTier.GOLD, requiredAmount: 10000, benefits: ['Premium analytics', 'Dedicated support', 'Exclusive feature access', 'Early access to new tools'] }}
              currentTier={credits.tier}
              onSelect={() => {}}
            />
          </div>
        </motion.section>

        <motion.section
          className="space-y-6"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-3xl font-semibold text-black tracking-tight">Staking Controls</h2>
          <StakingInterface availableCredits={credits.available} onStakingUpdate={() => {}} />
        </motion.section>

        <motion.section
          className="space-y-6"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-3xl font-semibold text-black tracking-tight">Recent Transactions</h2>
          <TransactionList transactions={credits.transactions} />
        </motion.section>

        <motion.section
          className="space-y-6"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.5 }}
        >
          <h2 className="text-3xl font-semibold text-black tracking-tight">Your Active Benefits</h2>
          <BenefitsTracker benefits={initialData.benefits} />
        </motion.section>
      </div>
    </>
  );
}
