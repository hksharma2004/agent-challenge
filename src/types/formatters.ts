import { 
  ReviewStatus, 
  SubmissionStatus, 
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

export const formatActivityType = (type: ActivityType): string => {
  const activityMap: Record<ActivityType, string> = {
    [ActivityType.CODE_SUBMITTED]: "Code Submitted",
    [ActivityType.REVIEW_RECEIVED]: "Review Received",
    [ActivityType.REVIEW_GIVEN]: "Review Given",
    [ActivityType.ANALYSIS_COMPLETE]: "Analysis Complete",
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

export const formatScore = (score: number): string => {
  return `${score}/100`;
};

export const formatPercentage = (value: number): string => {
  return `${value}%`;
};
