import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { OrderStatusBadge } from "@/components/dashboard/order-status-badge";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Toutes les commandes | EcoRide Admin",
  description: "Vue globale de toutes les commandes EcoRide.",
};

export default async function AdminCommandesPage() {
  const session = await getSession();
  if (!session) redirect("/connexion");

  const commandes = await prisma.commande.findMany({
    orderBy: { dateCommande: "desc" },
    include: {
      utilisateur: true,
      facture: true,
      lignes: true,
    },
  });

  const totalCA = commandes.reduce((sum, c) => sum + Number(c.montantTotal), 0);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main className="ec-container py-8">
        <div className="flex flex-col gap-6 md:flex-row">
          <SidebarNav
            role="admin"
            activePath="/admin/commandes"
            prenom={session.prenom}
            nom={session.nom}
          />

          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h1 className="text-2xl font-bold text-[var(--title)]">
                Toutes les commandes
              </h1>
              <div className="flex gap-3">
                <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">
                  {commandes.length} commandes
                </span>
                <span className="rounded-full bg-[var(--primary)]/10 px-3 py-1 text-sm font-semibold text-[var(--primary)]">
                  {totalCA.toFixed(2)} € CA
                </span>
              </div>
            </div>

            <div className="ec-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        #
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Client
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Date
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Statut
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Articles
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Montant
                      </th>
                      <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Facture
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {commandes.map((cmd) => (
                      <tr
                        key={cmd.idCommandes}
                        className="transition-colors hover:bg-[var(--background)]"
                      >
                        <td className="px-5 py-4 font-mono text-xs text-slate-400">
                          #{cmd.idCommandes}
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-[var(--foreground)]">
                            {cmd.utilisateur.prenom} {cmd.utilisateur.nom}
                          </p>
                          <p className="text-xs text-slate-400">{cmd.utilisateur.email}</p>
                        </td>
                        <td className="px-5 py-4 text-slate-500">
                          {new Date(cmd.dateCommande).toLocaleDateString("fr-FR")}
                        </td>
                        <td className="px-5 py-4">
                          <OrderStatusBadge status={cmd.statut} />
                        </td>
                        <td className="px-5 py-4 text-right text-slate-500">
                          {cmd.lignes.length}
                        </td>
                        <td className="px-5 py-4 text-right font-bold text-[var(--foreground)]">
                          {Number(cmd.montantTotal).toFixed(2)} €
                        </td>
                        <td className="px-5 py-4 text-center">
                          {cmd.facture ? (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
                              ✓ #{cmd.facture.idFactures}
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-400">
                              —
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
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
