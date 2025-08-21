"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useTheme } from "next-themes";
import "./markdown.css";

export default function Markdown({ content }: { content: string }) {
  const { theme } = useTheme();
  
  return (
    <div className="w-full markdown-content markdown prose prose-slate dark:prose-invert max-w-none" data-theme={theme}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // 自定义链接组件，在新标签页打开
          a: ({ children, href, ...props }) => (
            <a href={href} target="_blank" rel="noopener noreferrer" {...props}>
              {children}
            </a>
          ),
          // 确保标题正确渲染
          h1: ({ children, ...props }) => (
            <h1 className="text-3xl font-bold mb-4 mt-6" {...props}>{children}</h1>
          ),
          h2: ({ children, ...props }) => (
            <h2 className="text-2xl font-bold mb-3 mt-5" {...props}>{children}</h2>
          ),
          h3: ({ children, ...props }) => (
            <h3 className="text-xl font-bold mb-2 mt-4" {...props}>{children}</h3>
          ),
          // 段落样式
          p: ({ children, ...props }) => (
            <p className="mb-4 leading-relaxed" {...props}>{children}</p>
          ),
          // 列表样式
          ul: ({ children, ...props }) => (
            <ul className="list-disc list-inside mb-4 space-y-1" {...props}>{children}</ul>
          ),
          ol: ({ children, ...props }) => (
            <ol className="list-decimal list-inside mb-4 space-y-1" {...props}>{children}</ol>
          ),
          // 粗体和斜体
          strong: ({ children, ...props }) => (
            <strong className="font-semibold" {...props}>{children}</strong>
          ),
          em: ({ children, ...props }) => (
            <em className="italic" {...props}>{children}</em>
          ),
          // 代码块
          code: ({ children, ...props }) => {
            // @ts-ignore - inline prop exists
            if (props.inline) {
              return <code className="px-1 py-0.5 bg-muted rounded text-sm" {...props}>{children}</code>;
            }
            return (
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto mb-4">
                <code {...props}>{children}</code>
              </pre>
            );
          },
          // 引用块
          blockquote: ({ children, ...props }) => (
            <blockquote className="border-l-4 border-primary pl-4 italic my-4" {...props}>
              {children}
            </blockquote>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
