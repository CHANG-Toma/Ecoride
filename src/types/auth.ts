export const ROLES = ["client", "technicien", "admin"] as const;

export type UserRole = (typeof ROLES)[number];

export type SessionUser = {
  idClient: number;
  email: string;
  nom: string;
  prenom: string;
  role: UserRole;
};

export type AuthActionState = {
  error?: string;
  success?: string;
};
