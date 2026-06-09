import Link from "next/link";
import { SalesCharts } from "@/components/admin/sales-charts";
import { StatsCards } from "@/components/admin/stats-cards";
import { getDashboardStats } from "@/lib/admin/stats";
import { requireAdmin } from "@/lib/auth/guards";

export default async function AdminDashboardPage() {
  const session = await requireAdmin();
  const stats = await getDashboardStats();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-[var(--title)]">Dashboard ventes</h1>
        <p className="mt-1 text-sm text-slate-600">
          Bonjour {session.prenom}, voici un apercu des performances EcoRide.
        </p>
      </div>

      <StatsCards
        totalRevenue={stats.totalRevenue}
        orderCount={stats.orderCount}
        clientCount={stats.clientCount}
        averageOrder={stats.averageOrder}
        lowStockCount={stats.lowStockCount}
      />

      <SalesCharts
        monthlyRevenue={stats.monthlyRevenue}
        revenueByCategory={stats.revenueByCategory}
        topProducts={stats.topProducts}
        ordersByStatus={stats.ordersByStatus}
      />

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/trottinettes"
          className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--accent-strong)] hover:bg-[var(--background)]"
        >
          Gerer le catalogue
        </Link>
        <Link
          href="/admin/utilisateurs"
          className="rounded-lg border border-[var(--border)] bg-white px-4 py-2 text-sm font-medium text-[var(--accent-strong)] hover:bg-[var(--background)]"
        >
          Gerer les utilisateurs
        </Link>
      </div>
    </div>
  );
}
