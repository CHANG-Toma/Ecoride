import Link from "next/link";
import { TrottinetteForm } from "@/components/admin/trottinette-form";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Nouveau modele | Administration EcoRide",
};

export default async function NouveauTrottinettePage() {
  const categories = await prisma.categorie.findMany({ orderBy: { nom: "asc" } });

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/trottinettes"
          className="text-sm text-[var(--accent-strong)] hover:underline"
        >
          Retour au catalogue
        </Link>
        <h1 className="mt-2 text-2xl font-semibold text-[var(--title)]">Ajouter un modele</h1>
      </div>
      <TrottinetteForm categories={categories} />
    </div>
  );
}
