'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSocket } from './useSocket';
import { CreditTransaction } from '@/types/socket-events';

interface CreditState {
  available: number;
  staked: number;
  tier: string;
  transactions: CreditTransaction[];
}

export const useCreditsSocket = (initialState: CreditState) => {
  const { socket } = useSocket();
  const [credits, setCredits] = useState<CreditState>(initialState);

  useEffect(() => {
    if (!socket) return;

    const handleCreditUpdate = (data: { available: number; staked: number; tier: string }) => {
      setCredits((prev) => ({ ...prev, ...data }));
    };

    const handleTransactionAdded = (transaction: CreditTransaction) => {
      setCredits((prev) => ({
        ...prev,
        transactions: [transaction, ...prev.transactions],
      }));
    };
    
    const handleStakingTierChanged = (data: { oldTier: string; newTier: string; stakedAmount: number }) => {

    };

    socket.on('credit_balance_updated', handleCreditUpdate);
    socket.on('transaction_added', handleTransactionAdded);
    socket.on('staking_tier_changed', handleStakingTierChanged);

    return () => {
      socket.off('credit_balance_updated', handleCreditUpdate);
      socket.off('transaction_added', handleTransactionAdded);
      socket.off('staking_tier_changed', handleStakingTierChanged);
    };
  }, [socket]);

  const optimisticUpdate = useCallback((action: 'stake' | 'unstake', amount: number) => {
    // Implement optimistic update logic here
  }, []);

  return { credits, optimisticUpdate };
};
