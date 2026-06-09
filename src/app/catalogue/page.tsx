import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { CatalogPage } from "@/components/sections/catalog-page";
import { prisma } from "@/lib/prisma";

type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;

export default async function CataloguePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  // Resolve URL search parameters
  const resolvedParams = await searchParams;
  const initialId = typeof resolvedParams.id === "string" ? parseInt(resolvedParams.id, 10) : undefined;

  // Retrieve categories from database
  const categories = await prisma.categorie.findMany({
    select: {
      idCategories: true,
      nom: true,
      description: true,
    },
    orderBy: {
      nom: "asc",
    },
  });

  // Retrieve products from database
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
          seuilAlerte: true,
        },
      },
    },
    orderBy: {
      idTrottinettes: "asc",
    },
  });

  // Map Decimal fields to numbers for client component serialization
  const products = rawProducts.map((p) => ({
    ...p,
    prix: Number(p.prix),
    poids: Number(p.poids),
  }));

  return (
    <div className="min-h-screen bg-[var(--background)] flex flex-col justify-between">
      <Navbar />
      <main className="flex-grow ec-container py-10">
        <CatalogPage
          categories={categories}
          products={products}
          initialProductId={initialId}
        />
      </main>
      <Footer />
    </div>
  );
}
