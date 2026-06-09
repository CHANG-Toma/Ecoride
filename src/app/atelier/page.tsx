import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { StatCard } from "@/components/dashboard/stat-card";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "Atelier | EcoRide",
  description: "Espace technicien EcoRide — suivi des stocks et des équipements.",
};

export default async function AtelierPage() {
  const session = await getSession();
  if (!session) redirect("/connexion");

  const stocks = await prisma.stock.findMany({
    include: { trottinette: { include: { categorie: true } } },
    orderBy: { quantiteDisponible: "asc" },
  });

  const totalTrottinettes = await prisma.trottinette.count();
  const enAlerte = stocks.filter(
    (s) => s.quantiteDisponible <= s.seuilAlerte,
  ).length;
  const totalDispo = stocks.reduce((sum, s) => sum + s.quantiteDisponible, 0);

  const stocksAlerte = stocks.filter((s) => s.quantiteDisponible <= s.seuilAlerte).slice(0, 5);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main className="ec-container py-8">
        <div className="flex flex-col gap-6 md:flex-row">
          <SidebarNav
            role="technicien"
            activePath="/atelier"
            prenom={session.prenom}
            nom={session.nom}
          />

          <div className="min-w-0 flex-1 space-y-6">
            {/* Welcome banner */}
            <div
              className="ec-card overflow-hidden p-6"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent) 0%, var(--accent-strong) 100%)",
              }}
            >
              <h1 className="text-2xl font-bold text-white">
                Bonjour, {session.prenom} 🔧
              </h1>
              <p className="mt-1 text-sm text-blue-100">
                Tableau de bord de l&apos;atelier EcoRide.
              </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                label="Modèles en catalogue"
                value={totalTrottinettes}
                icon="🛴"
                accent="var(--accent)"
              />
              <StatCard
                label="Unités disponibles"
                value={totalDispo}
                icon="📦"
                accent="var(--primary)"
              />
              <StatCard
                label="Stocks en alerte"
                value={enAlerte}
                icon="⚠️"
                accent={enAlerte > 0 ? "#dc2626" : "#15803d"}
                sub={enAlerte > 0 ? "En dessous du seuil" : "Tout est OK"}
              />
            </div>

            {/* Alert stocks */}
            <div className="ec-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--title)]">
                  Stocks en alerte
                </h2>
                <Link
                  href="/atelier/stock"
                  className="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-strong)]"
                >
                  Voir tout l'inventaire →
                </Link>
              </div>

              {stocksAlerte.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-[var(--border)] py-8 text-center">
                  <p className="text-2xl">✅</p>
                  <p className="mt-2 text-sm text-slate-500">
                    Tous les stocks sont au-dessus du seuil d&apos;alerte.
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-[var(--border)]">
                  {stocksAlerte.map((s) => (
                    <div
                      key={s.idStock}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">🛴</span>
                        <div>
                          <p className="text-sm font-medium text-[var(--foreground)]">
                            {s.trottinette.modele}
                          </p>
                          <p className="text-xs text-slate-400">
                            {s.trottinette.categorie.nom}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            s.quantiteDisponible === 0
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                          }`}
                        >
                          {s.quantiteDisponible === 0
                            ? "Rupture"
                            : `${s.quantiteDisponible} restant${s.quantiteDisponible > 1 ? "s" : ""}`}
                        </span>
                        <p className="mt-0.5 text-xs text-slate-400">
                          Seuil : {s.seuilAlerte}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick stock overview */}
            <div className="ec-card p-6">
              <h2 className="mb-4 text-lg font-semibold text-[var(--title)]">
                Aperçu de l'inventaire
              </h2>
              <div className="space-y-3">
                {stocks.slice(0, 6).map((s) => {
                  const pct = Math.min(
                    100,
                    s.seuilAlerte > 0
                      ? Math.round((s.quantiteDisponible / (s.seuilAlerte * 4)) * 100)
                      : 100,
                  );
                  const barColor =
                    s.quantiteDisponible === 0
                      ? "#dc2626"
                      : s.quantiteDisponible <= s.seuilAlerte
                        ? "#f59e0b"
                        : "#16a34a";

                  return (
                    <div key={s.idStock}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="font-medium text-[var(--foreground)]">
                          {s.trottinette.modele}
                        </span>
                        <span className="text-slate-500">
                          {s.quantiteDisponible} unités
                        </span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-[var(--border)]">
                        <div
                          className="h-2 rounded-full transition-all"
                          style={{ width: `${pct}%`, background: barColor }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
