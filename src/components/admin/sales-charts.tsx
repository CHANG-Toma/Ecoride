"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = ["#679436", "#427aa1", "#a4bd01", "#06668c", "#5f8831"];

type SalesChartsProps = {
  monthlyRevenue: { month: string; total: number }[];
  revenueByCategory: { categorie: string; total: number }[];
  topProducts: { modele: string; quantite: number }[];
  ordersByStatus: { statut: string; count: number }[];
};

function formatMonth(month: string) {
  const [year, m] = month.split("-");
  const date = new Date(Number(year), Number(m) - 1);
  return date.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
}

function formatStatut(statut: string) {
  return statut.replace(/_/g, " ");
}

export function SalesCharts({
  monthlyRevenue,
  revenueByCategory,
  topProducts,
  ordersByStatus,
}: SalesChartsProps) {
  const monthlyData = monthlyRevenue.map((m) => ({
    ...m,
    label: formatMonth(m.month),
  }));

  const statusData = ordersByStatus.map((s) => ({
    ...s,
    label: formatStatut(s.statut),
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="ec-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-[var(--title)]">CA mensuel</h3>
        {monthlyData.length === 0 ? (
          <p className="text-sm text-slate-500">Aucune vente enregistree.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dbe5ef" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: any) => [`${Number(value).toFixed(2)} €`, "CA"]} />
              <Line type="monotone" dataKey="total" stroke="#679436" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="ec-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-[var(--title)]">Ventes par categorie</h3>
        {revenueByCategory.length === 0 ? (
          <p className="text-sm text-slate-500">Aucune vente enregistree.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={revenueByCategory}
                dataKey="total"
                nameKey="categorie"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, percent }: any) =>
                  `${name ?? ""} (${((percent ?? 0) * 100).toFixed(0)}%)`
                }
              >
                {revenueByCategory.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: any) => [`${Number(value).toFixed(2)} €`, "CA"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="ec-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-[var(--title)]">Top 5 modeles vendus</h3>
        {topProducts.length === 0 ? (
          <p className="text-sm text-slate-500">Aucune vente enregistree.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topProducts} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#dbe5ef" />
              <XAxis type="number" tick={{ fontSize: 12 }} />
              <YAxis type="category" dataKey="modele" width={120} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="quantite" fill="#427aa1" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="ec-card p-5">
        <h3 className="mb-4 text-sm font-semibold text-[var(--title)]">Commandes par statut</h3>
        {statusData.length === 0 ? (
          <p className="text-sm text-slate-500">Aucune commande enregistree.</p>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={statusData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#dbe5ef" />
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} allowDecimals={false} />
              <Tooltip />
              <Bar dataKey="count" fill="#679436" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
