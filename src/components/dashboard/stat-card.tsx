type StatCardProps = {
  label: string;
  value: string | number;
  icon: string;
  accent?: string;
  sub?: string;
};

export function StatCard({ label, value, icon, accent = "var(--primary)", sub }: StatCardProps) {
  return (
    <div
      className="ec-card flex items-center gap-4 p-5 transition-shadow hover:shadow-md"
      style={{ borderLeft: `4px solid ${accent}` }}
    >
      <span
        className="grid size-11 shrink-0 place-items-center rounded-xl text-xl"
        style={{ background: `color-mix(in srgb, ${accent} 12%, transparent)` }}
      >
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-[var(--foreground)]">{value}</p>
        {sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}
      </div>
    </div>
  );
}
