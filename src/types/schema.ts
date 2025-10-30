import type { 
  ReviewStatus, 
  SubmissionStatus, 
  StakingTier, 
  TransactionType, 
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
  creditsavailable: number;
  creditsstaked: number;
  stakingTier: StakingTier;
  totalReviewsGiven: number;
  totalReviewsReceived: number;
  totalSubmissions: number; 
  averageReviewScore: number;
  joinedDate: Date;
}

export interface QuickStats {
  creditsBalance: number;
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
  creditsAmount?: number;
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
  creditReward?: number;
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
  creditsEarned: number;
}

export interface CreditTransaction {
  id: string;
  type: TransactionType;
  amount: number;
  description: string;
  timestamp: Date;
  balanceAfter: number;
}

export interface StakingTierInfo {
  tier: StakingTier;
  requiredAmount: number;
  benefits: readonly string[];
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

export interface CreditsDashboardProps {
  currentBalance: number;
  stakedAmount: number;
  transactions: CreditTransaction[];
  stakingTiers: StakingTierInfo[];
  currentTier: StakingTier;
  onStake: (amount: number) => void;
  onUnstake: (amount: number) => void;
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


export interface DecentraCodeDashboardProps {
  currentUser: UserProfile;
  recentActivities: Activity[];
  submissions: CodeSubmission[];
  reviews: Review[];
  creditTransactions: CreditTransaction[];
  stakingTiers: StakingTierInfo[];
  onSubmitCode?: (submission: Partial<CodeSubmission>) => void;
  onSubmitReview?: (review: Partial<Review>) => void;
  onStakeCredits?: (amount: number) => void;
  onUnstakeCredits?: (amount: number) => void;
  onClaimSubmission?: (submissionId: string) => void;
  isSocketConnected?: boolean;
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
      credit_transactions: {
        Row: CreditTransaction
        Insert: Partial<CreditTransaction>
        Update: Partial<CreditTransaction>
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
