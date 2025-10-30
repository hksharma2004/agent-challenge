'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'; // Import Accordion components
import { Sparkles } from 'lucide-react'; 

interface BenefitsTrackerProps {
  benefits: string[];
}

export function BenefitsTracker({ benefits }: BenefitsTrackerProps) {
  return (
    <div className="rounded-2xl border border-neutral-200 bg-white/70 p-6 hover:shadow-md transition">
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1" className="border-b-0">
          <AccordionTrigger className="flex items-center justify-between text-lg font-semibold text-black tracking-tight hover:no-underline">
            <div className="flex items-center gap-3">
              <Sparkles className="h-6 w-6 text-green-500" />
              Your Active Benefits
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-4">
            {benefits.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {benefits.map((benefit) => (
                  <span key={benefit} className="px-3 py-1 rounded-full bg-green-50 text-green-700 text-sm font-medium">
                    {benefit}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-neutral-500 text-sm">You have no active benefits. Stake credits to unlock more features!</p>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
