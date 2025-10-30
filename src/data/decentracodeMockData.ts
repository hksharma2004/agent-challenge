import { 
  ReviewStatus, 
  SubmissionStatus, 
  StakingTier, 
  TransactionType, 
  ActivityType,
  ProgrammingLanguage,
  CategoryType 
} from '@/types/enums';


export const mockRootProps = {
  currentUser: {
    id: "user-1" as const,
    username: "johndoe" as const,
    avatar: "https://i.pravatar.cc/150?img=12" as const,
    email: "john.doe@example.com" as const,
    reputation: 850 as const,
    level: "Expert" as const,
    creditsAvailable: 1250 as const,
    creditsStaked: 500 as const,
    stakingtier: StakingTier.SILVER,
    totalReviewsGiven: 45 as const,
    totalReviewsReceived: 32 as const,
    averageReviewScore: 87.5 as const,
    joinedDate: new Date("2024-01-15")
  },
  recentActivities: [
    {
      id: "activity-1" as const,
      type: ActivityType.REVIEW_RECEIVED,
      message: "Alice reviewed your repo" as const,
      timestamp: new Date("2025-01-10T14:30:00"),
      relatedUser: "Alice" as const
    },
    {
      id: "activity-2" as const,
      type: ActivityType.CREDITS_EARNED,
      message: "You earned 10 credits" as const,
      timestamp: new Date("2025-01-10T12:15:00"),
      creditsAmount: 10 as const
    },
    {
      id: "activity-3" as const,
      type: ActivityType.ANALYSIS_COMPLETE,
      message: "Your code analysis is ready" as const,
      timestamp: new Date("2025-01-10T10:00:00"),
      submissionId: "sub-123" as const
    },
    {
      id: "activity-4" as const,
      type: ActivityType.CODE_SUBMITTED,
      message: "New submission awaiting review" as const,
      timestamp: new Date("2025-01-09T16:45:00")
    },
    {
      id: "activity-5" as const,
      type: ActivityType.REVIEW_GIVEN,
      message: "You reviewed Bob's repository" as const,
      timestamp: new Date("2025-01-09T14:20:00"),
      relatedUser: "Bob" as const
    }
  ],
  submissions: [
    {
      id: "sub-1" as const,
      title: "E-commerce Backend API" as const,
      description: "RESTful API for e-commerce platform with authentication and payment integration" as const,
      repoUrl: "https://github.com/johndoe/ecommerce-api" as const,
      language: ProgrammingLanguage.TYPESCRIPT,
      tags: ["api", "backend", "nodejs", "express"] as const,
      status: SubmissionStatus.REVIEWED,
      authorId: "user-1" as const,
      authorName: "johndoe" as const,
      authorAvatar: "https://i.pravatar.cc/150?img=12" as const,
      submittedDate: new Date("2025-01-08T09:00:00"),
      lastUpdate: new Date("2025-01-10T14:30:00"),
      reviewCount: 3 as const,
      overallScore: 88 as const,
      categoryScores: {
        [CategoryType.CODE_QUALITY]: 85 as const,
        [CategoryType.SECURITY]: 92 as const,
        [CategoryType.PERFORMANCE]: 87 as const,
        [CategoryType.TEST_COVERAGE]: 88 as const
      },
      aiInsights: [
        "Excellent error handling implementation" as const,
        "Consider adding rate limiting to API endpoints" as const,
        "Database queries are well-optimized" as const,
        "Test coverage is comprehensive" as const
      ] as const,
      validationHash: "0x7a8f9e2b4c1d6e3a5f8b9c2d4e6f8a1b3c5d7e9f" as const
    },
    {
      id: "sub-2" as const,
      title: "React Dashboard Components" as const,
      description: "Reusable dashboard components with charts and data visualization" as const,
      repoUrl: "https://github.com/alicesmith/dashboard-components" as const,
      language: ProgrammingLanguage.TYPESCRIPT,
      tags: ["react", "frontend", "ui", "components"] as const,
      status: SubmissionStatus.AWAITING_REVIEW,
      authorId: "user-2" as const,
      authorName: "alicesmith" as const,
      authorAvatar: "https://i.pravatar.cc/150?img=5" as const,
      submittedDate: new Date("2025-01-10T11:00:00"),
      lastUpdate: new Date("2025-01-10T11:00:00"),
      reviewCount: 0 as const,
      creditReward: 25 as const
    },
    {
      id: "sub-3" as const,
      title: "Python Data Pipeline" as const,
      description: "ETL pipeline for processing large datasets with Apache Spark" as const,
      repoUrl: "https://github.com/bobchen/data-pipeline" as const,
      language: ProgrammingLanguage.PYTHON,
      tags: ["python", "data", "etl", "spark"] as const,
      status: SubmissionStatus.UNDER_REVIEW,
      authorId: "user-3" as const,
      authorName: "bobchen" as const,
      authorAvatar: "https://i.pravatar.cc/150?img=8" as const,
      submittedDate: new Date("2025-01-09T15:00:00"),
      lastUpdate: new Date("2025-01-10T09:30:00"),
      reviewCount: 1 as const,
      creditReward: 35 as const
    }
  ],
  reviews: [
    {
      id: "review-1" as const,
      submissionId: "sub-1" as const,
      submissionTitle: "E-commerce Backend API" as const,
      reviewerId: "user-4" as const,
      reviewerName: "Alice" as const,
      reviewerAvatar: "https://i.pravatar.cc/150?img=5" as const,
      score: 88 as const,
      categoryScores: {
        [CategoryType.CODE_QUALITY]: 85 as const,
        [CategoryType.SECURITY]: 92 as const,
        [CategoryType.PERFORMANCE]: 87 as const,
        [CategoryType.TEST_COVERAGE]: 88 as const
      },
      feedback: "Great implementation overall. The code is well-structured and follows best practices. Security measures are robust. Consider adding more edge case tests." as const,
      status: ReviewStatus.COMPLETED,
      submittedDate: new Date("2025-01-10T14:30:00"),
      creditsEarned: 15 as const
    },
    {
      id: "review-2" as const,
      submissionId: "sub-4" as const,
      submissionTitle: "Mobile App Authentication" as const,
      reviewerId: "user-1" as const,
      reviewerName: "johndoe" as const,
      reviewerAvatar: "https://i.pravatar.cc/150?img=12" as const,
      score: 82 as const,
      categoryScores: {
        [CategoryType.CODE_QUALITY]: 80 as const,
        [CategoryType.SECURITY]: 88 as const,
        [CategoryType.PERFORMANCE]: 78 as const,
        [CategoryType.TEST_COVERAGE]: 82 as const
      },
      feedback: "Good security implementation. Performance could be improved by implementing caching. Test coverage is adequate but could be more comprehensive." as const,
      status: ReviewStatus.COMPLETED,
      submittedDate: new Date("2025-01-09T14:20:00"),
      creditsEarned: 12 as const
    }
  ],
  creditTransactions: [
    {
      id: "tx-1" as const,
      type: TransactionType.EARNED,
      amount: 15 as const,
      description: "Review completed for E-commerce Backend API" as const,
      timestamp: new Date("2025-01-10T14:30:00"),
      balanceAfter: 1250 as const
    },
    {
      id: "tx-2" as const,
      type: TransactionType.SPENT,
      amount: -20 as const,
      description: "Code analysis for React Dashboard Components" as const,
      timestamp: new Date("2025-01-10T11:00:00"),
      balanceAfter: 1235 as const
    },
    {
      id: "tx-3" as const,
      type: TransactionType.STAKED,
      amount: -500 as const,
      description: "Staked for Silver tier" as const,
      timestamp: new Date("2025-01-09T10:00:00"),
      balanceAfter: 1255 as const
    },
    {
      id: "tx-4" as const,
      type: TransactionType.EARNED,
      amount: 12 as const,
      description: "Review completed for Mobile App Authentication" as const,
      timestamp: new Date("2025-01-09T14:20:00"),
      balanceAfter: 1755 as const
    }
  ],
  stakingTiers: [
    {
      tier: StakingTier.BRONZE,
      requiredAmount: 100 as const,
      benefits: [
        "Priority matching for reviews" as const,
        "Basic analytics dashboard" as const,
        "Standard support" as const
      ] as const
    },
    {
      tier: StakingTier.SILVER,
      requiredAmount: 500 as const,
      benefits: [
        "All Bronze benefits" as const,
        "Exclusive AI analysis features" as const,
        "Advanced analytics" as const,
        "Priority support" as const,
        "Custom review preferences" as const
      ] as const
    },
    {
      tier: StakingTier.GOLD,
      requiredAmount: 1000 as const,
      benefits: [
        "All Silver benefits" as const,
        "Custom AI model training" as const,
        "Dedicated account manager" as const,
        "Early access to new features" as const,
        "Premium badge" as const,
        "Highest priority matching" as const
      ] as const
    }
  ],
  codeQualityData: [
    { month: "January", score: 70 },
    { month: "February", score: 72 },
    { month: "March", score: 75 },
    { month: "April", score: 78 },
    { month: "May", score: 80 },
    { month: "June", score: 83 },
    { month: "July", score: 85 },
    { month: "August", score: 87 },
    { month: "September", score: 89 },
    { month: "October", score: 91 },
    { month: "November", score: 93 },
    { month: "December", score: 95 },
  ]
};
