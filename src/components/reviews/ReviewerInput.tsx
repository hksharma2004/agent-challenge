"use client";

interface ReviewerInputProps {
  reviewerId: string;
  setReviewerId: (reviewerId: string) => void;
  onFetch: () => void;
  isLoading: boolean;
}

export function ReviewerInput({
  reviewerId,
  setReviewerId,
  onFetch,
  isLoading,
}: ReviewerInputProps) {
  return (
    <div className="bg-card border border-geist-border-1 rounded-xl p-6 shadow-md text-center">
      <input
        type="text"
        value={reviewerId}
        onChange={(e) => setReviewerId(e.target.value)}
        placeholder="Enter Reviewer UUID (e.g., a1b2c3d4-e5f6-7890-1234-567890abcdef)"
        className="bg-background border border-geist-border-1 rounded-lg px-4 py-2 w-full max-w-md mb-4 text-black"
        disabled={isLoading}
      />
      <button
        onClick={onFetch}
        className="bg-card border border-geist-border-1 hover:border-green-500/60 text-foreground font-bold py-2 px-4 rounded-lg transition-colors"
        disabled={isLoading}
      >
        {isLoading ? "Fetching..." : "Fetch Data"}
      </button>
    </div>
  );
}
