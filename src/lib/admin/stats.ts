import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const [
    revenueAgg,
    orderCount,
    clientCount,
    lowStockCount,
    ordersByStatus,
    topProducts,
    monthlyRevenue,
    revenueByCategory,
  ] = await Promise.all([
    prisma.commande.aggregate({
      where: { statut: { not: "annulee" } },
      _sum: { montantTotal: true },
    }),
    prisma.commande.count({ where: { statut: { not: "annulee" } } }),
    prisma.utilisateur.count({ where: { role: "client" } }),
    prisma.$queryRaw<{ count: number }[]>`
      SELECT COUNT(*)::int AS count
      FROM stocks
      WHERE quantite_disponible <= seuil_alerte
    `,
    prisma.commande.groupBy({
      by: ["statut"],
      _count: { idCommandes: true },
    }),
    prisma.ligneCommande.groupBy({
      by: ["idTrottinettes"],
      _sum: { quantite: true },
      orderBy: { _sum: { quantite: "desc" } },
      take: 5,
    }),
    prisma.$queryRaw<{ month: string; total: number }[]>`
      SELECT TO_CHAR(date_commande, 'YYYY-MM') AS month,
             SUM(montant_total)::float AS total
      FROM commandes
      WHERE statut != 'annulee'
      GROUP BY TO_CHAR(date_commande, 'YYYY-MM')
      ORDER BY month ASC
    `,
    prisma.$queryRaw<{ categorie: string; total: number }[]>`
      SELECT c.nom AS categorie, SUM(lc.quantite * lc.prix_unitaire)::float AS total
      FROM ligne_commandes lc
      JOIN trottinettes t ON t.id_trottinettes = lc.id_trottinettes
      JOIN categories c ON c.id_categories = t.id_categories
      JOIN commandes cmd ON cmd.id_commandes = lc.id_commandes
      WHERE cmd.statut != 'annulee'
      GROUP BY c.nom
      ORDER BY total DESC
    `,
  ]);

  const totalRevenue = revenueAgg._sum.montantTotal?.toNumber() ?? 0;
  const averageOrder = orderCount > 0 ? totalRevenue / orderCount : 0;

  const productIds = topProducts.map((p) => p.idTrottinettes);
  const products = await prisma.trottinette.findMany({
    where: { idTrottinettes: { in: productIds } },
    select: { idTrottinettes: true, modele: true },
  });
  const productMap = new Map(products.map((p) => [p.idTrottinettes, p.modele]));

  const topProductsData = topProducts.map((p) => ({
    modele: productMap.get(p.idTrottinettes) ?? "Inconnu",
    quantite: p._sum.quantite ?? 0,
  }));

  return {
    totalRevenue,
    orderCount,
    clientCount,
    averageOrder,
    lowStockCount: Number(lowStockCount[0]?.count ?? 0),
    ordersByStatus: ordersByStatus.map((s) => ({
      statut: s.statut,
      count: s._count.idCommandes,
    })),
    topProducts: topProductsData,
    monthlyRevenue: monthlyRevenue.map((m) => ({
      month: m.month,
      total: Number(m.total),
    })),
    revenueByCategory: revenueByCategory.map((c) => ({
      categorie: c.categorie,
      total: Number(c.total),
    })),
  };
}
