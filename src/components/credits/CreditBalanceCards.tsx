'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Diamond, Bolt, TrendingUp } from 'lucide-react';
import { NumberTicker } from '@/components/animations/number-ticker'; 

interface CreditBalanceCardsProps {
  balance: {
    available: number;
    staked: number;
    total: number;
  };
}

const GlowingUnderline = () => (
  <span className="relative inline-block">
    DCC
    <span className="absolute left-0 right-0 bottom-0 h-[1px] bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
  </span>
);

export function CreditBalanceCards({ balance }: CreditBalanceCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Available Credits Card */}
      <div className="group rounded-2xl border border-neutral-200 bg-white/70 backdrop-blur-sm p-6 flex flex-col justify-between hover:shadow-md hover:border-green-400 transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-neutral-500 uppercase text-xs">Available Credits</h3>
          <div className="bg-green-50 text-green-600 w-8 h-8 flex items-center justify-center rounded-full">
            <Diamond className="h-4 w-4" />
          </div>
        </div>
        <div className="text-4xl font-semibold text-black tracking-tight font-mono">
          <NumberTicker value={balance.available} /> <GlowingUnderline />
        </div>
      </div>

      {/* Staked Credits Card */}
      <div className="group rounded-2xl border border-neutral-200 bg-white/70 backdrop-blur-sm p-6 flex flex-col justify-between hover:shadow-md hover:border-green-400 transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-neutral-500 uppercase text-xs">Staked Credits</h3>
          <div className="bg-green-50 text-green-600 w-8 h-8 flex items-center justify-center rounded-full">
            <Bolt className="h-4 w-4" />
          </div>
        </div>
        <div className="text-4xl font-semibold text-black tracking-tight font-mono">
          <NumberTicker value={balance.staked} /> <GlowingUnderline />
        </div>
      </div>

      {/* Total Credits Card */}
      <div className="group rounded-2xl border border-neutral-200 bg-white/70 backdrop-blur-sm p-6 flex flex-col justify-between hover:shadow-md hover:border-green-400 transition-all duration-300">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-neutral-500 uppercase text-xs">Total Credits</h3>
          <div className="bg-green-50 text-green-600 w-8 h-8 flex items-center justify-center rounded-full">
            <TrendingUp className="h-4 w-4" />
          </div>
        </div>
        <div className="text-4xl font-semibold text-black tracking-tight font-mono">
          <NumberTicker value={balance.total} /> <GlowingUnderline />
        </div>
      </div>
    </div>
  );
}
