const features = [
  {
    title: "Ecologie",
    text: "Zero emission, 100% electrique. Rejoignez la revolution de la mobilite durable.",
    icon: "Feuille",
  },
  {
    title: "Connectivite",
    text: "Fonctions intelligentes avec suivi GPS et integration d'application mobile.",
    icon: "Wifi",
  },
  {
    title: "Support",
    text: "Service client 24h/24 et reseau de maintenance disponible partout en France.",
    icon: "Casque",
  },
];

export function FeatureIconsSection() {
  return (
    <section className="border-y border-[var(--border)] bg-white py-8">
      <div className="ec-container grid gap-6 md:grid-cols-3">
        {features.map((feature) => (
          <article key={feature.title} className="text-center">
            <div className="mx-auto grid size-12 place-items-center rounded-full bg-lime-100 text-xs font-semibold text-[var(--primary)]">
              {feature.icon}
            </div>
            <h3 className="mt-3 font-semibold text-[var(--title)]">{feature.title}</h3>
            <p className="mt-2 text-sm text-slate-600">{feature.text}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
