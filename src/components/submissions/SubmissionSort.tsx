"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowDownUp } from 'lucide-react'; 
interface SubmissionSortProps {
  onSortChange: (sort: { by: string; order: 'asc' | 'desc' }) => void;
}

export const SubmissionSort: React.FC<SubmissionSortProps> = ({ onSortChange }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'newest');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>((searchParams.get('order') as 'asc' | 'desc') || 'desc');

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set('sort', sortBy);
    newSearchParams.set('order', sortOrder);
    router.push(`?${newSearchParams.toString()}`, { scroll: false });
    onSortChange({ by: sortBy, order: sortOrder });
  }, [sortBy, sortOrder, router, onSortChange, searchParams]);

  const handleSortByChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
  };

  const toggleSortOrder = () => {
    setSortOrder(prev => (prev === 'asc' ? 'desc' : 'asc'));
  };

  return (
    <div className="flex items-center gap-2">
      <select
        className="p-3 border border-black bg-white text-black focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent transition-all duration-200"
        value={sortBy}
        onChange={handleSortByChange}
      >
        <option value="newest">Newest</option>
        <option value="oldest">Oldest</option>
        <option value="recently-updated">Recently Updated</option>
        <option value="most-discussed">Most Discussed</option>
      </select>
      <button
        onClick={toggleSortOrder}
        className="p-3 border border-black bg-white text-black hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-neon-green focus:border-transparent transition-all duration-200"
      >
        <ArrowDownUp size={20} className={sortOrder === 'asc' ? 'rotate-180' : ''} />
      </button>
    </div>
  );
};
