"use client";

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { X, Search, ChevronDown } from 'lucide-react';

interface SubmissionFiltersProps {
  onFilterChange: (filters: any) => void;
}

export const SubmissionFilters: React.FC<SubmissionFiltersProps> = ({ onFilterChange }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [languageFilter, setLanguageFilter] = useState(searchParams.get('lang') || 'All Languages');
  const [statusFilter, setStatusFilter] = useState<string[]>(searchParams.get('status')?.split(',') || []);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isStatusDropdownOpen, setIsStatusDropdownOpen] = useState(false);

  const languageSelectRef = useRef<HTMLSelectElement>(null);
  const statusSelectRef = useRef<HTMLSelectElement>(null);

  useEffect(() => {
    const currentFilters: string[] = [];
    if (searchTerm) currentFilters.push(`Search: ${searchTerm}`);
    if (languageFilter !== 'All Languages') currentFilters.push(`Language: ${languageFilter}`);
    statusFilter.forEach(status => currentFilters.push(`Status: ${status}`));
    
    if (JSON.stringify(currentFilters) !== JSON.stringify(activeFilters)) {
      setActiveFilters(currentFilters);
    }

    const newSearchParams = new URLSearchParams();
    if (searchTerm) newSearchParams.set('search', searchTerm);
    if (languageFilter !== 'All Languages') newSearchParams.set('lang', languageFilter);
    if (statusFilter.length > 0) newSearchParams.set('status', statusFilter.join(','));
    
    const tab = searchParams.get('tab');
    if (tab) newSearchParams.set('tab', tab);

    const newQueryString = newSearchParams.toString();
    const currentQueryString = searchParams.toString();

    if (newQueryString !== currentQueryString) {
      router.push(`?${newQueryString}`, { scroll: false });
    }
    onFilterChange({ searchTerm, languageFilter, statusFilter });
  }, [searchTerm, languageFilter, statusFilter, router, onFilterChange, searchParams, activeFilters]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguageFilter(e.target.value);
    setIsLanguageDropdownOpen(false);
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setStatusFilter(prev =>
      prev.includes(value) ? prev.filter(s => s !== value) : [...prev, value]
    );
    setIsStatusDropdownOpen(false);
  };

  const removeFilter = (filterToRemove: string) => {
    if (filterToRemove.startsWith('Search:')) {
      setSearchTerm('');
    } else if (filterToRemove.startsWith('Language:')) {
      setLanguageFilter('All Languages');
    } else if (filterToRemove.startsWith('Status:')) {
      const status = filterToRemove.replace('Status: ', '');
      setStatusFilter(prev => prev.filter(s => s !== status));
    }
  };

  return (
    <div className="space-y-6 bg-[#F9FAFB] p-4 rounded-lg">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-grow">

          <div className="relative flex-grow max-w-xs">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 transition-colors duration-200 ${isSearchFocused ? 'text-[#16FF6E]' : 'text-[#6B7280]'}`} />
            <input
              type="text"
              placeholder="Search submissions..."
              className="w-full p-3 pl-10 border border-[#E5E7EB] bg-white text-[#111111] placeholder-[#6B7280] focus:outline-none focus:ring-2 focus:ring-[#16FF6E] focus:shadow-[0_2px_12px_rgba(0,0,0,0.05)] rounded-lg transition-all duration-200"
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setIsSearchFocused(true)}
              onBlur={() => setIsSearchFocused(false)}
            />
          </div>


          <div className="relative">
            <select
              ref={languageSelectRef}
              className="appearance-none p-3 pr-8 border border-[#E5E7EB] bg-white text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#16FF6E] focus:shadow-[0_2px_12px_rgba(0,0,0,0.05)] rounded-lg transition-all duration-200"
              value={languageFilter}
              onChange={handleLanguageChange}
              onFocus={() => setIsLanguageDropdownOpen(true)}
              onBlur={() => setIsLanguageDropdownOpen(false)}
            >
              <option>All Languages</option>
              <option>JavaScript</option>
              <option>Python</option>
              <option>TypeScript</option>
              <option>C++</option>
              <option>Java</option>
            </select>
            <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 pointer-events-none transition-colors duration-200 ${isLanguageDropdownOpen ? 'text-[#16FF6E]' : 'text-[#6B7280]'}`} />
          </div>


          <div className="relative">
            <select
              ref={statusSelectRef}
              className="appearance-none p-3 pr-8 border border-[#E5E7EB] bg-white text-[#111111] focus:outline-none focus:ring-2 focus:ring-[#16FF6E] focus:shadow-[0_2px_12px_rgba(0,0,0,0.05)] rounded-lg transition-all duration-200"
              value={statusFilter.length > 0 ? statusFilter[0] : ''}
              onChange={handleStatusChange}
              onFocus={() => setIsStatusDropdownOpen(true)}
              onBlur={() => setIsStatusDropdownOpen(false)}
            >
              <option value="">Status</option>
              <option value="Open">Open</option>
              <option value="In Review">In Review</option>
              <option value="Completed">Completed</option>
              <option value="Needs Review">Needs Review</option>
            </select>
            <ChevronDown className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 pointer-events-none transition-colors duration-200 ${isStatusDropdownOpen ? 'text-[#16FF6E]' : 'text-[#6B7280]'}`} />
          </div>
        </div>
      </div>


      {activeFilters.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {activeFilters.map((filter, index) => (
            <div
              key={index}
              className="flex items-center bg-white border border-[#E5E7EB] text-[#111111] px-3 py-1 text-sm rounded-full"
            >
              {filter}
              <button
                onClick={() => removeFilter(filter)}
                className="ml-2 text-[#6B7280] hover:text-[#16FF6E] focus:outline-none"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
