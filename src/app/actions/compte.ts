"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { verifyPassword, hashPassword } from "@/lib/auth/password";
import { getSession, createSession } from "@/lib/auth/session";

export type ProfileActionState = {
  error?: string;
  success?: string;
};

export async function updateProfileAction(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const session = await getSession();
  if (!session) redirect("/connexion");

  const nom = String(formData.get("nom") ?? "").trim();
  const prenom = String(formData.get("prenom") ?? "").trim();
  const telephone = String(formData.get("telephone") ?? "").trim() || null;
  const adresse = String(formData.get("adresse") ?? "").trim();
  const ville = String(formData.get("ville") ?? "").trim();
  const codePostal = String(formData.get("codePostal") ?? "").trim();

  if (!nom || !prenom || !adresse || !ville || !codePostal) {
    return { error: "Tous les champs obligatoires doivent être remplis." };
  }

  await prisma.utilisateur.update({
    where: { idClient: session.idClient },
    data: { nom, prenom, telephone, adresse, ville, codePostal },
  });

  // Refresh session with updated name
  await createSession({ ...session, nom, prenom });

  return { success: "Profil mis à jour avec succès." };
}

export async function updatePasswordAction(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const session = await getSession();
  if (!session) redirect("/connexion");

  const currentPassword = String(formData.get("currentPassword") ?? "");
  const newPassword = String(formData.get("newPassword") ?? "");
  const confirmPassword = String(formData.get("confirmPassword") ?? "");

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { error: "Tous les champs sont requis." };
  }

  if (newPassword.length < 8) {
    return { error: "Le nouveau mot de passe doit contenir au moins 8 caractères." };
  }

  if (newPassword !== confirmPassword) {
    return { error: "Les mots de passe ne correspondent pas." };
  }

  const user = await prisma.utilisateur.findUnique({
    where: { idClient: session.idClient },
  });

  if (!user) return { error: "Utilisateur introuvable." };

  const isValid = await verifyPassword(currentPassword, user.motDePasse);
  if (!isValid) {
    return { error: "Mot de passe actuel incorrect." };
  }

  const hashed = await hashPassword(newPassword);
  await prisma.utilisateur.update({
    where: { idClient: session.idClient },
    data: { motDePasse: hashed },
  });

  return { success: "Mot de passe modifié avec succès." };
}
