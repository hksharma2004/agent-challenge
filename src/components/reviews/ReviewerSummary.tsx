"use client";

import { User, Trophy, Code, CheckCircle, Gem, Sparkles } from "lucide-react";
import type { ReviewerData } from "@/app/reviews/page";
import { useEffect, useState } from "react";

interface ReviewerSummaryProps {
  data: ReviewerData | null;
}

export function ReviewerSummary({ data }: ReviewerSummaryProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (data) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [data]);

  const summaryData = [
    {
      icon: <User className="w-5 h-5" />,
      title: "Username",
      value: data?.username,
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      title: "Reputation",
      value: data?.reputation,
    },
    {
      icon: <Code className="w-5 h-5" />,
      title: "Language Expertise",
      value: data?.languages?.join(", "),
    },
    {
      icon: <CheckCircle className="w-5 h-5" />,
      title: "Availability",
      value: data?.availability,
    },
    {
      icon: <Gem className="w-5 h-5" />,
      title: "Staked Credits",
      value: data?.stakedCredits,
    },
  ];

  if (!data && !isVisible) {
    return (
      <div className="mt-8 p-6 rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 text-center text-neutral-500 flex flex-col items-center justify-center h-48">
        <Sparkles className="w-10 h-10 mb-4 text-neutral-400" />
        <p className="text-lg font-medium">No reviewer found</p>
        <p className="text-sm">Enter a UUID and fetch data to see reviewer insights.</p>
      </div>
    );
  }

  return (
    <div className="mt-8 grid gap-8">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {summaryData.map((item, index) => (
          <div
            key={index}
            className={`rounded-2xl border border-neutral-200 bg-white/60 shadow-sm hover:shadow-md hover:border-green-400 hover:scale-105 transition-all duration-300 p-6
              ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}
            `}
            style={{ transitionDelay: `${index * 50}ms` }}
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-green-50 text-green-600 rounded-full p-2">
                {item.icon}
              </span>
              <p className="text-neutral-700 font-medium">{item.title}</p>
            </div>
            {item.value ? (
              <p className="text-2xl font-bold text-black mt-2">
                {item.value}
              </p>
            ) : (
              <div className="bg-neutral-100 animate-pulse rounded w-1/2 h-6 mt-2"></div>
            )}
          </div>
        ))}
      </div>

      {data && (
        <div className="rounded-2xl border border-neutral-200 bg-white/70 p-6 text-neutral-700 leading-relaxed relative">
          <div className="absolute top-4 left-4 bg-green-50 text-green-600 rounded-full p-2">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-semibold text-black mb-4 pl-12">Reviewer Summary</h3>
          <p>
            Reviewer '{data.username}' is highly active with strong expertise in{" "}
            {data.languages?.join(" and ") || "various languages"}. Average review time:{" "}
            {Math.round(Math.random() * 100) / 10 + 3} hrs.
          </p>
        </div>
      )}
    </div>
  );
}
