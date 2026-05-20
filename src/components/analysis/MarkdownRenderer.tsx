import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  tone?: 'light' | 'dark';
  className?: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, tone = 'dark', className = '' }) => {
  const isLight = tone === 'light';

  return (
    <div className={`space-y-3 text-sm leading-6 ${isLight ? 'text-neutral-600' : 'text-gray-300'} ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className={`text-xl font-bold ${isLight ? 'text-neutral-950' : 'text-green-400'}`} {...props} />,
          h2: ({ node, ...props }) => <h2 className={`text-lg font-bold ${isLight ? 'text-neutral-950' : 'text-white'}`} {...props} />,
          h3: ({ node, ...props }) => <h3 className={`text-base font-semibold ${isLight ? 'text-neutral-900' : 'text-gray-200'}`} {...props} />,
          p: ({ node, ...props }) => <p className={isLight ? 'text-neutral-600' : 'text-gray-300'} {...props} />,
          a: ({ node, ...props }) => <a className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
          ul: ({ node, ...props }) => <ul className={`list-disc space-y-2 pl-5 ${isLight ? 'text-neutral-600 marker:text-green-500' : 'text-gray-300'}`} {...props} />,
          ol: ({ node, ...props }) => <ol className={`list-decimal space-y-2 pl-5 ${isLight ? 'text-neutral-600 marker:text-green-500' : 'text-gray-300'}`} {...props} />,
          li: ({ node, ...props }) => <li className="pl-1" {...props} />,
          pre: ({ node, ...props }) => (
            <pre className={`${isLight ? 'bg-neutral-100 text-neutral-800' : 'bg-gray-700 text-gray-100'} p-3 rounded-md overflow-auto text-xs my-2`} {...props} />
          ),
          code: ({ node, className, children, ...props }) => (
            <code className={`${className || ''} ${isLight ? 'bg-neutral-100 text-neutral-800' : 'bg-gray-700 text-gray-100'} px-1 py-0.5 rounded text-xs break-words`} {...props}>
              {children}
            </code>
          ),
          blockquote: ({ node, ...props }) => <blockquote className={`border-l-4 pl-4 italic ${isLight ? 'border-neutral-300 text-neutral-500' : 'border-gray-500 text-gray-400'}`} {...props} />,
          hr: ({ node, ...props }) => <hr className={isLight ? 'border-t border-neutral-200' : 'border-t border-gray-600'} {...props} />,
          strong: ({ node, ...props }) => <strong className={`font-semibold ${isLight ? 'text-neutral-900' : 'text-white'}`} {...props} />,
          em: ({ node, ...props }) => <em className={`italic ${isLight ? 'text-neutral-600' : 'text-gray-300'}`} {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer;
