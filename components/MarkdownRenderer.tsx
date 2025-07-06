import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkBreaks from 'remark-breaks';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className = "" }: MarkdownRendererProps) {
  return (
    <div className={`prose prose-gray max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkBreaks]}
        skipHtml={false}
        components={{
          h1: ({ children }) => <h1 className="text-2xl font-bold mt-6 mb-4">{children}</h1>,
          h2: ({ children }) => <h2 className="text-xl font-semibold mt-5 mb-3">{children}</h2>,
          h3: ({ children }) => <h3 className="text-lg font-semibold mt-4 mb-2">{children}</h3>,
          p: ({ children }) => {
            // 画像が単独で配置されている場合は段落タグを使わない
            const childArray = React.Children.toArray(children);
            if (childArray.length === 1 && React.isValidElement(childArray[0]) && 
                childArray[0].type === 'img') {
              return <>{children}</>;
            }
            
            return <p className="mb-4 leading-relaxed">{children}</p>;
          },
          ul: ({ children }) => <ul className="list-disc ml-6 mb-4">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal ml-6 mb-4">{children}</ol>,
          li: ({ children }) => <li className="mb-1">{children}</li>,
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600">
              {children}
            </blockquote>
          ),
          code: ({ children, className }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">
                  {children}
                </code>
              );
            }
            return (
              <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto my-4">
                <code className="text-sm">{children}</code>
              </pre>
            );
          },
          img: ({ src, alt }) => {
            if (!src) return null;
            return (
              <div className="my-6">
                <div className="relative w-full max-w-2xl mx-auto">
                  <img
                    src={src as string}
                    alt={alt || ""}
                    className="w-full h-auto rounded-lg shadow-sm border border-gray-200"
                    loading="lazy"
                  />
                </div>
                {alt && (
                  <p className="text-center text-sm text-gray-500 mt-2 italic">
                    {alt}
                  </p>
                )}
              </div>
            );
          },
          a: ({ children, href }) => (
            <a 
              href={href} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              {children}
            </a>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}