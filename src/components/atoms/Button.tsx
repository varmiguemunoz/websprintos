import { type ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'ghost';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?:  Variant;
  size?:     Size;
  href?:     string;
  onClick?:  () => void;
  children:  ReactNode;
  className?: string;
  icon?:     string;
  external?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:   'nebula-gradient text-white font-bold shadow-[0_16px_40px_rgba(183,159,255,0.25)] hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]',
  secondary: 'bg-transparent border border-white/10 text-white font-semibold hover:bg-white/5',
  ghost:     'bg-transparent text-on-surface-variant hover:text-white hover:bg-surface-bright',
};

const sizeClasses: Record<Size, string> = {
  sm: 'px-4 py-2 text-sm rounded-lg gap-1.5',
  md: 'px-6 py-3 text-sm rounded-xl gap-2',
  lg: 'px-8 py-4 text-base rounded-xl gap-2',
};

export function Button({
  variant  = 'primary',
  size     = 'md',
  href,
  onClick,
  children,
  className = '',
  icon,
  external = false,
}: ButtonProps) {
  const base = `inline-flex items-center justify-center font-semibold transition-all duration-200 cursor-pointer select-none ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;

  const content = (
    <>
      {icon && (
        <span className="material-symbols-outlined text-[1.1em] leading-none">{icon}</span>
      )}
      {children}
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={base}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
      >
        {content}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={base}>
      {content}
    </button>
  );
}
