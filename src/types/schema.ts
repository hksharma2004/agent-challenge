import type { 
  ReviewStatus, 
  SubmissionStatus, 
  ActivityType,
  ProgrammingLanguage,
  CategoryType 
} from './enums';


export interface DashboardProps {
  currentUser: UserProfile;
  recentActivities: Activity[];
  quickStats: QuickStats;
}

export interface UserProfile {
  id: string;
  username: string | null;
  avatar_url: string | null;
  email: string;
  reputation: number;
  level: string;
  totalReviewsGiven: number;
  totalReviewsReceived: number;
  totalSubmissions: number; 
  averageReviewScore: number;
  joinedDate: Date;
}

export interface QuickStats {
  reputationScore: number;
  totalReviewsGiven: number;
  totalReviewsReceived: number;
  averageReviewScore: number;
}

export interface Activity {
  id: string;
  type: ActivityType;
  message: string;
  timestamp: Date;
  relatedUser?: string;
  submissionId?: string;
}

export interface CodeSubmission {
  id: string;
  title: string;
  description: string;
  repoUrl: string;
  language: ProgrammingLanguage;
  tags: readonly string[];
  status: SubmissionStatus;
  authorId: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  createdAt: string; 
  updatedAt: string; 
  commentsCount: number; 
  reviewsCount: number; 
  overallScore?: number;
  categoryScores?: CategoryScores;
  aiInsights?: readonly string[];
  validationHash?: string;
  steps?: {
    [stepId: string]: {
      id: string;
      payload: Record<string, any>;
      startedAt: number;
      status: "success" | "error" | "pending" | "running";
      output: Record<string, any> | {
        path?: string;
        success?: boolean;
        files?: Array<{
          path: string;
          content: string;
        }>;
      };
      endedAt: number;
    };
  };
}

export interface CategoryScores {
  [CategoryType.CODE_QUALITY]: number;
  [CategoryType.SECURITY]: number;
  [CategoryType.PERFORMANCE]: number;
  [CategoryType.TEST_COVERAGE]: number;
}

export interface Review {
  id: string;
  submissionId: string;
  submissionTitle: string;
  reviewerId: string;
  reviewerName: string;
  reviewerAvatar: string;
  score: number;
  categoryScores: CategoryScores;
  feedback: string;
  status: ReviewStatus;
  submittedDate: Date;
}

export interface CodeAnalyzerProps {
  onSubmit: (submission: Partial<CodeSubmission>) => void;
  isAnalyzing: boolean;
  analysisResult?: AnalysisResult;
}

export interface AnalysisResult {
  overallScore: number;
  categoryScores: CategoryScores;
  aiInsights: readonly string[];
  validationHash: string;
}

export interface ReviewerFlowProps {
  submissions: CodeSubmission[];
  onClaimSubmission: (submissionId: string) => void;
  onSubmitReview: (review: Partial<Review>) => void;
}

export interface ProfileReviewsProps {
  userProfile: UserProfile;
  reviews: Review[];
  submissions: CodeSubmission[];
  reputationHistory: ReputationDataPoint[];
}

export interface ReputationDataPoint {
  date: Date;
  reputation: number;
}

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: UserProfile
        Insert: Partial<UserProfile>
        Update: Partial<UserProfile>
      }
      code_submissions: {
        Row: CodeSubmission
        Insert: Partial<CodeSubmission>
        Update: Partial<CodeSubmission>
      }
      reviews: {
        Row: Review
        Insert: Partial<Review>
        Update: Partial<Review>
      }
      activities: {
        Row: Activity
        Insert: Partial<Activity>
        Update: Partial<Activity>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
