export type AdminActionState = {
  error?: string;
  success?: string;
};

export const COMMANDE_STATUTS = [
  "en_attente",
  "confirmee",
  "expediee",
  "livree",
  "annulee",
] as const;

export const ROLE_PERMISSIONS: Record<string, string[]> = {
  client: ["Consulter le catalogue", "Passer des commandes", "Gerer son compte"],
  technicien: ["Acceder a l'atelier", "Gerer les reparations", "Consulter les stocks"],
  admin: [
    "Acces complet au back-office",
    "Gerer le catalogue (CRUD trottinettes)",
    "Gerer les utilisateurs et roles",
    "Consulter les statistiques de ventes",
  ],
};

export const ROLE_LABELS: Record<string, string> = {
  client: "Client",
  technicien: "Technicien",
  admin: "Administrateur",
};
