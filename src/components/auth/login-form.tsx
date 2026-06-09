"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction } from "@/app/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const initialState = { error: undefined as string | undefined };

export function LoginForm() {
  const [state, formAction, isPending] = useActionState(loginAction, initialState);

  return (
    <form action={formAction} className="ec-card space-y-4 p-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold text-[var(--title)]">Connexion</h1>
        <p className="text-sm text-slate-600">Accedez a votre espace EcoRide.</p>
      </div>

      {state.error ? (
        <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
      ) : null}

      <Input label="Email" name="email" type="email" autoComplete="email" required />
      <Input
        label="Mot de passe"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />

      <Button className="w-full" disabled={isPending} type="submit">
        {isPending ? "Connexion..." : "Se connecter"}
      </Button>

      <p className="text-center text-sm text-slate-600">
        Pas encore de compte ?{" "}
        <Link className="font-medium text-[var(--accent-strong)] hover:underline" href="/inscription">
          Creer un compte
        </Link>
      </p>
    </form>
  );
}
