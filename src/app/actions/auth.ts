"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { getDefaultRedirectForRole } from "@/lib/auth/roles";
import { createSession, destroySession } from "@/lib/auth/session";
import type { AuthActionState } from "@/types/auth";

export async function loginAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");

  if (!email || !password) {
    return { error: "Email et mot de passe requis." };
  }

  const user = await prisma.utilisateur.findUnique({ where: { email } });

  if (!user) {
    return { error: "Identifiants incorrects." };
  }

  const isValid = await verifyPassword(password, user.motDePasse);

  if (!isValid) {
    return { error: "Identifiants incorrects." };
  }

  await createSession({
    idClient: user.idClient,
    email: user.email,
    nom: user.nom,
    prenom: user.prenom,
    role: user.role as "client" | "technicien" | "admin",
  });

  redirect(getDefaultRedirectForRole(user.role as "client" | "technicien" | "admin"));
}

export async function registerAction(
  _prevState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const nom = String(formData.get("nom") ?? "").trim();
  const prenom = String(formData.get("prenom") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim().toLowerCase();
  const password = String(formData.get("password") ?? "");
  const telephone = String(formData.get("telephone") ?? "").trim() || null;
  const adresse = String(formData.get("adresse") ?? "").trim();
  const ville = String(formData.get("ville") ?? "").trim();
  const codePostal = String(formData.get("codePostal") ?? "").trim();

  if (!nom || !prenom || !email || !password || !adresse || !ville || !codePostal) {
    return { error: "Tous les champs obligatoires doivent etre remplis." };
  }

  if (password.length < 8) {
    return { error: "Le mot de passe doit contenir au moins 8 caracteres." };
  }

  const existingUser = await prisma.utilisateur.findUnique({ where: { email } });

  if (existingUser) {
    return { error: "Un compte existe deja avec cet email." };
  }

  const hashedPassword = await hashPassword(password);

  const user = await prisma.utilisateur.create({
    data: {
      nom,
      prenom,
      email,
      motDePasse: hashedPassword,
      telephone,
      adresse,
      ville,
      codePostal,
      role: "client",
    },
  });

  await createSession({
    idClient: user.idClient,
    email: user.email,
    nom: user.nom,
    prenom: user.prenom,
    role: "client",
  });

  redirect("/compte");
}

export async function logoutAction(): Promise<void> {
  await destroySession();
  redirect("/connexion");
}
