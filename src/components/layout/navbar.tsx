import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/auth/session";
import { getDefaultRedirectForRole } from "@/lib/auth/roles";

const links = [
  { label: "Catalogue", href: "#" },
  { label: "Support", href: "#" },
  { label: "A propos", href: "#" },
];

export async function Navbar() {
  const session = await getSession();

  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/95 backdrop-blur">
      <div className="ec-container flex h-16 items-center justify-between gap-4">
        <Link className="flex items-center gap-2" href="/">
          <span className="grid size-6 place-items-center rounded-full bg-[var(--primary)] text-xs font-bold text-white">
            E
          </span>
          <span className="text-sm font-semibold text-[var(--title)]">EcoRide</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a
              key={link.label}
              className="text-sm text-slate-600 hover:text-[var(--accent-strong)]"
              href={link.href}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {session ? (
            <>
              <Link
                className="hidden text-sm text-slate-600 hover:text-[var(--accent-strong)] sm:inline"
                href={getDefaultRedirectForRole(session.role)}
              >
                {session.prenom}
              </Link>
              <LogoutButton className="min-w-0 px-3" variant="secondary" />
            </>
          ) : (
            <>
              <Link className="hidden sm:inline-flex" href="/connexion">
                <Button className="min-w-0 px-3" variant="ghost">
                  Connexion
                </Button>
              </Link>
              <Link href="/inscription">
                <Button className="min-w-0 px-3" variant="primary">
                  S&apos;inscrire
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
