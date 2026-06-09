/**
 * Gestion des roles et permissions d'acces aux routes protegees.
 */
import type { UserRole } from "@/types/auth";

/** Mapping route → roles autorises (client, technicien, admin). */
const ROUTE_ACCESS: Record<string, UserRole[]> = {
  "/compte": ["client", "admin"],
  "/atelier": ["technicien", "admin"],
  "/admin": ["admin"],
};

/** Retourne true si le role de l'utilisateur peut acceder a la route demandee. */
export function canAccessRoute(role: UserRole, pathname: string): boolean {
  const matchedRoute = Object.keys(ROUTE_ACCESS).find(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!matchedRoute) {
    return true;
  }

  return ROUTE_ACCESS[matchedRoute].includes(role);
}

/** Page d'accueil apres connexion selon le role (compte, atelier ou admin). */
export function getDefaultRedirectForRole(role: UserRole): string {
  switch (role) {
    case "admin":
      return "/admin";
    case "technicien":
      return "/atelier";
    default:
      return "/compte";
  }
}
