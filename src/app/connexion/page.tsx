import Link from "next/link";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/auth/login-form";
import { getSession } from "@/lib/auth/session";
import { getDefaultRedirectForRole } from "@/lib/auth/roles";

export const metadata = {
  title: "Connexion | EcoRide",
};

export default async function ConnexionPage() {
  const session = await getSession();

  if (session) {
    redirect(getDefaultRedirectForRole(session.role));
  }

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="ec-container flex min-h-screen flex-col justify-center py-10">
        <div className="mx-auto w-full max-w-md">
          <Link className="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 hover:text-[var(--accent-strong)]" href="/">
            <span aria-hidden="true">←</span> Retour a l&apos;accueil
          </Link>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
