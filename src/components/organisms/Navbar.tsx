import { useState, useEffect } from 'react';
import type { NavItem } from '@/data/navigation';

interface Props {
  items:      NavItem[];
  githubHref: string;
  ctaLabel:   string;
  ctaHref:    string;
}

export function Navbar({ items, githubHref, ctaLabel, ctaHref }: Props) {
  const [scrolled, setScrolled] = useState(false);
  const [open,     setOpen]     = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 12);
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return (
    <nav
      className={`fixed top-0 w-full z-navbar glass-nav transition-shadow duration-300 ${scrolled ? 'shadow-lg' : ''}`}
    >
      <div className="site-container h-16 flex items-center justify-between">
        <div className="flex items-center gap-10">
          <a href="#" className="flex items-center gap-2.5 group shrink-0">
            <span className="text-2xl">⚡</span>
            <span className="font-display font-bold text-lg tracking-tight text-white">SprintOS</span>
          </a>

          <div className="hidden lg:flex items-center gap-7">
            {items.map(item => (
              <a
                key={item.href}
                href={item.href}
                className="text-body-sm text-on-surface-variant hover:text-white transition-colors font-medium"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-5">
          <a
            href={githubHref}
            target="_blank"
            rel="noopener noreferrer"
            className="text-body-sm text-on-surface-variant hover:text-white transition-colors font-medium flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-base">code</span>
            GitHub
          </a>
          <a
            href={ctaHref}
            className="nebula-gradient text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:brightness-110 transition-all"
          >
            {ctaLabel}
          </a>
        </div>

        <button
          className="lg:hidden p-2 text-on-surface-variant hover:text-white"
          onClick={() => setOpen(o => !o)}
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined">{open ? 'close' : 'menu'}</span>
        </button>
      </div>

      {open && (
        <div className="lg:hidden bg-surface-container border-t border-white/[0.04]">
          <div className="site-container py-6 flex flex-col gap-4">
            {items.map(item => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-body-md text-on-surface-variant hover:text-white transition-colors py-1"
              >
                {item.label}
              </a>
            ))}
            <div className="pt-4 border-t border-white/[0.06] flex flex-col gap-3">
              <a href={githubHref} className="text-body-sm text-on-surface-variant">GitHub ↗</a>
              <a href={ctaHref} className="nebula-gradient text-white text-sm font-bold px-5 py-3 rounded-xl text-center">
                {ctaLabel}
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
