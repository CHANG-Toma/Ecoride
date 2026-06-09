import { ProfileForm } from "@/components/dashboard/profile-form";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Paramètres | EcoRide Admin",
  description: "Paramètres du compte administrateur EcoRide.",
};

export default async function ParametresAdminPage() {
  const session = await getSession();
  if (!session) redirect("/connexion");

  const utilisateur = await prisma.utilisateur.findUnique({
    where: { idClient: session.idClient },
  });

  if (!utilisateur) redirect("/connexion");

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-[var(--title)]">
        Paramètres du compte
      </h1>
      <ProfileForm
        defaultValues={{
          nom: utilisateur.nom,
          prenom: utilisateur.prenom,
          email: utilisateur.email,
          telephone: utilisateur.telephone ?? "",
          adresse: utilisateur.adresse,
          ville: utilisateur.ville,
          codePostal: utilisateur.codePostal,
        }}
      />
    </div>
  );
}
