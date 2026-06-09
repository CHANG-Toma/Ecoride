import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteUserButton } from "@/components/admin/delete-user-button";
import { UserForm } from "@/components/admin/user-form";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const user = await prisma.utilisateur.findUnique({
    where: { idClient: Number(id) },
  });
  return {
    title: user
      ? `${user.prenom} ${user.nom} | Administration EcoRide`
      : "Utilisateur | Administration EcoRide",
  };
}

export default async function EditUtilisateurPage({ params }: PageProps) {
  const { id } = await params;
  const idNum = Number(id);

  const user = await prisma.utilisateur.findUnique({
    where: { idClient: idNum },
    select: {
      idClient: true,
      nom: true,
      prenom: true,
      email: true,
      telephone: true,
      adresse: true,
      ville: true,
      codePostal: true,
      role: true,
    },
  });

  if (!user) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/utilisateurs"
            className="text-sm text-[var(--accent-strong)] hover:underline"
          >
            Retour aux utilisateurs
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-[var(--title)]">
            Modifier {user.prenom} {user.nom}
          </h1>
        </div>
        <DeleteUserButton id={user.idClient} email={user.email} />
      </div>
      <UserForm id={user.idClient} user={user} />
    </div>
  );
}
