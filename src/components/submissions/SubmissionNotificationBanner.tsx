"use client";

import React from 'react';
import Link from 'next/link';

interface SubmissionNotificationBannerProps {
  count: number;
}

export const SubmissionNotificationBanner: React.FC<SubmissionNotificationBannerProps> = ({ count }) => {
  if (count === 0) {
    return null;
  }

  return (
    <div className="border border-black bg-[#F8F8F8] p-4 mb-8 flex items-center justify-between text-sm font-bold rounded-[8px]">
      <p>You have {count} submissions awaiting review. <Link href="?tab=pending" className="underline hover:no-underline">Jump to pending reviews</Link></p>
    </div>
  );
};
