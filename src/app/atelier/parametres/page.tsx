import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { ProfileForm } from "@/components/dashboard/profile-form";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Paramètres | EcoRide Atelier",
  description: "Paramètres du compte technicien EcoRide.",
};

export default async function ParametresTechnicienPage() {
  const session = await getSession();
  if (!session) redirect("/connexion");

  const utilisateur = await prisma.utilisateur.findUnique({
    where: { idClient: session.idClient },
  });

  if (!utilisateur) redirect("/connexion");

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main className="ec-container py-8">
        <div className="flex flex-col gap-6 md:flex-row">
          <SidebarNav
            role="technicien"
            activePath="/atelier/parametres"
            prenom={session.prenom}
            nom={session.nom}
          />

          <div className="min-w-0 flex-1 space-y-4">
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
        </div>
      </main>
      <Footer />
    </div>
  );
}
