import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { OrderStatusBadge } from "@/components/dashboard/order-status-badge";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

type Props = { params: Promise<{ id: string }> };

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  return { title: `Commande #${id} | EcoRide` };
}

export default async function CommandeDetailPage({ params }: Props) {
  const { id } = await params;
  const session = await getSession();
  if (!session) redirect("/connexion");

  const commande = await prisma.commande.findUnique({
    where: { idCommandes: Number(id) },
    include: {
      facture: true,
      lignes: {
        include: {
          trottinette: { include: { categorie: true } },
        },
      },
    },
  });

  // 404 if not found or doesn't belong to this client
  if (!commande || commande.idClient !== session.idClient) notFound();

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

          <div className="min-w-0 flex-1 space-y-5">
            {/* Header */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/compte/commandes"
                className="text-sm text-slate-400 hover:text-[var(--accent)]"
              >
                ← Mes commandes
              </Link>
            </div>

            <div className="ec-card p-6">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h1 className="text-xl font-bold text-[var(--title)]">
                    Commande #{commande.idCommandes}
                  </h1>
                  <p className="mt-1 text-sm text-slate-400">
                    Passée le{" "}
                    {new Date(commande.dateCommande).toLocaleDateString("fr-FR", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>
                </div>
                <OrderStatusBadge status={commande.statut} />
              </div>

              {/* Order lines */}
              <div className="mt-6">
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-400">
                  Articles
                </h2>
                <div className="divide-y divide-[var(--border)] rounded-xl border border-[var(--border)]">
                  {commande.lignes.map((ligne) => (
                    <div
                      key={ligne.idLigneCommandes}
                      className="flex items-center justify-between gap-4 px-5 py-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="grid size-10 place-items-center rounded-lg bg-[var(--background)] text-xl">
                          🛴
                        </div>
                        <div>
                          <p className="font-medium text-[var(--foreground)]">
                            {ligne.trottinette.modele}
                          </p>
                          <p className="text-xs text-slate-400">
                            {ligne.trottinette.categorie.nom} ·{" "}
                            {ligne.trottinette.autonomie} km · {ligne.trottinette.vitesseMax} km/h
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-sm">
                        <p className="font-medium">
                          {Number(ligne.prixUnitaire).toFixed(2)} € × {ligne.quantite}
                        </p>
                        <p className="font-bold text-[var(--foreground)]">
                          {(Number(ligne.prixUnitaire) * ligne.quantite).toFixed(2)} €
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="mt-4 flex justify-end">
                <div className="rounded-xl bg-[var(--background)] px-6 py-4 text-right">
                  <p className="text-sm text-slate-400">Total commande</p>
                  <p className="text-2xl font-bold text-[var(--foreground)]">
                    {Number(commande.montantTotal).toFixed(2)} €
                  </p>
                </div>
              </div>
            </div>

            {/* Invoice */}
            {commande.facture && (
              <div className="ec-card p-6">
                <h2 className="mb-4 text-lg font-semibold text-[var(--title)]">
                  Facture #{commande.facture.idFactures}
                </h2>
                <dl className="grid gap-3 text-sm sm:grid-cols-2">
                  {[
                    {
                      label: "Date de facturation",
                      value: new Date(commande.facture.dateFacture).toLocaleDateString("fr-FR"),
                    },
                    {
                      label: "Mode de paiement",
                      value: commande.facture.modePaiement,
                    },
                    {
                      label: "Statut de paiement",
                      value: commande.facture.statutPaiement,
                    },
                    {
                      label: "Montant facturé",
                      value: `${Number(commande.facture.montantTotal).toFixed(2)} €`,
                    },
                  ].map(({ label, value }) => (
                    <div key={label} className="rounded-lg bg-[var(--background)] p-3">
                      <dt className="text-xs font-medium text-slate-400">{label}</dt>
                      <dd className="mt-0.5 font-semibold capitalize text-[var(--foreground)]">
                        {value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
