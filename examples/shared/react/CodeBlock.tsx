'use client';

import { useEffect, useState } from 'react';

export interface CodeBlockProps {
  code: string;
  language?: string;
  copyLabel?: string;
}

type CopyState = 'idle' | 'copied' | 'error';

export function CodeBlock({
  code,
  language,
  copyLabel = 'Copy code'
}: CodeBlockProps) {
  const [copyState, setCopyState] = useState<CopyState>('idle');

  useEffect(() => {
    if (copyState === 'idle') {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setCopyState('idle');
    }, 1800);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [copyState]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopyState('copied');
    } catch {
      setCopyState('error');
    }
  };

  return (
    <div className="code-block-shell">
      <div className="code-block__toolbar">
        <span className="code-block__language">{language ?? 'text'}</span>
        <button
          aria-label={copyLabel}
          className="code-block__copy"
          data-state={copyState}
          type="button"
          onClick={() => {
            void handleCopy();
          }}
        >
          {copyState === 'copied'
            ? 'Copied'
            : copyState === 'error'
              ? 'Retry copy'
              : 'Copy'}
        </button>
      </div>
      <pre className="code-block">
        <code>{code}</code>
      </pre>
    </div>
  );
}
