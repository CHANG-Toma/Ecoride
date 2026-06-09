"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", exact: true },
  { href: "/admin/trottinettes", label: "Trottinettes" },
  { href: "/admin/utilisateurs", label: "Utilisateurs" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  function isActive(href: string, exact?: boolean) {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  }

  return (
    <aside className="ec-card w-full shrink-0 p-4 lg:w-56">
      <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
        Administration
      </p>
      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
              isActive(item.href, item.exact)
                ? "bg-[var(--primary)] text-white"
                : "text-slate-700 hover:bg-[var(--background)]"
            }`}
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
