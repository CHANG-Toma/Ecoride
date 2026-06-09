"use client";

import { useActionState } from "react";
import { createUserAction, updateUserAction } from "@/app/actions/admin/utilisateurs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { ROLES } from "@/types/auth";
import { ROLE_LABELS, ROLE_PERMISSIONS, type AdminActionState } from "@/types/admin";

type UserData = {
  nom: string;
  prenom: string;
  email: string;
  telephone: string | null;
  adresse: string;
  ville: string;
  codePostal: string;
  role: string;
};

type UserFormProps = {
  user?: UserData;
  id?: number;
};

const initialState: AdminActionState = {};

const roleOptions = ROLES.map((role) => ({
  value: role,
  label: ROLE_LABELS[role] ?? role,
}));

export function UserForm({ user, id }: UserFormProps) {
  const action = id ? updateUserAction.bind(null, id) : createUserAction;
  const [state, formAction, isPending] = useActionState(action, initialState);
  const selectedRole = user?.role ?? "client";

  return (
    <div className="space-y-6">
      <form action={formAction} className="ec-card space-y-4 p-6">
        {state.error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{state.error}</p>
        ) : null}
        {state.success ? (
          <p className="rounded-lg bg-green-50 px-3 py-2 text-sm text-green-700">{state.success}</p>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Nom" name="nom" defaultValue={user?.nom} required />
          <Input label="Prenom" name="prenom" defaultValue={user?.prenom} required />
        </div>
        <Input label="Email" name="email" type="email" defaultValue={user?.email} required />
        <Input label="Telephone" name="telephone" type="tel" defaultValue={user?.telephone ?? ""} />
        <Input label="Adresse" name="adresse" defaultValue={user?.adresse} required />
        <div className="grid gap-4 sm:grid-cols-2">
          <Input label="Ville" name="ville" defaultValue={user?.ville} required />
          <Input label="Code postal" name="codePostal" defaultValue={user?.codePostal} required />
        </div>
        <Select
          label="Role"
          name="role"
          defaultValue={selectedRole}
          options={roleOptions}
          required
        />
        <Input
          label={id ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}
          name="password"
          type="password"
          autoComplete="new-password"
          required={!id}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Enregistrement..." : id ? "Mettre a jour" : "Creer l'utilisateur"}
        </Button>
      </form>

      <div className="ec-card p-6">
        <h3 className="mb-3 text-sm font-semibold text-[var(--title)]">Permissions par role</h3>
        <div className="space-y-3">
          {ROLES.map((role) => (
            <div key={role}>
              <p className="text-sm font-medium text-slate-700">{ROLE_LABELS[role]}</p>
              <ul className="mt-1 list-inside list-disc text-sm text-slate-500">
                {ROLE_PERMISSIONS[role].map((perm) => (
                  <li key={perm}>{perm}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
