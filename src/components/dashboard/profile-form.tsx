"use client";

import { useActionState } from "react";
import { updateProfileAction, updatePasswordAction } from "@/app/actions/compte";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { ProfileActionState } from "@/app/actions/compte";

type ProfileFormProps = {
  defaultValues: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    adresse: string;
    ville: string;
    codePostal: string;
  };
};

const initialState: ProfileActionState = {};

export function ProfileForm({ defaultValues }: ProfileFormProps) {
  const [profileState, profileAction, profilePending] = useActionState(
    updateProfileAction,
    initialState,
  );
  const [passwordState, passwordAction, passwordPending] = useActionState(
    updatePasswordAction,
    initialState,
  );

  return (
    <div className="space-y-6">
      {/* Profile section */}
      <section className="ec-card p-6">
        <h2 className="mb-5 text-lg font-semibold text-[var(--title)]">
          Informations personnelles
        </h2>
        <form action={profileAction} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Prénom" name="prenom" defaultValue={defaultValues.prenom} required />
            <Input label="Nom" name="nom" defaultValue={defaultValues.nom} required />
          </div>
          <Input
            label="Email"
            name="email"
            type="email"
            defaultValue={defaultValues.email}
            disabled
            className="opacity-60"
          />
          <Input
            label="Téléphone"
            name="telephone"
            type="tel"
            defaultValue={defaultValues.telephone}
            placeholder="0612345678"
          />
          <Input
            label="Adresse"
            name="adresse"
            defaultValue={defaultValues.adresse}
            required
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Code postal" name="codePostal" defaultValue={defaultValues.codePostal} required />
            <Input label="Ville" name="ville" defaultValue={defaultValues.ville} required />
          </div>

          {profileState.error && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {profileState.error}
            </p>
          )}
          {profileState.success && (
            <p className="rounded-lg bg-green-50 px-4 py-2.5 text-sm text-green-700">
              {profileState.success}
            </p>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="primary"
              disabled={profilePending}
              id="save-profile-btn"
            >
              {profilePending ? "Enregistrement…" : "Enregistrer"}
            </Button>
          </div>
        </form>
      </section>

      {/* Password section */}
      <section className="ec-card p-6">
        <h2 className="mb-5 text-lg font-semibold text-[var(--title)]">
          Changer le mot de passe
        </h2>
        <form action={passwordAction} className="space-y-4">
          <Input
            label="Mot de passe actuel"
            name="currentPassword"
            type="password"
            autoComplete="current-password"
            required
          />
          <Input
            label="Nouveau mot de passe"
            name="newPassword"
            type="password"
            autoComplete="new-password"
            required
          />
          <Input
            label="Confirmer le nouveau mot de passe"
            name="confirmPassword"
            type="password"
            autoComplete="new-password"
            required
          />

          {passwordState.error && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {passwordState.error}
            </p>
          )}
          {passwordState.success && (
            <p className="rounded-lg bg-green-50 px-4 py-2.5 text-sm text-green-700">
              {passwordState.success}
            </p>
          )}

          <div className="flex justify-end">
            <Button
              type="submit"
              variant="secondary"
              disabled={passwordPending}
              id="change-password-btn"
            >
              {passwordPending ? "Modification…" : "Modifier le mot de passe"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
