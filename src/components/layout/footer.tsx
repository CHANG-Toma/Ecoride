const columns = [
  {
    title: "Support",
    links: ["Centre d'aide", "Contact", "FAQ", "Garantie"],
  },
  {
    title: "Mentions legales",
    links: [
      "Politique de confidentialite",
      "Conditions d'utilisation",
      "Politique des cookies",
      "Conformite",
    ],
  },
  {
    title: "Produits",
    links: ["Modeles urbains", "Serie tout-terrain", "Gamme pliable", "Accessoires"],
  },
];

export function Footer() {
  return (
    <footer className="mt-16 bg-[var(--primary)] py-10 text-white">
      <div className="ec-container space-y-8">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <p className="text-lg font-semibold">EcoRide</p>
            <p className="mt-2 text-sm text-lime-100">
              Mobilite durable et connectee pour la ville.
            </p>
          </div>
          {columns.map((column) => (
            <div key={column.title}>
              <p className="text-sm font-semibold">{column.title}</p>
              <ul className="mt-3 space-y-2 text-sm text-lime-100">
                {column.links.map((link) => (
                  <li key={link}>{link}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="border-t border-lime-300/30 pt-4 text-xs text-lime-100">
          © 2026 EcoRide. Tous droits reserves.
        </p>
      </div>
    </footer>
  );
}
