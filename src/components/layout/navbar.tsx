import { Button } from "@/components/ui/button";

const links = ["Catalogue", "Support", "A propos"];

export function Navbar() {
  return (
    <header className="sticky top-0 z-20 border-b border-[var(--border)] bg-white/95 backdrop-blur">
      <div className="ec-container flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="grid size-6 place-items-center rounded-full bg-[var(--primary)] text-xs font-bold text-white">
            E
          </span>
          <span className="text-sm font-semibold text-[var(--title)]">EcoRide</span>
        </div>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <a key={link} className="text-sm text-slate-600 hover:text-[var(--accent-strong)]" href="#">
              {link}
            </a>
          ))}
        </nav>

        <Button className="min-w-0 px-3" variant="primary">
          Découvrir
        </Button>
      </div>
    </header>
  );
}
