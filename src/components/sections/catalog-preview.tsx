import { prisma } from "@/lib/prisma";
import { SectionTitle } from "@/components/ui/section-title";
import { CatalogPreviewClient } from "./catalog-preview-client";

export async function CatalogPreviewSection() {
  // Fetch categories from the database
  const categories = await prisma.categorie.findMany({
    select: {
      idCategories: true,
      nom: true,
    },
  });

  // Fetch all active/available scooters from the database
  const rawProducts = await prisma.trottinette.findMany({
    where: {
      isDisponible: true,
    },
    include: {
      categorie: {
        select: {
          idCategories: true,
          nom: true,
        },
      },
      stock: {
        select: {
          quantiteDisponible: true,
        },
      },
    },
    orderBy: {
      idTrottinettes: "asc",
    },
  });

  // Map Decimal prices and weights to standard numbers for JSON serialization
  const products = rawProducts.map((p) => ({
    ...p,
    prix: Number(p.prix),
    poids: Number(p.poids),
  }));

  return (
    <section className="ec-container space-y-8 py-10">
      <SectionTitle
        centered
        eyebrow="Notre collection de trottinettes"
        title="Explorez notre gamme EcoRide"
        description="Trouvez la trottinette électrique idéale pour vos trajets quotidiens. Nos modèles sont fiables, performants et éco-responsables."
      />

      <CatalogPreviewClient categories={categories} products={products} />
    </section>
  );
}
