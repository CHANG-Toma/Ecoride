import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import type { SessionUser, UserRole } from "@/types/auth";

export async function requireAuth(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) {
    redirect("/connexion");
  }
  return session;
}

export async function requireAdmin(): Promise<SessionUser> {
  const session = await requireAuth();
  if (session.role !== "admin") {
    redirect("/");
  }
  return session;
}

export async function requireRole(role: UserRole): Promise<SessionUser> {
  const session = await requireAuth();
  if (session.role !== role && session.role !== "admin") {
    redirect("/");
  }
  return session;
}
