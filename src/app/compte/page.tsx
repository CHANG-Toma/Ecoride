import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { getSession } from "@/lib/auth/session";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Mon compte | EcoRide",
};

export default async function ComptePage() {
  const session = await getSession();

  if (!session) {
    redirect("/connexion");
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main className="ec-container py-10">
        <div className="ec-card max-w-2xl space-y-4 p-6">
          <h1 className="text-2xl font-semibold text-[var(--title)]">Mon compte</h1>
          <p className="text-slate-600">
            Bienvenue {session.prenom} {session.nom}.
          </p>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-medium text-slate-500">Email</dt>
              <dd>{session.email}</dd>
            </div>
            <div>
              <dt className="font-medium text-slate-500">Role</dt>
              <dd className="capitalize">{session.role}</dd>
            </div>
          </dl>
          <p className="text-sm text-slate-500">
            Historique des commandes et garanties seront disponibles dans la partie Espace client.
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}
