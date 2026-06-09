import Link from "next/link";
import { DeleteTrottinetteButton } from "@/components/admin/delete-trottinette-button";
import { prisma } from "@/lib/prisma";

export const metadata = {
  title: "Trottinettes | Administration EcoRide",
};

export default async function TrottinettesPage() {
  const trottinettes = await prisma.trottinette.findMany({
    include: { categorie: true, stock: true },
    orderBy: { modele: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[var(--title)]">Catalogue trottinettes</h1>
          <p className="mt-1 text-sm text-slate-600">
            Ajoutez, modifiez ou supprimez les modeles du catalogue.
          </p>
        </div>
        <Link
          href="/admin/trottinettes/nouveau"
          className="inline-flex h-11 items-center rounded-lg bg-[var(--primary)] px-4 text-sm font-semibold text-white hover:bg-[var(--primary-strong)]"
        >
          Ajouter un modele
        </Link>
      </div>

      <div className="ec-card overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--border)] text-slate-500">
              <th className="px-4 py-3 font-medium">Modele</th>
              <th className="px-4 py-3 font-medium">Categorie</th>
              <th className="px-4 py-3 font-medium">Prix</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Statut</th>
              <th className="px-4 py-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {trottinettes.map((t) => (
              <tr key={t.idTrottinettes} className="border-b border-[var(--border)] last:border-0">
                <td className="px-4 py-3 font-medium">{t.modele}</td>
                <td className="px-4 py-3">{t.categorie.nom}</td>
                <td className="px-4 py-3">{t.prix.toNumber().toFixed(2)} €</td>
                <td className="px-4 py-3">
                  {t.stock?.quantiteDisponible ?? 0}
                  {t.stock && t.stock.quantiteDisponible <= t.stock.seuilAlerte ? (
                    <span className="ml-2 rounded bg-amber-100 px-1.5 py-0.5 text-xs text-amber-700">
                      Alerte
                    </span>
                  ) : null}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      t.isDisponible
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {t.isDisponible ? "Disponible" : "Indisponible"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/trottinettes/${t.idTrottinettes}`}
                      className="text-sm font-medium text-[var(--accent-strong)] hover:underline"
                    >
                      Modifier
                    </Link>
                    <DeleteTrottinetteButton id={t.idTrottinettes} modele={t.modele} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {trottinettes.length === 0 ? (
          <p className="p-6 text-sm text-slate-500">Aucun modele dans le catalogue.</p>
        ) : null}
      </div>
    </div>
  );
}
