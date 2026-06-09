"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { hashPassword } from "@/lib/auth/password";
import { prisma } from "@/lib/prisma";
import { ROLES } from "@/types/auth";
import type { AdminActionState } from "@/types/admin";
import type { UserRole } from "@/types/auth";

function parseUserForm(formData: FormData) {
  return {
    nom: String(formData.get("nom") ?? "").trim(),
    prenom: String(formData.get("prenom") ?? "").trim(),
    email: String(formData.get("email") ?? "").trim().toLowerCase(),
    telephone: String(formData.get("telephone") ?? "").trim() || null,
    adresse: String(formData.get("adresse") ?? "").trim(),
    ville: String(formData.get("ville") ?? "").trim(),
    codePostal: String(formData.get("codePostal") ?? "").trim(),
    role: String(formData.get("role") ?? "") as UserRole,
    password: String(formData.get("password") ?? ""),
  };
}

function validateUser(
  data: ReturnType<typeof parseUserForm>,
  options: { requirePassword?: boolean } = {},
): string | null {
  if (!data.nom || !data.prenom || !data.email) return "Nom, prenom et email sont requis.";
  if (!data.adresse || !data.ville || !data.codePostal) return "Adresse complete requise.";
  if (!ROLES.includes(data.role)) return "Role invalide.";
  if (options.requirePassword && data.password.length < 8) {
    return "Le mot de passe doit contenir au moins 8 caracteres.";
  }
  if (!options.requirePassword && data.password && data.password.length < 8) {
    return "Le mot de passe doit contenir au moins 8 caracteres.";
  }
  return null;
}

async function countAdmins(excludeId?: number): Promise<number> {
  return prisma.utilisateur.count({
    where: {
      role: "admin",
      ...(excludeId ? { idClient: { not: excludeId } } : {}),
    },
  });
}

export async function createUserAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const data = parseUserForm(formData);
  const error = validateUser(data, { requirePassword: true });
  if (error) return { error };

  const existing = await prisma.utilisateur.findUnique({ where: { email: data.email } });
  if (existing) return { error: "Un compte existe deja avec cet email." };

  const hashedPassword = await hashPassword(data.password);

  await prisma.utilisateur.create({
    data: {
      nom: data.nom,
      prenom: data.prenom,
      email: data.email,
      motDePasse: hashedPassword,
      telephone: data.telephone,
      adresse: data.adresse,
      ville: data.ville,
      codePostal: data.codePostal,
      role: data.role,
    },
  });

  revalidatePath("/admin/utilisateurs");
  redirect("/admin/utilisateurs");
}

export async function updateUserAction(
  id: number,
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const session = await requireAdmin();
  const data = parseUserForm(formData);
  const error = validateUser(data);
  if (error) return { error };

  const existing = await prisma.utilisateur.findUnique({ where: { idClient: id } });
  if (!existing) return { error: "Utilisateur introuvable." };

  if (data.email !== existing.email) {
    const emailTaken = await prisma.utilisateur.findUnique({ where: { email: data.email } });
    if (emailTaken) return { error: "Cet email est deja utilise." };
  }

  if (existing.role === "admin" && data.role !== "admin") {
    const otherAdmins = await countAdmins(id);
    if (otherAdmins === 0) {
      return { error: "Impossible de retirer le role admin du dernier administrateur." };
    }
  }

  if (session.idClient === id && data.role !== "admin") {
    return { error: "Vous ne pouvez pas retirer votre propre role administrateur." };
  }

  const updateData: {
    nom: string;
    prenom: string;
    email: string;
    telephone: string | null;
    adresse: string;
    ville: string;
    codePostal: string;
    role: string;
    motDePasse?: string;
  } = {
    nom: data.nom,
    prenom: data.prenom,
    email: data.email,
    telephone: data.telephone,
    adresse: data.adresse,
    ville: data.ville,
    codePostal: data.codePostal,
    role: data.role,
  };

  if (data.password) {
    updateData.motDePasse = await hashPassword(data.password);
  }

  await prisma.utilisateur.update({ where: { idClient: id }, data: updateData });

  revalidatePath("/admin/utilisateurs");
  revalidatePath(`/admin/utilisateurs/${id}`);
  return { success: "Utilisateur mis a jour." };
}

export async function deleteUserAction(id: number): Promise<AdminActionState> {
  const session = await requireAdmin();

  if (session.idClient === id) {
    return { error: "Vous ne pouvez pas supprimer votre propre compte." };
  }

  const existing = await prisma.utilisateur.findUnique({
    where: { idClient: id },
    include: { _count: { select: { commandes: true } } },
  });
  if (!existing) return { error: "Utilisateur introuvable." };

  if (existing.role === "admin") {
    const otherAdmins = await countAdmins(id);
    if (otherAdmins === 0) {
      return { error: "Impossible de supprimer le dernier administrateur." };
    }
  }

  if (existing._count.commandes > 0) {
    return { error: "Cet utilisateur a des commandes et ne peut pas etre supprime." };
  }

  await prisma.utilisateur.delete({ where: { idClient: id } });

  revalidatePath("/admin/utilisateurs");
  redirect("/admin/utilisateurs");
}
