import { type ReactNode } from 'react';

type BadgeVariant = 'live' | 'primary' | 'secondary' | 'muted';

interface BadgeProps {
  variant?:  BadgeVariant;
  children:  ReactNode;
  dot?:      boolean;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  live:      'bg-surface-container border border-white/5 text-on-surface-variant',
  primary:   'bg-primary/10 border border-primary/20 text-primary',
  secondary: 'bg-secondary/10 border border-secondary/20 text-secondary',
  muted:     'bg-surface-muted text-on-surface-muted',
};

const dotColors: Record<BadgeVariant, string> = {
  live:      'bg-emerald animate-pulse-dot',
  primary:   'bg-primary',
  secondary: 'bg-secondary',
  muted:     'bg-on-surface-muted',
};

export function Badge({ variant = 'muted', children, dot = false, className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-label-sm uppercase tracking-widest font-mono ${variantClasses[variant]} ${className}`}
    >
      {dot && <span className={`flex h-1.5 w-1.5 rounded-full shrink-0 ${dotColors[variant]}`} />}
      {children}
    </span>
  );
}
