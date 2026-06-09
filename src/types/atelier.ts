/**
 * Types partages pour l'espace atelier (bloc 5).
 * Utilises par les requetes, actions et composants UI.
 */

/** Ligne d'inventaire affichee dans le tableau US-A1. */
export type StockInventoryItem = {
  idStock: number;
  idTrottinettes: number;
  modele: string;
  categorie: string;
  quantiteDisponible: number;
  seuilAlerte: number;
  isAlert: boolean;
};

/** Option de liste deroulante pour selectionner un modele. */
export type TrottinetteOption = {
  idTrottinettes: number;
  modele: string;
  stockDisponible: number;
};

/** Intervention SAV affichee dans l'historique US-A2. */
export type ReparationItem = {
  idReparations: number;
  modele: string;
  technicien: string;
  dateReparation: string;
  commentaire: string;
  statut: string;
};

/** Sortie de stock tracee en base et affichee dans le journal US-A3. */
export type SortieStockItem = {
  idSortieStock: number;
  modele: string;
  technicien: string;
  quantite: number;
  motif: string | null;
  dateSortie: string;
};

/** Entree de stock (retour en inventaire) tracee en base. */
export type EntreeStockItem = {
  idEntreeStock: number;
  modele: string;
  technicien: string;
  quantite: number;
  motif: string | null;
  dateEntree: string;
};

/** Retour des formulaires atelier (message d'erreur ou de succes). */
export type AtelierActionState = {
  error?: string;
  success?: string;
};
