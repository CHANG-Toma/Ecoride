/**
 * US-A1 — Inventaire atelier.
 * Tableau du stock avec recherche par modele, filtre categorie et alertes seuil.
 */
"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import type { StockInventoryItem } from "@/types/atelier";

type StockInventoryProps = {
  items: StockInventoryItem[];
  categories: string[];
};

export function StockInventory({ items, categories }: StockInventoryProps) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tous");
  const [alertOnly, setAlertOnly] = useState(false);

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.modele.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "Tous" || item.categorie === category;
      const matchesAlert = !alertOnly || item.isAlert;
      return matchesSearch && matchesCategory && matchesAlert;
    });
  }, [items, search, category, alertOnly]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1">
          <Input
            label="Rechercher un modele"
            name="search"
            placeholder="Ex: EcoRide City One"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <Badge active={category === "Tous"} onClick={() => setCategory("Tous")}>
            Tous
          </Badge>
          {categories.map((name) => (
            <Badge key={name} active={category === name} onClick={() => setCategory(name)}>
              {name}
            </Badge>
          ))}
          <Badge active={alertOnly} onClick={() => setAlertOnly((value) => !value)}>
            Alerte stock
          </Badge>
        </div>
      </div>

      <div className="overflow-x-auto rounded-xl border border-[var(--border)] bg-white">
        <table className="min-w-full text-left text-sm">
          <thead className="border-b border-[var(--border)] bg-[var(--background)]">
            <tr>
              <th className="px-4 py-3 font-semibold text-[var(--title)]">Modele</th>
              <th className="px-4 py-3 font-semibold text-[var(--title)]">Categorie</th>
              <th className="px-4 py-3 font-semibold text-[var(--title)]">Disponible</th>
              <th className="px-4 py-3 font-semibold text-[var(--title)]">Seuil</th>
              <th className="px-4 py-3 font-semibold text-[var(--title)]">Statut</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td className="px-4 py-6 text-slate-500" colSpan={5}>
                  Aucun resultat pour ces filtres.
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={item.idStock} className="border-b border-[var(--border)] last:border-0">
                  <td className="px-4 py-3 font-medium">{item.modele}</td>
                  <td className="px-4 py-3 text-slate-600">{item.categorie}</td>
                  <td className="px-4 py-3">{item.quantiteDisponible}</td>
                  <td className="px-4 py-3 text-slate-600">{item.seuilAlerte}</td>
                  <td className="px-4 py-3">
                    {item.isAlert ? (
                      <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                        Alerte
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
                        OK
                      </span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
