import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => <h1 className="text-3xl font-bold text-green-400 mt-6 mb-3" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-white mt-5 mb-2" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-gray-200 mt-4 mb-1" {...props} />,
        p: ({ node, ...props }) => <p className="text-gray-300 mb-2" {...props} />,
        a: ({ node, ...props }) => <a className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc list-inside ml-4 text-gray-300 mb-2" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal list-inside ml-4 text-gray-300 mb-2" {...props} />,
        li: ({ node, ...props }) => <li className="mb-1" {...props} />,
        code: ({ node, className, children, ...props }) => {
          const match = /language-(\w+)/.exec(className || '');

          const isBlock = !node.position.start.column || node.position.start.line !== node.position.end.line;

          return isBlock && match ? (
            <pre className="bg-gray-700 p-3 rounded-md overflow-auto text-sm text-gray-100 my-2">
              <code className={className} {...props}>
                {children}
              </code>
            </pre>
          ) : (
            <code className="bg-gray-700 px-1 py-0.5 rounded text-sm text-gray-100" {...props}>
              {children}
            </code>
          );
        },
        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-gray-500 pl-4 italic text-gray-400 my-2" {...props} />,
        hr: ({ node, ...props }) => <hr className="border-t border-gray-600 my-4" {...props} />,
        strong: ({ node, ...props }) => <strong className="font-extrabold text-white" {...props} />,
        em: ({ node, ...props }) => <em className="italic text-gray-300" {...props} />,
      }}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
