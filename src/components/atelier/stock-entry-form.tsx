/**
 * Entree de stock — retour d'une trottinette en inventaire.
 * Formulaire d'entree + historique des dernieres operations.
 */
"use client";

import { useActionState } from "react";
import { entreeStockAction } from "@/app/actions/atelier";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { EntreeStockItem, TrottinetteOption } from "@/types/atelier";

type StockEntryFormProps = {
  trottinettes: TrottinetteOption[];
  recentEntrees: EntreeStockItem[];
};

const initialState = { error: undefined as string | undefined, success: undefined as string | undefined };

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
}

export function StockEntryForm({ trottinettes, recentEntrees }: StockEntryFormProps) {
  const [state, formAction, isPending] = useActionState(entreeStockAction, initialState);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form action={formAction} className="ec-card space-y-4 p-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-[var(--title)]">Entree de stock</h2>
          <p className="text-sm text-slate-600">
            Remettez une trottinette en inventaire apres reparation ou retour.
          </p>
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
        <Input
          label="Motif (optionnel)"
          name="motif"
          placeholder="Retour reparation, annulation..."
        />

        <Button className="w-full" disabled={isPending} type="submit">
          {isPending ? "Enregistrement..." : "Valider l'entree"}
        </Button>
      </form>

      <div className="ec-card space-y-4 p-6">
        <h2 className="text-lg font-semibold text-[var(--title)]">Dernieres entrees</h2>
        {recentEntrees.length === 0 ? (
          <p className="text-sm text-slate-500">Aucune entree enregistree.</p>
        ) : (
          <ul className="space-y-3">
            {recentEntrees.map((entree) => (
              <li key={entree.idEntreeStock} className="rounded-lg border border-[var(--border)] p-3 text-sm">
                <p className="font-medium">{entree.modele}</p>
                <p className="text-slate-600">
                  +{entree.quantite} · {entree.technicien} · {formatDate(entree.dateEntree)}
                </p>
                {entree.motif ? <p className="mt-1 text-slate-500">{entree.motif}</p> : null}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
