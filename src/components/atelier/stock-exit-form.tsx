/**
 * US-A3 — Sortie de stock.
 * Formulaire de sortie + historique des dernieres operations.
 */
"use client";

import { useActionState } from "react";
import { sortieStockAction } from "@/app/actions/atelier";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { SortieStockItem, TrottinetteOption } from "@/types/atelier";

type StockExitFormProps = {
  trottinettes: TrottinetteOption[];
  recentSorties: SortieStockItem[];
};

const initialState = { error: undefined as string | undefined, success: undefined as string | undefined };

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function StockExitForm({ trottinettes, recentSorties }: StockExitFormProps) {
  const [state, formAction, isPending] = useActionState(sortieStockAction, initialState);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form action={formAction} className="ec-card space-y-4 p-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-[var(--title)]">Sortie de stock</h2>
          <p className="text-sm text-slate-600">Enregistrez une sortie et mettez a jour l&apos;inventaire.</p>
        </div>

        {state.error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
        ) : null}
        {state.success ? (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{state.success}</p>
        ) : null}

        <Select
          label="Modele"
          name="idTrottinettes"
          placeholder="Choisir un modele"
          required
          options={trottinettes.map((item) => ({
            value: String(item.idTrottinettes),
            label: `${item.modele} (${item.stockDisponible} dispo.)`,
          }))}
        />
        <Input label="Quantite" min={1} name="quantite" required type="number" />
        <Input label="Motif (optionnel)" name="motif" placeholder="Reparation, demonstration..." />

        <Button className="w-full" disabled={isPending} type="submit">
          {isPending ? "Enregistrement..." : "Valider la sortie"}
        </Button>
      </form>

      <div className="ec-card space-y-4 p-6">
        <h2 className="text-lg font-semibold text-[var(--title)]">Dernieres sorties</h2>
        {recentSorties.length === 0 ? (
          <p className="text-sm text-slate-500">Aucune sortie enregistree.</p>
        ) : (
          <ul className="space-y-3">
            {recentSorties.map((sortie) => (
              <li key={sortie.idSortieStock} className="rounded-lg border border-[var(--border)] p-3 text-sm">
                <p className="font-medium">{sortie.modele}</p>
                <p className="text-slate-600">
                  -{sortie.quantite} · {sortie.technicien} · {formatDate(sortie.dateSortie)}
                </p>
                {sortie.motif ? <p className="mt-1 text-slate-500">{sortie.motif}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
