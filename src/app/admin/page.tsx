import { StatCard } from "@/components/dashboard/stat-card";
import { OrderStatusBadge } from "@/components/dashboard/order-status-badge";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = {
  title: "Administration | EcoRide",
  description: "Back-office administrateur EcoRide.",
};

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/connexion");

  const [
    nbUtilisateurs,
    nbCommandes,
    stocksEnAlerte,
    commandesRecentes,
    chiffreAffaires,
  ] = await Promise.all([
    prisma.utilisateur.count(),
    prisma.commande.count(),
    prisma.stock.count({
      where: { quantiteDisponible: { lte: prisma.stock.fields.seuilAlerte } },
    }),
    prisma.commande.findMany({
      orderBy: { dateCommande: "desc" },
      take: 6,
      include: { utilisateur: true },
    }),
    prisma.commande.aggregate({ _sum: { montantTotal: true } }),
  ]);

  const ca = Number(chiffreAffaires._sum.montantTotal ?? 0);

  const roleDistrib = await prisma.utilisateur.groupBy({
    by: ["role"],
    _count: { role: true },
  });

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div
        className="ec-card overflow-hidden p-6"
        style={{
          background: "linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)",
        }}
      >
        <h1 className="text-2xl font-bold text-white">
          Bonjour, {session.prenom} 👑
        </h1>
        <p className="mt-1 text-sm text-purple-100">
          Vue d&apos;ensemble du back-office EcoRide.
        </p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="Utilisateurs"
          value={nbUtilisateurs}
          icon="👥"
          accent="#7c3aed"
        />
        <StatCard
          label="Commandes"
          value={nbCommandes}
          icon="📋"
          accent="var(--accent)"
        />
        <StatCard
          label="Chiffre d'affaires"
          value={`${ca.toFixed(2)} €`}
          icon="💰"
          accent="var(--primary)"
        />
        <StatCard
          label="Stocks en alerte"
          value={stocksEnAlerte}
          icon="⚠️"
          accent={stocksEnAlerte > 0 ? "#dc2626" : "#15803d"}
        />
      </div>

      {/* Role distribution */}
      <div className="ec-card p-6">
        <h2 className="mb-4 text-lg font-semibold text-[var(--title)]">
          Répartition des utilisateurs
        </h2>
        <div className="flex flex-wrap gap-4">
          {roleDistrib.map((r) => (
            <div
              key={r.role}
              className="flex items-center gap-3 rounded-xl bg-[var(--background)] px-5 py-3"
            >
              <span className="text-2xl font-bold text-[var(--foreground)]">
                {r._count.role}
              </span>
              <span className="capitalize text-sm text-slate-500">{r.role}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Recent orders */}
      <div className="ec-card p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-[var(--title)]">
            Commandes récentes
          </h2>
          <Link
            href="/admin/commandes"
            className="text-sm font-medium text-[var(--accent)] hover:text-[var(--accent-strong)]"
          >
            Voir toutes →
          </Link>
        </div>
        <div className="divide-y divide-[var(--border)]">
          {commandesRecentes.map((cmd) => (
            <div
              key={cmd.idCommandes}
              className="flex items-center justify-between gap-4 py-3"
            >
              <div>
                <p className="text-sm font-medium text-[var(--foreground)]">
                  #{cmd.idCommandes} — {cmd.utilisateur.prenom}{" "}
                  {cmd.utilisateur.nom}
                </p>
                <p className="text-xs text-slate-400">
                  {new Date(cmd.dateCommande).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <OrderStatusBadge status={cmd.statut} />
                <span className="text-sm font-bold">
                  {Number(cmd.montantTotal).toFixed(2)} €
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
