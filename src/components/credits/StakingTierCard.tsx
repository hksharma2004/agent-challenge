import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { StakingTierInfo } from '@/types/schema';
import { StakingTier } from '@/types/enums';
import { formatCredits, formatStakingTier } from '@/types/formatters';
import { Medal, Check } from 'lucide-react';

interface StakingTierCardProps {
  tierInfo: StakingTierInfo;
  currentTier: StakingTier;
  onSelect: (tier: StakingTier) => void; 
}

export function StakingTierCard({ tierInfo, currentTier, onSelect }: StakingTierCardProps) {
  const isCurrentTier = tierInfo.tier === currentTier;
  const tierColors = {
    [StakingTier.BRONZE]: 'text-amber-600', 
    [StakingTier.SILVER]: 'text-slate-400', 
    [StakingTier.GOLD]: 'text-yellow-500', 
  };

  return (
    <div
      className={`
        relative rounded-2xl border border-neutral-200 bg-white/70 p-6 backdrop-blur-sm shadow-sm
        hover:border-green-500 hover:shadow-[0_0_20px_rgba(34,197,94,0.1)] transition-all duration-300
        ${isCurrentTier ? 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.1)] scale-[1.02]' : ''}
        transform hover:scale-[1.02] cursor-pointer group
      `}
      onClick={() => onSelect(tierInfo.tier)}
    >
      {isCurrentTier && (
        <div className="absolute top-3 right-3 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
      )}
      <CardHeader className="p-0 pb-4">
        <div className="flex items-center justify-center mb-4">
          <Medal className={`h-12 w-12 ${tierColors[tierInfo.tier]} group-hover:text-green-500 transition-colors`} />
        </div>
        <CardTitle className="text-center text-lg font-semibold text-neutral-800">
          {formatStakingTier(tierInfo.tier)}
        </CardTitle>
        <CardDescription className="text-center text-neutral-500 text-sm">
          {formatCredits(tierInfo.requiredAmount)} DCC
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="list-disc ml-4 text-neutral-600 leading-relaxed space-y-1">
          {tierInfo.benefits.map((benefit, index) => (
            <li key={index} className="text-sm">
              {benefit}
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="p-0 pt-6">
        <Button
          variant={isCurrentTier ? 'default' : 'outline'}
          className={`w-full ${isCurrentTier ? 'bg-green-500 hover:bg-green-600 text-white' : 'border-neutral-300 text-neutral-600 hover:border-green-500 hover:text-green-600'}`}
          onClick={(e) => {
            e.stopPropagation(); 
            onSelect(tierInfo.tier);
          }}
          disabled={isCurrentTier}
        >
          {isCurrentTier ? 'Current Tier' : `Select ${formatStakingTier(tierInfo.tier)}`}
        </Button>
      </CardFooter>
    </div>
  );
}
