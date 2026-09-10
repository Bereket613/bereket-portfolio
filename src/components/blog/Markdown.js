import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css';

// Shared Markdown renderer — used by the public article page and the admin
// editor preview so published content always matches the preview.
// react-markdown does not render raw HTML by default, which prevents XSS
// through post content.
const Markdown = ({ content }) => (
  <div className="blog-prose">
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeHighlight]}
      components={{
        a: ({ children, href, ...props }) => (
          <a {...props} href={href} target="_blank" rel="noopener noreferrer">
            {children || href}
          </a>
        )
      }}
    >
      {content}
    </ReactMarkdown>
  </div>
);

export default Markdown;
