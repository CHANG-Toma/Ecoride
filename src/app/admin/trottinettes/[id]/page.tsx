import Link from "next/link";
import { notFound } from "next/navigation";
import { DeleteTrottinetteButton } from "@/components/admin/delete-trottinette-button";
import { TrottinetteForm } from "@/components/admin/trottinette-form";
import { prisma } from "@/lib/prisma";

type PageProps = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const trottinette = await prisma.trottinette.findUnique({
    where: { idTrottinettes: Number(id) },
  });
  return {
    title: trottinette
      ? `${trottinette.modele} | Administration EcoRide`
      : "Modele | Administration EcoRide",
  };
}

export default async function EditTrottinettePage({ params }: PageProps) {
  const { id } = await params;
  const idNum = Number(id);

  const [trottinette, categories] = await Promise.all([
    prisma.trottinette.findUnique({
      where: { idTrottinettes: idNum },
      include: { stock: true },
    }),
    prisma.categorie.findMany({ orderBy: { nom: "asc" } }),
  ]);

  if (!trottinette) notFound();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link
            href="/admin/trottinettes"
            className="text-sm text-[var(--accent-strong)] hover:underline"
          >
            Retour au catalogue
          </Link>
          <h1 className="mt-2 text-2xl font-semibold text-[var(--title)]">
            Modifier {trottinette.modele}
          </h1>
        </div>
        <DeleteTrottinetteButton id={trottinette.idTrottinettes} modele={trottinette.modele} />
      </div>
      <TrottinetteForm
        id={trottinette.idTrottinettes}
        categories={categories}
        trottinette={{
          modele: trottinette.modele,
          idCategories: trottinette.idCategories,
          poids: trottinette.poids.toNumber(),
          vitesseMax: trottinette.vitesseMax,
          prix: trottinette.prix.toNumber(),
          autonomie: trottinette.autonomie,
          isDisponible: trottinette.isDisponible,
          quantiteDisponible: trottinette.stock?.quantiteDisponible ?? 0,
          seuilAlerte: trottinette.stock?.seuilAlerte ?? 5,
        }}
      />
    </div>
  );
}
