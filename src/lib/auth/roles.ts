import type { UserRole } from "@/types/auth";

const ROUTE_ACCESS: Record<string, UserRole[]> = {
  "/compte": ["client", "admin"],
  "/atelier": ["technicien", "admin"],
  "/admin": ["admin"],
};

export function canAccessRoute(role: UserRole, pathname: string): boolean {
  const matchedRoute = Object.keys(ROUTE_ACCESS).find(
    (route) => pathname === route || pathname.startsWith(`${route}/`),
  );

  if (!matchedRoute) {
    return true;
  }

  return ROUTE_ACCESS[matchedRoute].includes(role);
}

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
