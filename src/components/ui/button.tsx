import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
} & ButtonHTMLAttributes<HTMLButtonElement>;

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    "bg-[var(--primary)] text-white hover:bg-[var(--primary-strong)] border-[var(--primary)]",
  secondary:
    "bg-white text-[var(--accent-strong)] border-[var(--accent-strong)] hover:bg-[var(--background)]",
  ghost:
    "bg-transparent text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--background)]",
};

export function Button({ children, variant = "primary", className = "", ...props }: ButtonProps) {
  return (
    <button
      className={`inline-flex h-11 min-w-28 items-center justify-center rounded-lg border px-4 text-sm font-semibold ${variantStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
