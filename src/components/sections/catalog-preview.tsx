import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/ui/section-title";

const filters = ["Tous", "Urbain", "Tout-terrain", "Pliable"];

const products = [
  { name: "Urban Glide Pro", price: "$999" },
  { name: "Mountain Explorer", price: "$1299" },
  { name: "Commute Lite", price: "$599" },
  { name: "City Swift", price: "$749" },
  { name: "Compact Fold X", price: "$529" },
  { name: "Trail Blazer", price: "$1499" },
];

export function CatalogPreviewSection() {
  return (
    <section className="ec-container space-y-6 py-10">
      <SectionTitle
        centered
        eyebrow="Notre collection de trottinettes"
        title="Composants du catalogue"
        description="Base UI reutilisable pour la liste produits, les filtres et les cartes e-commerce."
      />

      <div className="flex flex-wrap justify-center gap-2">
        {filters.map((filter, index) => (
          <Badge key={filter} active={index === 0}>
            {filter}
          </Badge>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <article key={product.name} className="ec-card overflow-hidden">
            <div className="h-32 w-full bg-gradient-to-br from-slate-200 to-slate-300" />
            <div className="space-y-3 p-4">
              <h3 className="font-semibold text-[var(--title)]">{product.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-[var(--accent-strong)]">{product.price}</span>
                <Button className="h-9 min-w-20 px-3 text-xs">Acheter</Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
