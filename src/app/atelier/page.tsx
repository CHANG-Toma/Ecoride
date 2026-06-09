import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { LogoutButton } from "@/components/auth/logout-button";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Atelier | EcoRide",
};

export default async function AtelierPage() {
  const session = await getSession();

  if (!session) {
    redirect("/connexion");
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main className="ec-container py-10">
        <div className="ec-card max-w-2xl space-y-4 p-6">
          <h1 className="text-2xl font-semibold text-[var(--title)]">Espace atelier</h1>
          <p className="text-slate-600">
            Interface technicien pour {session.prenom} {session.nom}.
          </p>
          <p className="text-sm text-slate-500">
            Inventaire, sorties de stock et reparations seront developpes dans la partie Atelier / SAV.
          </p>
          <LogoutButton />
        </div>
      </main>
      <Footer />
    </div>
  );
}
