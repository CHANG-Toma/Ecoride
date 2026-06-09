import Link from "next/link";
import type { UserRole } from "@/types/auth";

type NavItem = {
  label: string;
  href: string;
  icon: string;
};

const CLIENT_NAV: NavItem[] = [
  { label: "Tableau de bord", href: "/compte", icon: "◈" },
  { label: "Mes commandes", href: "/compte/commandes", icon: "📦" },
  { label: "Paramètres", href: "/compte/parametres", icon: "⚙" },
];

const TECHNICIEN_NAV: NavItem[] = [
  { label: "Tableau de bord", href: "/atelier", icon: "◈" },
  { label: "Inventaire stock", href: "/atelier/stock", icon: "🗃" },
  { label: "Paramètres", href: "/atelier/parametres", icon: "⚙" },
];

const ADMIN_NAV: NavItem[] = [
  { label: "Tableau de bord", href: "/admin", icon: "◈" },
  { label: "Utilisateurs", href: "/admin/utilisateurs", icon: "👥" },
  { label: "Commandes", href: "/admin/commandes", icon: "📋" },
  { label: "Paramètres", href: "/admin/parametres", icon: "⚙" },
];

const ROLE_NAV: Record<UserRole, NavItem[]> = {
  client: CLIENT_NAV,
  technicien: TECHNICIEN_NAV,
  admin: ADMIN_NAV,
};

const ROLE_ACCENT: Record<UserRole, string> = {
  client: "var(--primary)",
  technicien: "var(--accent)",
  admin: "#7c3aed",
};

const ROLE_LABEL: Record<UserRole, string> = {
  client: "Espace client",
  technicien: "Espace atelier",
  admin: "Back-office admin",
};

type SidebarNavProps = {
  role: UserRole;
  activePath: string;
  prenom: string;
  nom: string;
};

export function SidebarNav({ role, activePath, prenom, nom }: SidebarNavProps) {
  const items = ROLE_NAV[role];
  const accent = ROLE_ACCENT[role];
  const initials = `${prenom[0] ?? ""}${nom[0] ?? ""}`.toUpperCase();

  return (
    <aside className="flex w-full flex-col gap-2 md:w-56 md:shrink-0">
      {/* Identity header */}
      <div
        className="ec-card flex items-center gap-3 p-4"
        style={{ borderTop: `3px solid ${accent}` }}
      >
        <div
          className="grid size-10 shrink-0 place-items-center rounded-full text-sm font-bold text-white"
          style={{ background: accent }}
        >
          {initials}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[var(--foreground)]">
            {prenom} {nom}
          </p>
          <p className="text-xs text-slate-500">{ROLE_LABEL[role]}</p>
        </div>
      </div>

      {/* Navigation links */}
      <nav className="ec-card overflow-hidden p-1">
        {items.map((item) => {
          const isActive =
            item.href === activePath ||
            (item.href !== "/compte" &&
              item.href !== "/atelier" &&
              item.href !== "/admin" &&
              activePath.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive
                  ? "text-white"
                  : "text-slate-600 hover:bg-[var(--background)] hover:text-[var(--foreground)]"
              }`}
              style={isActive ? { background: accent } : {}}
            >
              <span className="text-base leading-none">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
