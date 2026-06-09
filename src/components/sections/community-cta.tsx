import { Button } from "@/components/ui/button";

export function CommunityCtaSection() {
  return (
    <section className="ec-container py-8">
      <article className="mx-auto max-w-md rounded-xl border border-dashed border-[var(--border)] bg-white p-6 text-center">
        <p className="text-sm font-semibold text-[var(--title)]">Rejoignez la communaute EcoRide</p>
        <p className="mt-2 text-sm text-slate-600">
          Connectez-vous pour acceder a votre espace personnalise, suivre vos trajets,
          surveiller la batterie et gerer votre trottinette.
        </p>
        <Button className="mt-4 w-full">Connexion / Inscription</Button>
      </article>
    </section>
  );
}
