export function TagList({
  items,
  className = "",
}: {
  items: string[];
  className?: string;
}) {
  return (
    <div className={`flex flex-wrap gap-2 ${className}`}>
      {items.map((t) => (
        <span
          key={t}
          className="inline-flex items-center gap-1.5 rounded-full bg-surface px-3 py-1 text-xs font-semibold border border-border"
        >
          {t}
        </span>
      ))}
    </div>
  );
}
