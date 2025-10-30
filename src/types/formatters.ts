import { 
  ReviewStatus, 
  SubmissionStatus, 
  StakingTier, 
  TransactionType, 
  ActivityType,
  ProgrammingLanguage,
  CategoryType 
} from './enums';

export const formatReviewStatus = (status: ReviewStatus): string => {
  const statusMap: Record<ReviewStatus, string> = {
    [ReviewStatus.PENDING]: "Pending",
    [ReviewStatus.IN_PROGRESS]: "In Progress",
    [ReviewStatus.COMPLETED]: "Completed",
    [ReviewStatus.REJECTED]: "Rejected"
  };
  return statusMap[status];
};

export const formatSubmissionStatus = (status: SubmissionStatus): string => {
  const statusMap: Record<SubmissionStatus, string> = {
    [SubmissionStatus.ANALYZING]: "Analyzing...",
    [SubmissionStatus.AWAITING_REVIEW]: "Awaiting Review",
    [SubmissionStatus.UNDER_REVIEW]: "Under Review",
    [SubmissionStatus.REVIEWED]: "Reviewed"
  };
  return statusMap[status];
};

export const formatStakingTier = (tier: StakingTier): string => {
  const tierMap: Record<StakingTier, string> = {
    [StakingTier.BRONZE]: "Bronze",
    [StakingTier.SILVER]: "Silver",
    [StakingTier.GOLD]: "Gold"
  };
  return tierMap[tier];
};

export const formatTransactionType = (type: TransactionType): string => {
  const typeMap: Record<TransactionType, string> = {
    [TransactionType.EARNED]: "Earned",
    [TransactionType.SPENT]: "Spent",
    [TransactionType.STAKED]: "Staked",
    [TransactionType.UNSTAKED]: "Unstaked"
  };
  return typeMap[type];
};

export const formatActivityType = (type: ActivityType): string => {
  const activityMap: Record<ActivityType, string> = {
    [ActivityType.CODE_SUBMITTED]: "Code Submitted",
    [ActivityType.REVIEW_RECEIVED]: "Review Received",
    [ActivityType.REVIEW_GIVEN]: "Review Given",
    [ActivityType.CREDITS_EARNED]: "Credits Earned",
    [ActivityType.CREDITS_SPENT]: "Credits Spent",
    [ActivityType.ANALYSIS_COMPLETE]: "Analysis Complete",
    [ActivityType.STAKING_UPDATED]: "Staking Updated"
  };
  return activityMap[type];
};

export const formatProgrammingLanguage = (lang: ProgrammingLanguage): string => {
  const langMap: Record<ProgrammingLanguage, string> = {
    [ProgrammingLanguage.JAVASCRIPT]: "JavaScript",
    [ProgrammingLanguage.TYPESCRIPT]: "TypeScript",
    [ProgrammingLanguage.PYTHON]: "Python",
    [ProgrammingLanguage.JAVA]: "Java",
    [ProgrammingLanguage.CSHARP]: "C#",
    [ProgrammingLanguage.CPP]: "C++",
    [ProgrammingLanguage.GO]: "Go",
    [ProgrammingLanguage.RUST]: "Rust",
    [ProgrammingLanguage.PHP]: "PHP",
    [ProgrammingLanguage.RUBY]: "Ruby",
    [ProgrammingLanguage.SWIFT]: "Swift",
    [ProgrammingLanguage.KOTLIN]: "Kotlin"
  };
  return langMap[lang];
};

export const formatCategoryType = (category: CategoryType): string => {
  const categoryMap: Record<CategoryType, string> = {
    [CategoryType.CODE_QUALITY]: "Code Quality",
    [CategoryType.SECURITY]: "Security",
    [CategoryType.PERFORMANCE]: "Performance",
    [CategoryType.TEST_COVERAGE]: "Test Coverage"
  };
  return categoryMap[category];
};

export const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date);
};

export const formatDateTime = (date: Date): string => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

export const formatCredits = (amount: number): string => {
  return `${amount.toLocaleString()} DCC`;
};

export const formatScore = (score: number): string => {
  return `${score}/100`;
};

export const formatPercentage = (value: number): string => {
  return `${value}%`;
};