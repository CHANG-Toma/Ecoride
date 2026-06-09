import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { OrderStatusBadge } from "@/components/dashboard/order-status-badge";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "Mes commandes | EcoRide",
  description: "Historique et suivi de vos commandes EcoRide.",
};

export default async function CommandesPage() {
  const session = await getSession();
  if (!session) redirect("/connexion");

  const commandes = await prisma.commande.findMany({
    where: { idClient: session.idClient },
    orderBy: { dateCommande: "desc" },
    include: {
      facture: true,
      lignes: {
        include: { trottinette: true },
      },
    },
  });

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main className="ec-container py-8">
        <div className="flex flex-col gap-6 md:flex-row">
          <SidebarNav
            role="client"
            activePath="/compte/commandes"
            prenom={session.prenom}
            nom={session.nom}
          />

          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-[var(--title)]">
                Mes commandes
              </h1>
              <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-sm font-semibold text-[var(--primary)]">
                {commandes.length} commande{commandes.length > 1 ? "s" : ""}
              </span>
            </div>

            {commandes.length === 0 ? (
              <div className="ec-card rounded-2xl border-2 border-dashed border-[var(--border)] py-16 text-center">
                <p className="text-4xl">🛒</p>
                <p className="mt-3 text-sm text-slate-500">
                  Vous n&apos;avez pas encore passé de commande.
                </p>
                <Link
                  href="#"
                  className="mt-3 inline-block text-sm font-medium text-[var(--accent)] hover:underline"
                >
                  Découvrir le catalogue
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {commandes.map((cmd) => (
                  <div key={cmd.idCommandes} className="ec-card p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-semibold text-[var(--foreground)]">
                            Commande #{cmd.idCommandes}
                          </p>
                          <OrderStatusBadge status={cmd.statut} />
                        </div>
                        <p className="mt-0.5 text-xs text-slate-400">
                          Passée le{" "}
                          {new Date(cmd.dateCommande).toLocaleDateString(
                            "fr-FR",
                            { day: "numeric", month: "long", year: "numeric" },
                          )}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-bold text-[var(--foreground)]">
                          {Number(cmd.montantTotal).toFixed(2)} €
                        </p>
                        {cmd.facture && (
                          <p className="text-xs text-slate-400">
                            Facture #{cmd.facture.idFactures}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Product list */}
                    <div className="mt-3 divide-y divide-[var(--border)]">
                      {cmd.lignes.map((ligne) => (
                        <div
                          key={ligne.idLigneCommandes}
                          className="flex items-center justify-between py-2 text-sm"
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-lg">🛴</span>
                            <span className="text-[var(--foreground)]">
                              {ligne.trottinette.modele}
                            </span>
                            <span className="text-slate-400">
                              × {ligne.quantite}
                            </span>
                          </div>
                          <span className="font-medium">
                            {(Number(ligne.prixUnitaire) * ligne.quantite).toFixed(2)} €
                          </span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 flex justify-end">
                      <Link
                        href={`/compte/commandes/${cmd.idCommandes}`}
                        className="rounded-lg border border-[var(--accent)] px-4 py-1.5 text-sm font-medium text-[var(--accent)] transition hover:bg-[var(--accent)] hover:text-white"
                      >
                        Voir le détail
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
