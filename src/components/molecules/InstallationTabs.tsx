import { useState } from 'react';
import type { InstallTab } from '@/data/installation';

interface Props {
  tabs:  InstallTab[];
  steps: { step: string; title: string; body: string }[];
}

export function InstallationTabs({ tabs, steps }: Props) {
  const [active, setActive] = useState(tabs[0].id);
  const [copied, setCopied] = useState(false);

  const current = tabs.find(t => t.id === active) ?? tabs[0];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(current.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-surface-container rounded-3xl border border-white/[0.06] p-8 md:p-10">
      <h2 className="font-display text-headline-lg text-white mb-8">Get the Binary</h2>

      <div className="flex gap-1 mb-8 border-b border-white/[0.06] scrollbar-hide overflow-x-auto">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActive(tab.id)}
            className={`pb-4 px-4 text-sm font-medium transition-all border-b-2 whitespace-nowrap -mb-px ${
              active === tab.id
                ? 'border-primary text-white'
                : 'border-transparent text-on-surface-variant hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-background rounded-xl border border-white/5 overflow-hidden mb-8">
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
          <span className="font-mono text-xs text-on-surface-muted italic">{current.comment}</span>
          <button
            onClick={handleCopy}
            className="text-xs text-primary hover:text-primary-dim transition-colors font-medium"
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <pre className="p-5 font-mono text-mono-md overflow-x-auto scrollbar-hide leading-relaxed">
          {current.command.split('\n').map((line, i) => (
            <code key={i} className="block text-on-surface">
              <span className="text-primary">$ </span>{line}
            </code>
          ))}
        </pre>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {steps.map(s => (
          <div key={s.step} className="flex gap-4 items-start">
            <div className="w-7 h-7 rounded-full bg-primary/15 text-primary flex items-center justify-center text-xs font-bold font-mono shrink-0">
              {s.step}
            </div>
            <div>
              <span className="font-bold text-sm text-white block mb-1">{s.title}</span>
              <p className="text-body-sm text-on-surface-variant">{s.body}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
