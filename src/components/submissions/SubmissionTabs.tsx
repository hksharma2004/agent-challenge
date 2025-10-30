"use client";

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

interface SubmissionTabsProps {
  initialTab?: string;
}

export const SubmissionTabs: React.FC<SubmissionTabsProps> = ({ initialTab = 'all' }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(initialTab);

  const handleTabClick = (tab: string) => {
    setActiveTab(tab);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('tab', tab);
    router.push(`?${newSearchParams.toString()}`, { scroll: false });
  };

  const getTabClasses = (tab: string) => {
    const isActive = activeTab === tab;
    return `
      relative px-6 py-2 rounded-full text-base font-semibold transition-all duration-150 ease-in-out
      ${isActive
        ? 'bg-[#16FF6E] text-black font-semibold shadow-[0_0_10px_rgba(22,255,110,0.3)]'
        : 'bg-white text-[#6B7280] border border-[#E5E7EB]'}
      focus:outline-none focus:ring-2 focus:ring-[#16FF6E] focus:ring-offset-2 focus:ring-offset-[#F9FAFB]
    `;
  };

  return (
    <div className="mb-8 flex gap-x-6 overflow-x-auto">
      <button
        className={getTabClasses('all')}
        onClick={() => handleTabClick('all')}
      >
        All Submissions
      </button>
      <button
        className={getTabClasses('my')}
        onClick={() => handleTabClick('my')}
      >
        My Submissions
      </button>
      <button
        className={getTabClasses('pending')}
        onClick={() => handleTabClick('pending')}
      >
        Pending Review
      </button>
    </div>
  );
};
