import { TransactionType } from './enums';

export interface CreditTransaction {
  id: string;
  userId?: string; 
  amount: number;
  type: TransactionType;
  description: string;
  timestamp: Date;
  balanceAfter: number;
}

export interface ServerToClientEvents {
  credit_balance_updated: (data: { available: number; staked: number; tier: string }) => void;
  transaction_added: (transaction: CreditTransaction) => void;
  staking_tier_changed: (data: { oldTier: string; newTier: string; stakedAmount: number }) => void;
  analysis_completed: (data: { submissionId: string; score: number }) => void;
  reputation_changed: (data: { userId: string; change: number; reason: string }) => void;
}
