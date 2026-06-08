interface ShortcutKeyProps {
  keys: string;
}

export function ShortcutKey({ keys }: ShortcutKeyProps) {
  const parts = keys.split('+').map(k => k.trim());
  return (
    <span className="inline-flex items-center gap-1">
      {parts.map((part, i) => (
        <kbd
          key={i}
          className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-surface-muted border border-white/10 text-on-surface-variant leading-none"
        >
          {part}
        </kbd>
      ))}
    </span>
  );
}
