import { useState } from 'react';

interface CodeBlockProps {
  code:     string;
  comment?: string;
  language?: string;
  showCopy?: boolean;
}

export function CodeBlock({ code, comment, showCopy = true }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-background rounded-xl border border-white/5 overflow-hidden group">
      {(comment || showCopy) && (
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
          {comment && (
            <span className="font-mono text-xs text-on-surface-muted italic">{comment}</span>
          )}
          {showCopy && (
            <button
              onClick={handleCopy}
              className="text-xs text-primary hover:text-primary-dim transition-colors ml-auto font-medium"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
      )}
      <pre className="p-5 font-mono text-mono-md overflow-x-auto scrollbar-hide">
        <code className="text-on-surface leading-relaxed">{code}</code>
      </pre>
    </div>
  );
}
