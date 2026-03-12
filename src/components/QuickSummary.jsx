export default function QuickSummary({ lines = [] }) {
  if (!Array.isArray(lines) || lines.length === 0) {
    return null;
  }

  return (
    <aside className="rounded-[12px] border border-cream/[0.08] bg-cream/[0.03] p-4">
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.32em] text-blue">Quick Summary</p>
      <ul className="mt-3 grid gap-2 text-sm leading-relaxed text-cream/55">
        {lines.map((line) => (
          <li key={line} className="flex items-start gap-2.5">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue/50" />
            <span>{line}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
