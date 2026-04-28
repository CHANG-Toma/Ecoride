export default function Home() {
  const modules = [
    {
      title: "Catalogue e-commerce",
      description:
        "Liste des trottinettes, filtres, fiches details et comparateur pour le front-office.",
    },
    {
      title: "Panier et commandes",
      description:
        "Preparation d'achat client avec suivi des commandes et historique.",
    },
    {
      title: "Stocks atelier",
      description:
        "Mouvements d'inventaire (entree/sortie/ajustement) et visibilite des niveaux de stock.",
    },
    {
      title: "Maintenance",
      description:
        "Suivi des reparations par technicien avec historique d'interventions.",
    },
    {
      title: "Administration",
      description:
        "Gestion des utilisateurs, roles et tableaux de bord de performance.",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-950 px-6 py-10 text-slate-100">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="space-y-3">
          <p className="text-sm uppercase tracking-[0.2em] text-lime-300">EcoRide</p>
          <h1 className="text-4xl font-semibold">Socle Next.js + BDD PostgreSQL pret</h1>
          <p className="max-w-3xl text-slate-300">
            Initialisation basee sur le cahier des charges: e-commerce, ERP atelier,
            administration et suivi maintenance.
          </p>
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {modules.map((module) => (
            <article
              key={module.title}
              className="rounded-xl border border-slate-800 bg-slate-900 p-5"
            >
              <h2 className="text-lg font-medium text-lime-300">{module.title}</h2>
              <p className="mt-2 text-sm text-slate-300">{module.description}</p>
            </article>
          ))}
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-5">
          <h2 className="text-lg font-medium text-lime-300">Prochaines etapes techniques</h2>
          <ul className="mt-3 list-inside list-disc space-y-1 text-sm text-slate-300">
            <li>Demarrer la base: docker compose up -d</li>
            <li>Creer le fichier .env a partir de .env.example</li>
            <li>Generer le client Prisma: npx prisma generate</li>
            <li>Creer la migration initiale: npx prisma migrate dev --name init</li>
          </ul>
        </section>
      </main>
    </div>
  );
}
