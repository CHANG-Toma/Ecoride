import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="ec-container grid items-center gap-8 py-10 md:grid-cols-2 md:py-14">
      <div className="space-y-4">
        <h1 className="text-4xl font-semibold leading-tight text-[var(--title)] md:text-5xl">
          Roulez vers le futur, durablement
        </h1>
        <p className="max-w-xl text-base text-slate-600">
          Des trottinettes électriques premium conçues pour une mobilité urbaine
          responsable. Profitez de la liberté, de la technologie et du confort au quotidien.
        </p>
        <div className="flex flex-wrap gap-3">
          <Button>Découvrir</Button>
          <Button variant="secondary">En savoir plus</Button>
        </div>
      </div>

      <article className="ec-card overflow-hidden">
        <div className="h-64 w-full bg-gradient-to-br from-stone-200 via-stone-300 to-slate-400" />
      </article>
    </section>
  );
}
