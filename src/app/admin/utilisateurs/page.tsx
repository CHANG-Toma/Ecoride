import Link from "next/link";
import { DeleteUserButton } from "@/components/admin/delete-user-button";
import { ROLE_LABELS } from "@/types/admin";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Utilisateurs | Administration EcoRide",
};

export default async function UtilisateursPage() {
  const utilisateurs = await prisma.utilisateur.findMany({
    select: {
      idClient: true,
      nom: true,
      prenom: true,
      email: true,
      role: true,
      ville: true,
      dateInscription: true,
    },
    orderBy: { dateInscription: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--title)]">Gestion utilisateurs</h1>
          <p className="mt-1 text-sm text-slate-600">
            Controlez les acces en gerant les roles et permissions.
          </p>
        </div>
        <Link
          href="/admin/utilisateurs/nouveau"
          className="inline-flex h-11 items-center rounded-lg bg-[var(--primary)] px-4 text-sm font-semibold text-white hover:bg-[var(--primary-strong)]"
        >
          Ajouter un utilisateur
        </Link>
      </div>

      <div className="ec-card overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-slate-500">
              <th className="px-4 py-3 font-medium">Nom</th>
              <th className="px-4 py-3 font-medium">Email</th>
              <th className="px-4 py-3 font-medium">Role</th>
              <th className="px-4 py-3 font-medium">Ville</th>
              <th className="px-4 py-3 font-medium">Inscription</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {utilisateurs.map((u) => (
              <tr key={u.idClient} className="border-b border-[var(--border)] last:border-0">
                <td className="px-4 py-3 font-medium">
                  {u.prenom} {u.nom}
                </td>
                <td className="px-4 py-3">{u.email}</td>
                <td className="px-4 py-3">
                  <span className="rounded-full bg-[var(--background)] px-2 py-0.5 text-xs font-medium text-[var(--accent-strong)]">
                    {ROLE_LABELS[u.role] ?? u.role}
                  </span>
                </td>
                <td className="px-4 py-3">{u.ville}</td>
                <td className="px-4 py-3">
                  {u.dateInscription.toLocaleDateString("fr-FR")}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/utilisateurs/${u.idClient}`}
                      className="text-sm font-medium text-[var(--accent-strong)] hover:underline"
                    >
                      Modifier
                    </Link>
                    <DeleteUserButton id={u.idClient} email={u.email} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
