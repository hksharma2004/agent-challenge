'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Lock, Wallet } from 'lucide-react'; 
import { formatDistanceToNow } from 'date-fns';
import type { CreditTransaction } from '@/types/schema';
import { TransactionType } from '@/types/enums';

interface TransactionListProps {
  transactions: CreditTransaction[];
}

const transactionIcons = {
  [TransactionType.STAKED]: <Lock className="h-4 w-4 text-blue-500" />,
  [TransactionType.UNSTAKED]: <Lock className="h-4 w-4 text-green-500" />,
  [TransactionType.EARNED]: <ArrowUp className="h-4 w-4 text-green-500" />,
  [TransactionType.SPENT]: <ArrowDown className="h-4 w-4 text-red-500" />,
};

export function TransactionList({ transactions }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 text-neutral-500 py-8 text-center shadow-sm">
        <Wallet className="mx-auto h-12 w-12 text-neutral-400 mb-4" />
        <p className="text-lg font-medium">No transactions yet.</p>
        <p className="text-sm text-neutral-400">Your activity will appear here.</p>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white/70 backdrop-blur-sm p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-black tracking-tight mb-4">Recent Transactions</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-200">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-neutral-500 text-sm uppercase tracking-wide">Type</th>
              <th className="px-4 py-2 text-left text-neutral-500 text-sm uppercase tracking-wide">Description</th>
              <th className="px-4 py-2 text-left text-neutral-500 text-sm uppercase tracking-wide">Amount</th>
              <th className="px-4 py-2 text-left text-neutral-500 text-sm uppercase tracking-wide">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200">
            {transactions.map((tx, index) => {
              const isSuccess = tx.amount > 0; 
              return (
                <tr key={tx.id} className={index % 2 === 0 ? 'even:bg-neutral-50/50' : ''}>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-800 flex items-center gap-2">
                    {isSuccess && <span className="h-2 w-2 bg-green-500 rounded-full" />}
                    {transactionIcons[tx.type]}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-800">{tx.description}</td>
                  <td className={`px-4 py-3 whitespace-nowrap text-sm font-mono ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {tx.amount > 0 ? '+' : ''}
                    {tx.amount} DCC
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-sm text-neutral-500">
                    {formatDistanceToNow(tx.timestamp, { addSuffix: true })}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
