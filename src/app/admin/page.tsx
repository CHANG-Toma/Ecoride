import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Administration | EcoRide",
};

export default async function AdminPage() {
  const session = await getSession();

  if (!session) {
    redirect("/connexion");
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main className="ec-container py-10">
        <div className="ec-card max-w-2xl space-y-4 p-6">
          <h1 className="text-2xl font-semibold text-[var(--title)]">Back-office admin</h1>
          <p className="text-slate-600">
            Bonjour {session.prenom}, vous etes connecte en tant qu&apos;administrateur.
          </p>
          <p className="text-sm text-slate-500">
            CRUD produits, gestion utilisateurs et dashboard ventes seront developpes dans la partie
            Back-office Admin.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
