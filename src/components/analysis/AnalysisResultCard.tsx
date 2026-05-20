import React from 'react';
import { LucideIcon } from 'lucide-react';
import MarkdownRenderer from './MarkdownRenderer';

interface AnalysisResultCardProps {
  title: string;
  content?: string | string[] | null;
  icon: LucideIcon;
}

const AnalysisResultCard: React.FC<AnalysisResultCardProps> = ({ title, content, icon: Icon }) => {
  const renderContent = () => {
    if (Array.isArray(content)) {
      return (
        <ul className="list-disc pl-5 text-neutral-600 text-sm space-y-2 marker:text-green-500">
          {content.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    }

    if (content) {
      return <MarkdownRenderer content={content} tone="light" />;
    }

    return <p className="text-neutral-500 text-sm">No data available.</p>;
  };

  return (
    <div className="relative group rounded-xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-green-500 transition-all duration-300" />

      <div className="relative flex items-start mb-4">
        <div className="p-2 rounded-full border border-green-500 text-green-500 mr-3 shrink-0">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-xl font-semibold text-black mt-1">
          {title}
        </h3>
      </div>
      <div className="relative max-h-80 overflow-y-auto pr-2">
        {renderContent()}
      </div>
    </div>
  );
};

export default AnalysisResultCard;
