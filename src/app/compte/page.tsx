import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { StatCard } from "@/components/dashboard/stat-card";
import { OrderStatusBadge } from "@/components/dashboard/order-status-badge";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { headers } from "next/headers";

export const metadata = {
  title: "Mon compte | EcoRide",
  description: "Votre espace personnel EcoRide : commandes, profil et suivi.",
};

export default async function ComptePage() {
  const session = await getSession();
  if (!session) redirect("/connexion");

  const headersList = await headers();
  const pathname = headersList.get("x-pathname") ?? "/compte";

  const utilisateur = await prisma.utilisateur.findUnique({
    where: { idClient: session.idClient },
    include: {
      commandes: {
        orderBy: { dateCommande: "desc" },
        take: 5,
        include: { facture: true },
      },
    },
  });

  const allCommandes = await prisma.commande.findMany({
    where: { idClient: session.idClient },
  });

  const totalDepense = allCommandes.reduce(
    (sum, c) => sum + Number(c.montantTotal),
    0,
  );

  const commandesRecentes = utilisateur?.commandes ?? [];

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main className="ec-container py-8">
        <div className="flex flex-col gap-6 md:flex-row">
          <SidebarNav
            role="client"
            activePath="/compte"
            prenom={session.prenom}
            nom={session.nom}
          />

          <div className="min-w-0 flex-1 space-y-6">
            {/* Welcome banner */}
            <div
              className="ec-card overflow-hidden p-6"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary) 0%, var(--primary-soft) 100%)",
              }}
            >
              <h1 className="text-2xl font-bold text-white">
                Bonjour, {session.prenom} 👋
              </h1>
              <p className="mt-1 text-sm text-green-100">
                Bienvenue dans votre espace personnel EcoRide.
              </p>
            </div>

            {/* Stats */}
            <div className="grid gap-4 sm:grid-cols-3">
              <StatCard
                label="Commandes passées"
                value={allCommandes.length}
                icon="📦"
                accent="var(--primary)"
              />
              <StatCard
                label="Total dépensé"
                value={`${totalDepense.toFixed(2)} €`}
                icon="💳"
                accent="var(--accent)"
              />
              <StatCard
                label="Membre depuis"
                value={new Date(utilisateur?.dateInscription ?? "").toLocaleDateString("fr-FR", { month: "long", year: "numeric" })}
                icon="🌱"
                accent="#7c3aed"
              />
            </div>

            {/* Recent orders */}
            <div className="ec-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--title)]">
                  Commandes récentes
                </h2>
                <Link
                  href="/compte/commandes"
                  className="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-strong)]"
                >
                  Voir tout →
                </Link>
              </div>

              {commandesRecentes.length === 0 ? (
                <div className="rounded-xl border-2 border-dashed border-[var(--border)] py-10 text-center">
                  <p className="text-sm text-slate-400">Aucune commande pour le moment.</p>
                  <Link
                    href="#"
                    className="mt-2 inline-block text-sm font-medium text-[var(--accent)] hover:underline"
                  >
                    Découvrir le catalogue
                  </Link>
                </div>
              ) : (
                <div className="divide-y divide-[var(--border)]">
                  {commandesRecentes.map((cmd) => (
                    <div
                      key={cmd.idCommandes}
                      className="flex items-center justify-between gap-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium text-[var(--foreground)]">
                          Commande #{cmd.idCommandes}
                        </p>
                        <p className="text-xs text-slate-400">
                          {new Date(cmd.dateCommande).toLocaleDateString("fr-FR")}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <OrderStatusBadge status={cmd.statut} />
                        <span className="text-sm font-semibold text-[var(--foreground)]">
                          {Number(cmd.montantTotal).toFixed(2)} €
                        </span>
                        <Link
                          href={`/compte/commandes/${cmd.idCommandes}`}
                          className="text-xs text-[var(--accent)] hover:underline"
                        >
                          Détail
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile summary */}
            <div className="ec-card p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-[var(--title)]">
                  Mes informations
                </h2>
                <Link
                  href="/compte/parametres"
                  className="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-strong)]"
                >
                  Modifier →
                </Link>
              </div>
              <dl className="grid gap-3 text-sm sm:grid-cols-2">
                {[
                  { label: "Nom", value: `${session.prenom} ${session.nom}` },
                  { label: "Email", value: session.email },
                  { label: "Adresse", value: utilisateur?.adresse ?? "—" },
                  { label: "Ville", value: `${utilisateur?.codePostal ?? ""} ${utilisateur?.ville ?? ""}` },
                  { label: "Téléphone", value: utilisateur?.telephone ?? "Non renseigné" },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg bg-[var(--background)] p-3">
                    <dt className="text-xs font-medium text-slate-400">{label}</dt>
                    <dd className="mt-0.5 font-medium text-[var(--foreground)]">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
