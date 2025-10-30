import React from 'react';
import { FileText, Shield, FlaskConical, BookOpen, LucideIcon } from 'lucide-react';

interface AnalysisResultCardProps {
  title: string;
  content?: string | string[] | null;
  icon: LucideIcon;
}

const AnalysisResultCard: React.FC<AnalysisResultCardProps> = ({ title, content, icon: Icon }) => {
  const renderContent = () => {
    if (Array.isArray(content)) {
      return (
        <ul className="list-disc list-inside text-neutral-500 text-sm space-y-1">
          {content.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    }
    return <p className="text-neutral-500 text-sm">{content || "No data available."}</p>;
  };

  return (
    <div className="relative group rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 overflow-hidden">
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-green-500 transition-all duration-300" />

      <div className="flex items-start mb-4">
        <div className="p-2 rounded-full border border-green-500 text-green-500 mr-3">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-xl font-semibold text-black mt-1">
          {title}
        </h3>
      </div>
      {renderContent()}
    </div>
  );
};

export default AnalysisResultCard;
