// Enums for DecentraCode platform

export enum ReviewStatus {
  PENDING = "pending",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  REJECTED = "rejected"
}

export enum SubmissionStatus {
  ANALYZING = "analyzing",
  AWAITING_REVIEW = "awaiting_review",
  UNDER_REVIEW = "under_review",
  REVIEWED = "reviewed"
}

export enum StakingTier {
  NONE = "none",
  BRONZE = "bronze",
  SILVER = "silver",
  GOLD = "gold"
}

export enum TransactionType {
  EARNED = "earned",
  SPENT = "spent",
  STAKED = "staked",
  UNSTAKED = "unstaked"
}

export enum ActivityType {
  CODE_SUBMITTED = "code_submitted",
  REVIEW_RECEIVED = "review_received",
  REVIEW_GIVEN = "review_given",
  CREDITS_EARNED = "credits_earned",
  CREDITS_SPENT = "credits_spent",
  ANALYSIS_COMPLETE = "analysis_complete",
  STAKING_UPDATED = "staking_updated"
}

export enum ProgrammingLanguage {
  JAVASCRIPT = "javascript",
  TYPESCRIPT = "typescript",
  PYTHON = "python",
  JAVA = "java",
  CSHARP = "csharp",
  CPP = "cpp",
  GO = "go",
  RUST = "rust",
  PHP = "php",
  RUBY = "ruby",
  SWIFT = "swift",
  KOTLIN = "kotlin"
}

export enum CategoryType {
  CODE_QUALITY = "code_quality",
  SECURITY = "security",
  PERFORMANCE = "performance",
  TEST_COVERAGE = "test_coverage"
}
