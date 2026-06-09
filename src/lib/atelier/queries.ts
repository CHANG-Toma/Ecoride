/**
 * Requetes base de donnees pour l'espace atelier (bloc 5 - SAV).
 * Chaque fonction alimente un onglet ou un formulaire de /atelier.
 */
import { prisma } from "@/lib/prisma";
import type { ReparationItem, SortieStockItem, StockInventoryItem, TrottinetteOption } from "@/types/atelier";

/** US-A1 — Recupere l'inventaire complet avec alerte si stock <= seuil. */
export async function getStockInventory(): Promise<StockInventoryItem[]> {
  const stocks = await prisma.stock.findMany({
    include: {
      trottinette: {
        include: { categorie: true },
      },
    },
    orderBy: { trottinette: { modele: "asc" } },
  });

  return stocks.map((item) => ({
    idStock: item.idStock,
    idTrottinettes: item.idTrottinettes,
    modele: item.trottinette.modele,
    categorie: item.trottinette.categorie.nom,
    quantiteDisponible: item.quantiteDisponible,
    seuilAlerte: item.seuilAlerte,
    isAlert: item.quantiteDisponible <= item.seuilAlerte,
  }));
}

/** Liste des modeles pour les listes deroulantes (sorties stock, reparations). */
export async function getTrottinetteOptions(): Promise<TrottinetteOption[]> {
  const trottinettes = await prisma.trottinette.findMany({
    include: { stock: true },
    orderBy: { modele: "asc" },
  });

  return trottinettes.map((item) => ({
    idTrottinettes: item.idTrottinettes,
    modele: item.modele,
    stockDisponible: item.stock?.quantiteDisponible ?? 0,
  }));
}

/** US-A2 — Historique des reparations, filtrable par trottinette. */
export async function getReparations(trottinetteId?: number): Promise<ReparationItem[]> {
  const reparations = await prisma.reparation.findMany({
    where: trottinetteId ? { idTrottinettes: trottinetteId } : undefined,
    include: {
      trottinette: true,
      technicien: true,
    },
    orderBy: { dateReparation: "desc" },
    take: trottinetteId ? undefined : 20,
  });

  return reparations.map((item) => ({
    idReparations: item.idReparations,
    modele: item.trottinette.modele,
    technicien: `${item.technicien.prenom} ${item.technicien.nom}`,
    dateReparation: item.dateReparation.toISOString(),
    commentaire: item.commentaire,
    statut: item.statut,
  }));
}

/** US-A3 — Journal des 15 dernieres sorties de stock. */
export async function getRecentSortiesStock(): Promise<SortieStockItem[]> {
  const sorties = await prisma.sortieStock.findMany({
    include: {
      trottinette: true,
      technicien: true,
    },
    orderBy: { dateSortie: "desc" },
    take: 15,
  });

  return sorties.map((item) => ({
    idSortieStock: item.idSortieStock,
    modele: item.trottinette.modele,
    technicien: `${item.technicien.prenom} ${item.technicien.nom}`,
    quantite: item.quantite,
    motif: item.motif,
    dateSortie: item.dateSortie.toISOString(),
  }));
}

/** Noms des categories pour les filtres de l'inventaire. */
export async function getCategories(): Promise<string[]> {
  const categories = await prisma.categorie.findMany({
    orderBy: { nom: "asc" },
    select: { nom: true },
  });

  return categories.map((item) => item.nom);
}
