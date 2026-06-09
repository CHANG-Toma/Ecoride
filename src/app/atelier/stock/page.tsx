import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Inventaire stock | EcoRide",
  description: "Inventaire complet des stocks de trottinettes EcoRide.",
};

export default async function AtelierStockPage() {
  const session = await getSession();
  if (!session) redirect("/connexion");

  const stocks = await prisma.stock.findMany({
    include: {
      trottinette: {
        include: { categorie: true },
      },
    },
    orderBy: { quantiteDisponible: "asc" },
  });

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main className="ec-container py-8">
        <div className="flex flex-col gap-6 md:flex-row">
          <SidebarNav
            role="technicien"
            activePath="/atelier/stock"
            prenom={session.prenom}
            nom={session.nom}
          />

          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-[var(--title)]">
                Inventaire des stocks
              </h1>
              <span className="rounded-full bg-[var(--accent)]/10 px-3 py-1 text-sm font-semibold text-[var(--accent)]">
                {stocks.length} produit{stocks.length > 1 ? "s" : ""}
              </span>
            </div>

            <div className="ec-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Modèle
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Catégorie
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Autonomie
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Vitesse max
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Qté dispo
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Seuil alerte
                      </th>
                      <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                        État
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {stocks.map((s) => {
                      const isRupture = s.quantiteDisponible === 0;
                      const isAlerte = !isRupture && s.quantiteDisponible <= s.seuilAlerte;
                      const isOk = !isRupture && !isAlerte;

                      return (
                        <tr
                          key={s.idStock}
                          className={`transition-colors hover:bg-[var(--background)] ${
                            isRupture ? "bg-red-50/50" : isAlerte ? "bg-amber-50/50" : ""
                          }`}
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <span>🛴</span>
                              <span className="font-medium text-[var(--foreground)]">
                                {s.trottinette.modele}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-slate-500">
                            {s.trottinette.categorie.nom}
                          </td>
                          <td className="px-5 py-4 text-slate-500">
                            {s.trottinette.autonomie} km
                          </td>
                          <td className="px-5 py-4 text-slate-500">
                            {s.trottinette.vitesseMax} km/h
                          </td>
                          <td className="px-5 py-4 text-right font-semibold text-[var(--foreground)]">
                            {s.quantiteDisponible}
                          </td>
                          <td className="px-5 py-4 text-right text-slate-400">
                            {s.seuilAlerte}
                          </td>
                          <td className="px-5 py-4 text-center">
                            {isRupture && (
                              <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700">
                                Rupture
                              </span>
                            )}
                            {isAlerte && (
                              <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
                                ⚠ Alerte
                              </span>
                            )}
                            {isOk && (
                              <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                                ✓ OK
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
