/**
 * Page principale atelier (bloc 5 — SAV).
 * Accessible aux roles technicien et admin.
 * Affiche les KPIs stock et les onglets : inventaire, sorties, entrees, reparations.
 */
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { AtelierTabs } from "@/components/atelier/atelier-tabs";
import { RepairPanel } from "@/components/atelier/repair-panel";
import { StockEntryForm } from "@/components/atelier/stock-entry-form";
import { StockExitForm } from "@/components/atelier/stock-exit-form";
import { StockInventory } from "@/components/atelier/stock-inventory";
import { getSession } from "@/lib/auth/session";
import {
  getCategories,
  getRecentEntreesStock,
  getRecentSortiesStock,
  getReparations,
  getStockInventory,
  getTrottinetteOptions,
} from "@/lib/atelier/queries";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Atelier | EcoRide",
};

export default async function AtelierPage() {
  const session = await getSession();

  if (!session) {
    redirect("/connexion");
  }

  if (session.role !== "technicien" && session.role !== "admin") {
    redirect("/");
  }

  const [inventory, categories, trottinettes, reparations, recentSorties, recentEntrees] =
    await Promise.all([
      getStockInventory(),
      getCategories(),
      getTrottinetteOptions(),
      getReparations(),
      getRecentSortiesStock(),
      getRecentEntreesStock(),
    ]);

  const alertCount = inventory.filter((item) => item.isAlert).length;

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main className="ec-container space-y-8 py-10">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold text-[var(--title)]">Espace atelier</h1>
          <p className="text-slate-600">
            Bonjour {session.prenom} {session.nom} — gestion du stock et du SAV.
          </p>
        </div>

        {/* KPIs : vue synthetique du stock avant les onglets detailles */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="ec-card p-4">
            <p className="text-sm text-slate-500">Modeles en stock</p>
            <p className="text-2xl font-semibold text-[var(--title)]">{inventory.length}</p>
          </div>
          <div className="ec-card p-4">
            <p className="text-sm text-slate-500">Unites disponibles</p>
            <p className="text-2xl font-semibold text-[var(--title)]">
              {inventory.reduce((total, item) => total + item.quantiteDisponible, 0)}
            </p>
          </div>
          <div className="ec-card p-4">
            <p className="text-sm text-slate-500">Alertes stock</p>
            <p className={`text-2xl font-semibold ${alertCount > 0 ? "text-amber-600" : "text-[var(--title)]"}`}>
              {alertCount}
            </p>
          </div>
        </div>

        {/* Onglets fonctionnels : US-A1, US-A3, US-A2 */}
        <AtelierTabs
          tabs={[
            {
              id: "inventaire",
              label: "Inventaire",
              content: <StockInventory categories={categories} items={inventory} />,
            },
            {
              id: "sorties",
              label: "Sorties de stock",
              content: (
                <StockExitForm recentSorties={recentSorties} trottinettes={trottinettes} />
              ),
            },
            {
              id: "entrees",
              label: "Entrees de stock",
              content: (
                <StockEntryForm recentEntrees={recentEntrees} trottinettes={trottinettes} />
              ),
            },
            {
              id: "reparations",
              label: "Reparations",
              content: <RepairPanel reparations={reparations} trottinettes={trottinettes} />,
            },
          ]}
        />
      </main>
      <Footer />
    </div>
  );
}
