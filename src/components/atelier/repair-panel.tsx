/**
 * US-A2 — Reparations SAV.
 * Formulaire d'enregistrement + historique filtrable par trottinette.
 */
"use client";

import { useActionState, useMemo, useState } from "react";
import { reparationAction } from "@/app/actions/atelier";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ReparationItem, TrottinetteOption } from "@/types/atelier";

type RepairPanelProps = {
  trottinettes: TrottinetteOption[];
  reparations: ReparationItem[];
};

const initialState = { error: undefined as string | undefined, success: undefined as string | undefined };

function formatDate(value: string) {
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export function RepairPanel({ trottinettes, reparations }: RepairPanelProps) {
  const [state, formAction, isPending] = useActionState(reparationAction, initialState);
  const [filterTrottinette, setFilterTrottinette] = useState("");

  const filteredReparations = useMemo(() => {
    if (!filterTrottinette) {
      return reparations;
    }

    const selected = trottinettes.find((item) => String(item.idTrottinettes) === filterTrottinette);
    if (!selected) {
      return reparations;
    }

    return reparations.filter((item) => item.modele === selected.modele);
  }, [reparations, filterTrottinette, trottinettes]);

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <form action={formAction} className="ec-card space-y-4 p-6">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-[var(--title)]">Nouvelle reparation</h2>
          <p className="text-sm text-slate-600">Enregistrez une intervention avec commentaire et statut.</p>
        </div>

        {state.error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
        ) : null}
        {state.success ? (
          <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{state.success}</p>
        ) : null}

        <Select
          label="Trottinette"
          name="idTrottinettes"
          placeholder="Choisir une trottinette"
          required
          options={trottinettes.map((item) => ({
            value: String(item.idTrottinettes),
            label: item.modele,
          }))}
        />
        <Select
          label="Statut"
          name="statut"
          defaultValue="terminee"
          options={[
            { value: "en_cours", label: "En cours" },
            { value: "terminee", label: "Terminee" },
          ]}
        />
        <Textarea
          label="Commentaire"
          name="commentaire"
          placeholder="Pneu change, freins regles, diagnostic batterie..."
          required
        />

        <Button className="w-full" disabled={isPending} type="submit">
          {isPending ? "Enregistrement..." : "Enregistrer la reparation"}
        </Button>
      </form>

      <div className="ec-card space-y-4 p-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-lg font-semibold text-[var(--title)]">Historique</h2>
          <div className="w-full sm:w-56">
            <Select
              label="Filtrer par modele"
              name="filter"
              value={filterTrottinette}
              onChange={(event) => setFilterTrottinette(event.target.value)}
              placeholder="Tous les modeles"
              options={trottinettes.map((item) => ({
                value: String(item.idTrottinettes),
                label: item.modele,
              }))}
            />
          </div>
        </div>

        {filteredReparations.length === 0 ? (
          <p className="text-sm text-slate-500">Aucune reparation enregistree.</p>
        ) : (
          <ul className="max-h-[28rem] space-y-3 overflow-y-auto">
            {filteredReparations.map((reparation) => (
              <li
                key={reparation.idReparations}
                className="rounded-lg border border-[var(--border)] p-3 text-sm"
              >
                <div className="flex items-start justify-between gap-2">
                  <p className="font-medium">{reparation.modele}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      reparation.statut === "terminee"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-blue-100 text-blue-800"
                    }`}
                  >
                    {reparation.statut === "terminee" ? "Terminee" : "En cours"}
                  </span>
                </div>
                <p className="mt-1 text-slate-600">
                  {reparation.technicien} · {formatDate(reparation.dateReparation)}
                </p>
                <p className="mt-2 text-slate-700">{reparation.commentaire}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
