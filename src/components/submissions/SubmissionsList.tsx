"use client";

import { useState, useEffect } from 'react';
import type { CodeSubmission } from '@/types/schema';
import { SubmissionCard } from './SubmissionCard';
import Link from 'next/link';
import { ProgrammingLanguage, SubmissionStatus } from '@/types/enums';
import { FolderOpenDot } from 'lucide-react'; // For empty state icon

interface SubmissionsListProps {
  filters: {
    searchTerm?: string;
    languageFilter?: string;
    statusFilter?: string[];
  };
  activeTab: string;
}

// Mock Data (replace with actual API call later)
const mockSubmissions: CodeSubmission[] = [
  {
    id: 'sub1',
    title: 'Decentralized Voting System',
    description: 'A secure and transparent voting system built on blockchain.',
    language: ProgrammingLanguage.KOTLIN, 
    authorId: 'user1',
    author: { name: 'Arjun Mehta', avatarUrl: '/placeholder-user.jpg' },
    status: SubmissionStatus.AWAITING_REVIEW,
    createdAt: '2023-10-26T10:00:00Z',
    updatedAt: '2023-10-27T11:30:00Z',
    commentsCount: 5,
    reviewsCount: 2,
    repoUrl: 'https://github.com/example/repo1',
    tags: ['blockchain', 'voting'], 
  },
  {
    id: 'sub2',
    title: 'AI-Powered Code Reviewer',
    description: 'An AI agent that automates code review processes.',
    language: ProgrammingLanguage.PYTHON,
    authorId: 'user2',
    author: { name: 'Rohan Sharma', avatarUrl: '/placeholder-user.jpg' },
    status: SubmissionStatus.UNDER_REVIEW,
    createdAt: '2023-10-25T14:00:00Z',
    updatedAt: '2023-10-28T09:00:00Z',
    commentsCount: 12,
    reviewsCount: 4,
    repoUrl: 'https://github.com/example/repo2',
    tags: ['ai', 'code-review'], // Added tags
  },
  {
    id: 'sub3',
    title: 'E-commerce Microservices',
    description: 'Scalable e-commerce platform using microservices architecture.',
    language: ProgrammingLanguage.TYPESCRIPT,
    authorId: 'user1',
    author: { name: 'Karan Patel', avatarUrl: '/placeholder-user.jpg' },
    status: SubmissionStatus.REVIEWED,
    createdAt: '2023-10-20T09:00:00Z',
    updatedAt: '2023-10-22T16:00:00Z',
    commentsCount: 8,
    reviewsCount: 3,
    repoUrl: 'https://github.com/example/repo3',
    tags: ['ecommerce', 'microservices'], 
  },
  {
    id: 'sub4',
    title: 'Real-time Chat Application',
    description: 'A real-time chat application with WebSockets and React.',
    language: ProgrammingLanguage.JAVASCRIPT,
    authorId: 'user3',
    author: { name: 'Aditya Rao', avatarUrl: '/placeholder-user.jpg' },
    status: SubmissionStatus.ANALYZING,
    createdAt: '2023-10-29T11:00:00Z',
    updatedAt: '2023-10-29T11:00:00Z',
    commentsCount: 1,
    reviewsCount: 0,
    repoUrl: 'https://github.com/example/repo4',
    tags: ['chat', 'websocket', 'react'], 
  },
  {
    id: 'sub5',
    title: 'Submission by Vikram Nair',
    description: 'A submission from Vikram Nair.',
    language: ProgrammingLanguage.TYPESCRIPT,
    authorId: 'user_vikram',
    author: { name: 'Vikram Nair', avatarUrl: '/placeholder-user.jpg' },
    status: SubmissionStatus.AWAITING_REVIEW,
    createdAt: '2023-10-30T12:00:00Z',
    updatedAt: '2023-10-30T12:00:00Z',
    commentsCount: 0,
    reviewsCount: 0,
    repoUrl: 'https://github.com/example/vikram-repo',
    tags: ['typescript'],
  },
  {
    id: 'sub6',
    title: 'Submission by Sandeep Verma',
    description: 'A submission from Sandeep Verma.',
    language: ProgrammingLanguage.PYTHON,
    authorId: 'user_sandeep',
    author: { name: 'Sandeep Verma', avatarUrl: '/placeholder-user.jpg' },
    status: SubmissionStatus.UNDER_REVIEW,
    createdAt: '2023-10-31T13:00:00Z',
    updatedAt: '2023-10-31T13:00:00Z',
    commentsCount: 0,
    reviewsCount: 0,
    repoUrl: 'https://github.com/example/sandeep-repo',
    tags: ['python'],
  },
];

export function SubmissionsList({ filters, activeTab }: SubmissionsListProps) {
  const { searchTerm, languageFilter, statusFilter } = filters;

  const [submissions, setSubmissions] = useState<CodeSubmission[]>(mockSubmissions); // Using mock data for now


  useEffect(() => {

    const fetchFilteredSubmissions = () => {
      let filtered = mockSubmissions.filter((submission) => {
        const matchesSearch =
          (!searchTerm || submission.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (submission.description && submission.description.toLowerCase().includes(searchTerm.toLowerCase())));
        
        const matchesLanguage =
          (!languageFilter || languageFilter === 'All Languages' || submission.language === languageFilter);
        
        const matchesStatus =
          (!statusFilter || statusFilter.length === 0 || statusFilter.includes(submission.status));


        let matchesTab = true;
        if (activeTab === 'my') {

          matchesTab = submission.authorId === 'user1'; 
        } else if (activeTab === 'pending') {
          matchesTab = submission.status === SubmissionStatus.AWAITING_REVIEW;
        }

        return matchesSearch && matchesLanguage && matchesStatus && matchesTab;
      });

      setSubmissions(filtered);
    };

    fetchFilteredSubmissions();
  }, [filters, activeTab, searchTerm, languageFilter, statusFilter]);


  return (
    <>
      {submissions.map((submission) => (
        <SubmissionCard
          key={submission.id}
          submission={submission}
        />
      ))}
    </>
  );
}
