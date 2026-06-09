"use client";

import Link from "next/link";
import { useActionState } from "react";
import { registerAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState = { error: undefined as string | undefined };

export function RegisterForm() {
  const [state, formAction, isPending] = useActionState(registerAction, initialState);

  return (
    <form action={formAction} className="ec-card space-y-4 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-[var(--title)]">Inscription</h1>
        <p className="text-sm text-slate-600">Creez votre compte client EcoRide.</p>
      </div>

      {state.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      ) : null}

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Prenom" name="prenom" autoComplete="given-name" required />
        <Input label="Nom" name="nom" autoComplete="family-name" required />
      </div>

      <Input label="Email" name="email" type="email" autoComplete="email" required />
      <Input label="Telephone" name="telephone" type="tel" autoComplete="tel" />
      <Input
        label="Mot de passe"
        name="password"
        type="password"
        autoComplete="new-password"
        minLength={8}
        required
      />
      <Input label="Adresse" name="adresse" autoComplete="street-address" required />
      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="Ville" name="ville" autoComplete="address-level2" required />
        <Input label="Code postal" name="codePostal" autoComplete="postal-code" required />
      </div>

      <Button className="w-full" disabled={isPending} type="submit">
        {isPending ? "Creation..." : "Creer mon compte"}
      </Button>

      <p className="text-center text-sm text-slate-600">
        Deja inscrit ?{" "}
        <Link className="font-medium text-[var(--accent-strong)] hover:underline" href="/connexion">
          Se connecter
        </Link>
      </p>
    </form>
  );
}
