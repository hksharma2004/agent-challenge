import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { MessageCircle, Star } from 'lucide-react';
import { SubmissionStatus } from '@/types/enums';

interface SubmissionCardProps {
  submission: {
    id: string;
    title: string;
    description: string;
    language: string;
    author: {
      name: string;
      avatarUrl: string;
    };
    status: SubmissionStatus;
    createdAt: string;
    updatedAt: string;
    commentsCount: number;
    reviewsCount: number;
    tags?: readonly string[]; // Added tags to submission prop
  };
}

const getStatusClasses = (status: SubmissionStatus) => {
  switch (status) {
    case SubmissionStatus.ANALYZING:
      return 'bg-gray-50 text-gray-600 border border-gray-200';
    case SubmissionStatus.AWAITING_REVIEW:
      return 'bg-red-50 text-red-600 border border-red-200'; // Needs Review
    case SubmissionStatus.UNDER_REVIEW:
      return 'bg-yellow-50 text-yellow-600 border border-yellow-200'; // In Review
    case SubmissionStatus.REVIEWED:
      return 'bg-[#16FF6E]/10 text-[#16FF6E] border border-[#16FF6E]/30'; // Completed
    default:
      return 'bg-gray-50 text-gray-600 border border-gray-200';
  }
};

const getStatusDisplayName = (status: SubmissionStatus) => {
  switch (status) {
    case SubmissionStatus.ANALYZING:
      return 'Analyzing';
    case SubmissionStatus.AWAITING_REVIEW:
      return 'Needs Review';
    case SubmissionStatus.UNDER_REVIEW:
      return 'In Review';
    case SubmissionStatus.REVIEWED:
      return 'Completed';
    default:
      return status;
  }
};

export const SubmissionCard: React.FC<SubmissionCardProps> = ({ submission }) => {
  return (
    <div className="flex flex-col justify-between rounded-2xl border bg-white shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-200 h-full p-6 min-h-[340px]">
      <Link href={`/submissions/${submission.id}`} passHref className="flex flex-col justify-between h-full">
        <div className="flex flex-col gap-3 flex-grow">

          <h3 className="text-lg font-semibold leading-tight line-clamp-2">{submission.title}</h3>


          <p className="text-sm text-gray-500 line-clamp-2">{submission.description}</p>


          {submission.tags?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {submission.tags.map((tag, index) => (
                <span key={index} className="px-2 py-1 text-xs bg-gray-100 rounded-full">{tag}</span>
              ))}
            </div>
          )}
        </div>


        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center">
            <Image
              src={submission.author.avatarUrl || '/placeholder-user.jpg'}
              alt={submission.author.name}
              width={24}
              height={24}
              className="rounded-full border border-gray-200"
            />
            <span className="ml-2 text-sm text-gray-700 font-medium">{submission.author.name}</span>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusClasses(submission.status)}`}>
            {getStatusDisplayName(submission.status)}
          </span>
        </div>


        <div className="flex items-center justify-between text-gray-400 text-sm mt-4">
          <div className="flex items-center gap-3">
            <span className="flex items-center"><MessageCircle size={16} className="mr-1" />{submission.commentsCount}</span>
            <span className="flex items-center"><Star size={16} className="mr-1" />{submission.reviewsCount}</span>
          </div>
          <p className="text-xs">Updated: {new Date(submission.updatedAt).toLocaleDateString('en-US')}</p>
        </div>
      </Link>
    </div>
  );
};
