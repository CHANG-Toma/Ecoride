/**
 * Actions serveur de l'atelier (bloc 5).
 * Executees depuis les formulaires de sortie stock et reparations.
 */
"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";
import type { AtelierActionState } from "@/types/atelier";

/** Verifie que l'utilisateur est connecte en tant que technicien ou admin. */
async function requireTechnicienSession() {
  const session = await getSession();

  if (!session) {
    throw new Error("Non authentifie.");
  }

  if (session.role !== "technicien" && session.role !== "admin") {
    throw new Error("Acces refuse.");
  }

  return session;
}

/**
 * US-A3 — Enregistre une sortie de stock.
 * Decremente la quantite disponible et trace l'operation en base.
 */
export async function sortieStockAction(
  _prevState: AtelierActionState,
  formData: FormData,
): Promise<AtelierActionState> {
  try {
    const session = await requireTechnicienSession();
    const idTrottinettes = Number(formData.get("idTrottinettes"));
    const quantite = Number(formData.get("quantite"));
    const motif = String(formData.get("motif") ?? "").trim() || null;

    if (!idTrottinettes || Number.isNaN(idTrottinettes)) {
      return { error: "Selectionnez un modele." };
    }

    if (!quantite || quantite < 1 || !Number.isInteger(quantite)) {
      return { error: "La quantite doit etre un entier positif." };
    }

    const stock = await prisma.stock.findUnique({
      where: { idTrottinettes },
    });

    if (!stock) {
      return { error: "Stock introuvable pour ce modele." };
    }

    if (stock.quantiteDisponible < quantite) {
      return {
        error: `Stock insuffisant. Disponible : ${stock.quantiteDisponible}.`,
      };
    }

    await prisma.$transaction([
      prisma.stock.update({
        where: { idTrottinettes },
        data: { quantiteDisponible: { decrement: quantite } },
      }),
      prisma.sortieStock.create({
        data: {
          idTrottinettes,
          idTechnicien: session.idClient,
          quantite,
          motif,
        },
      }),
    ]);

    revalidatePath("/atelier");
    return { success: `Sortie de ${quantite} unite(s) enregistree.` };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Erreur lors de la sortie de stock.",
    };
  }
}

/**
 * US-A2 — Enregistre une reparation SAV.
 * Lie la trottinette, le technicien connecte, le commentaire et le statut.
 */
export async function reparationAction(
  _prevState: AtelierActionState,
  formData: FormData,
): Promise<AtelierActionState> {
  try {
    const session = await requireTechnicienSession();
    const idTrottinettes = Number(formData.get("idTrottinettes"));
    const commentaire = String(formData.get("commentaire") ?? "").trim();
    const statut = String(formData.get("statut") ?? "terminee");

    if (!idTrottinettes || Number.isNaN(idTrottinettes)) {
      return { error: "Selectionnez une trottinette." };
    }

    if (!commentaire) {
      return { error: "Le commentaire est obligatoire." };
    }

    if (statut !== "en_cours" && statut !== "terminee") {
      return { error: "Statut invalide." };
    }

    const trottinette = await prisma.trottinette.findUnique({
      where: { idTrottinettes },
    });

    if (!trottinette) {
      return { error: "Trottinette introuvable." };
    }

    await prisma.reparation.create({
      data: {
        idTrottinettes,
        idTechnicien: session.idClient,
        commentaire,
        statut,
      },
    });

    revalidatePath("/atelier");
    return { success: "Reparation enregistree." };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Erreur lors de l'enregistrement.",
    };
  }
}
