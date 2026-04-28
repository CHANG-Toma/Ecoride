type SectionTitleProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  centered?: boolean;
};

export function SectionTitle({
  eyebrow,
  title,
  description,
  centered = false,
}: SectionTitleProps) {
  const align = centered ? "text-center mx-auto" : "";

  return (
    <header className={`max-w-2xl space-y-2 ${align}`}>
      {eyebrow ? (
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-[var(--accent)]">
          {eyebrow}
        </p>
      ) : null}
      <h2 className="text-3xl font-semibold text-[var(--title)]">{title}</h2>
      {description ? <p className="text-base text-slate-600">{description}</p> : null}
    </header>
  );
}
