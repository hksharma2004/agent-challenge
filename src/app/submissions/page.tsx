'use client';

import React, { useEffect, useState, useCallback, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from "framer-motion";
import { TopNavBar } from '@/components/navigation/TopNavBar';
import { SubmissionFilters } from '@/components/submissions/SubmissionFilters';
import { SubmissionNotificationBanner } from '@/components/submissions/SubmissionNotificationBanner';
import { SubmissionsList } from '@/components/submissions/SubmissionsList';
import { SubmissionTabs } from '@/components/submissions/SubmissionTabs';

function SubmissionsContent() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'all';

  const [filters, setFilters] = useState<{
    searchTerm: string;
    languageFilter: string;
    statusFilter: string[];
  }>({
    searchTerm: searchParams.get('search') || '',
    languageFilter: searchParams.get('lang') || 'All Languages',
    statusFilter: searchParams.get('status')?.split(',') || [],
  });
  const [activeTab, setActiveTab] = useState<string>(initialTab);

  const cardVariants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(10px)' },
    visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 1.0 } },
  };

  useEffect(() => {
    setActiveTab(searchParams.get('tab') || 'all');
  }, [searchParams]);

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
    console.log('Filters changed:', newFilters);
  }, []);

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111111]">
      <TopNavBar />
      <div className="pt-16 pb-8 px-12 mx-auto max-w-7xl">

        <motion.div
          className="mb-8"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.1 }}
        >
          <h1 className="text-[36px] font-bold text-[#111111] leading-none relative pb-2">
            Submissions
            <span className="absolute bottom-0 left-0 w-10 h-[3px] bg-accent-neon-green rounded-sm"></span>
          </h1>
          <p className="text-base text-[#6B7280] mt-2">Manage, review, and track all submitted projects at a glance.</p>
          <div className="flex justify-end mt-4">
            <Link href="/submissions/new">
              <button className="bg-[#16FF6E] text-black font-semibold rounded-xl px-5 py-2 shadow-md hover:shadow-lg transition-all">
                + New Submission
              </button>
            </Link>
          </div>
        </motion.div>


        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.2 }}
        >
          <SubmissionTabs initialTab={activeTab} />
        </motion.div>


        <motion.div
          className="mb-8 pb-8 relative"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: 0.3 }}
        >
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-accent-neon-green to-transparent"></div>
          <SubmissionFilters onFilterChange={handleFilterChange} />
        </motion.div>


        {activeTab === 'pending' && (
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <SubmissionNotificationBanner count={5} />
          </motion.div>
        )}


        <motion.div
          className="grid grid-cols-4 gap-8 auto-rows-[1fr]"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: activeTab === 'pending' ? 0.5 : 0.4 }}
        >
          <SubmissionsList filters={filters} activeTab={activeTab} />
        </motion.div>

        {/* Footer or Link Section */}
        <motion.div
          className="flex justify-end mt-8"
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          transition={{ delay: activeTab === 'pending' ? 0.6 : 0.5 }}
        >
          <button
            onClick={() => navigator.clipboard.writeText(window.location.href)}
            className="flex items-center text-[#6B7280] hover:text-[#16FF6E] transition-colors text-sm"
          >
            <span className="mr-1">🔗</span> Link to this view
          </button>
        </motion.div>
      </div>
    </div>
  );
}

export default function SubmissionsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#16FF6E] mx-auto"></div>
          <p className="mt-4 text-[#6B7280]">Loading submissions...</p>
        </div>
      </div>
    }>
      <SubmissionsContent />
    </Suspense>
  );
}