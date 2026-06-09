import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  active?: boolean;
  onClick?: () => void;
};

export function Badge({ children, active = false, onClick }: BadgeProps) {
  const className = `inline-flex h-8 items-center rounded-full border px-3 text-xs font-semibold ${
    active
      ? "border-[var(--primary)] bg-[var(--primary)] text-white"
      : "border-[var(--border)] bg-white text-[var(--accent-strong)]"
  }`;

  if (onClick) {
    return (
      <button className={className} onClick={onClick} type="button">
        {children}
      </button>
    );
  }

  return <span className={className}>{children}</span>;
}
