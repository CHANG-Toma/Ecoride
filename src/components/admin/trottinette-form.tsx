"use client";

import { useActionState } from "react";
import {
  createTrottinetteAction,
  updateTrottinetteAction,
} from "@/app/actions/admin/trottinettes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import type { AdminActionState } from "@/types/admin";

type Categorie = { idCategories: number; nom: string };

type TrottinetteData = {
  modele: string;
  idCategories: number;
  poids: number;
  vitesseMax: number;
  prix: number;
  autonomie: number;
  isDisponible: boolean;
  quantiteDisponible: number;
  seuilAlerte: number;
};

type TrottinetteFormProps = {
  categories: Categorie[];
  trottinette?: TrottinetteData;
  id?: number;
};

const initialState: AdminActionState = {};

export function TrottinetteForm({ categories, trottinette, id }: TrottinetteFormProps) {
  const action = id
    ? updateTrottinetteAction.bind(null, id)
    : createTrottinetteAction;

  const [state, formAction, isPending] = useActionState(action, initialState);

  const categoryOptions = categories.map((c) => ({
    value: String(c.idCategories),
    label: c.nom,
  }));

  return (
    <form action={formAction} className="ec-card space-y-4 p-6">
      {state.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      ) : null}
      {state.success ? (
        <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{state.success}</p>
      ) : null}

      <Input label="Modele" name="modele" defaultValue={trottinette?.modele} required />
      <Select
        label="Categorie"
        name="idCategories"
        defaultValue={String(trottinette?.idCategories ?? categories[0]?.idCategories ?? "")}
        options={categoryOptions}
        required
      />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Poids (kg)"
          name="poids"
          type="number"
          step="0.1"
          min="0"
          defaultValue={trottinette?.poids}
          required
        />
        <Input
          label="Vitesse max (km/h)"
          name="vitesseMax"
          type="number"
          min="1"
          defaultValue={trottinette?.vitesseMax}
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Prix (€)"
          name="prix"
          type="number"
          step="0.01"
          min="0"
          defaultValue={trottinette?.prix}
          required
        />
        <Input
          label="Autonomie (km)"
          name="autonomie"
          type="number"
          min="1"
          defaultValue={trottinette?.autonomie}
          required
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Quantite en stock"
          name="quantiteDisponible"
          type="number"
          min="0"
          defaultValue={trottinette?.quantiteDisponible ?? 0}
          required
        />
        <Input
          label="Seuil d'alerte"
          name="seuilAlerte"
          type="number"
          min="0"
          defaultValue={trottinette?.seuilAlerte ?? 5}
          required
        />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          name="isDisponible"
          defaultChecked={trottinette?.isDisponible ?? true}
          className="h-4 w-4 rounded border-[var(--border)]"
        />
        Disponible a la vente
      </label>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Enregistrement..." : id ? "Mettre a jour" : "Creer le modele"}
        </Button>
      </div>
    </form>
  );
}
