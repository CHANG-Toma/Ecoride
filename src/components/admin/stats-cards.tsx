type StatCardProps = {
  label: string;
  value: string;
  hint?: string;
};

export function StatCard({ label, value, hint }: StatCardProps) {
  return (
    <div className="ec-card p-5">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-[var(--title)]">{value}</p>
      {hint ? <p className="mt-1 text-xs text-slate-400">{hint}</p> : null}
    </div>
  );
}

type StatsCardsProps = {
  totalRevenue: number;
  orderCount: number;
  clientCount: number;
  averageOrder: number;
  lowStockCount: number;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value);
}

export function StatsCards({
  totalRevenue,
  orderCount,
  clientCount,
  averageOrder,
  lowStockCount,
}: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
      <StatCard label="Chiffre d'affaires" value={formatCurrency(totalRevenue)} />
      <StatCard label="Commandes" value={String(orderCount)} />
      <StatCard label="Clients" value={String(clientCount)} />
      <StatCard label="Panier moyen" value={formatCurrency(averageOrder)} />
      <StatCard
        label="Alertes stock"
        value={String(lowStockCount)}
        hint={lowStockCount > 0 ? "Produits sous le seuil" : "Aucune alerte"}
      />
    </div>
  );
}
