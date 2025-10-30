'use client';

import { useState } from 'react';
import { io } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProgressBar } from '@/components/ui/ProgressBar'; 

interface StakingInterfaceProps {
  availableCredits: number;
  onStakingUpdate: () => void;
}

export function StakingInterface({ availableCredits, onStakingUpdate }: StakingInterfaceProps) {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleStake = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/credits/stake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseInt(amount) }),
      });
      if (!response.ok) {
        throw new Error('Staking failed');
      }
      onStakingUpdate();
      const socket = io('http://localhost:3001');
      socket.emit('credit_update');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleUnstake = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await fetch('/api/credits/unstake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseInt(amount) }),
      });
      if (!response.ok) {
        throw new Error('Unstaking failed');
      }
      onStakingUpdate();
      const socket = io('http://localhost:3001');
      socket.emit('credit_update');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white/60 p-6 backdrop-blur-sm shadow-sm">
      <label htmlFor="stake-amount" className="text-neutral-700 font-medium text-base block mb-4">
        Enter amount to stake or unstake
      </label>
      <Input
        id="stake-amount"
        type="number"
        placeholder="e.g., 1000 DCC"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min="100"
        step="100"
        className="rounded-xl border border-neutral-200 bg-neutral-50 focus:border-green-500 focus:ring-2 focus:ring-green-300 transition mb-4"
      />
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <div className="flex gap-4">
        <Button
          onClick={handleStake}
          disabled={loading || !amount}
          className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-xl shadow-md transition-all duration-300"
        >
          {loading ? 'Staking...' : 'Stake Credits'}
        </Button>
        <Button
          onClick={handleUnstake}
          variant="outline"
          disabled={loading || !amount}
          className="border border-neutral-300 text-neutral-600 hover:border-green-500 hover:text-green-600 transition px-6 py-2 rounded-xl"
        >
          {loading ? 'Unstaking...' : 'Unstake'}
        </Button>
      </div>
      {loading && (
        <div className="mt-4 animate-pulse bg-green-400 h-[2px] w-full rounded-full" />
      )}
    </div>
  );
}
