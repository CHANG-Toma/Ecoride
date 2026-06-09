import Link from "next/link";
import { UserForm } from "@/components/admin/user-form";

export const metadata = {
  title: "Nouvel utilisateur | Administration EcoRide",
};

export default function NouveauUtilisateurPage() {
  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/utilisateurs"
          className="text-sm text-[var(--accent-strong)] hover:underline"
        >
          Retour aux utilisateurs
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--title)]">Ajouter un utilisateur</h1>
      </div>
      <UserForm />
    </div>
  );
}
