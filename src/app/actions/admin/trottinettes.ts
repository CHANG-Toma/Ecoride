"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/prisma";
import type { AdminActionState } from "@/types/admin";

function parseTrottinetteForm(formData: FormData) {
  return {
    modele: String(formData.get("modele") ?? "").trim(),
    idCategories: Number(formData.get("idCategories")),
    poids: Number(formData.get("poids")),
    vitesseMax: Number(formData.get("vitesseMax")),
    prix: Number(formData.get("prix")),
    autonomie: Number(formData.get("autonomie")),
    isDisponible: formData.get("isDisponible") === "on",
    quantiteDisponible: Number(formData.get("quantiteDisponible")),
    seuilAlerte: Number(formData.get("seuilAlerte")),
  };
}

function validateTrottinette(data: ReturnType<typeof parseTrottinetteForm>): string | null {
  if (!data.modele) return "Le modele est requis.";
  if (!data.idCategories || Number.isNaN(data.idCategories)) return "La categorie est requise.";
  if (Number.isNaN(data.poids) || data.poids <= 0) return "Le poids doit etre positif.";
  if (Number.isNaN(data.vitesseMax) || data.vitesseMax <= 0) return "La vitesse max doit etre positive.";
  if (Number.isNaN(data.prix) || data.prix <= 0) return "Le prix doit etre positif.";
  if (Number.isNaN(data.autonomie) || data.autonomie <= 0) return "L'autonomie doit etre positive.";
  if (Number.isNaN(data.quantiteDisponible) || data.quantiteDisponible < 0) {
    return "La quantite en stock doit etre positive ou nulle.";
  }
  if (Number.isNaN(data.seuilAlerte) || data.seuilAlerte < 0) {
    return "Le seuil d'alerte doit etre positif ou nul.";
  }
  return null;
}

export async function createTrottinetteAction(
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const data = parseTrottinetteForm(formData);
  const error = validateTrottinette(data);
  if (error) return { error };

  const categorie = await prisma.categorie.findUnique({
    where: { idCategories: data.idCategories },
  });
  if (!categorie) return { error: "Categorie introuvable." };

  await prisma.trottinette.create({
    data: {
      modele: data.modele,
      idCategories: data.idCategories,
      poids: data.poids,
      vitesseMax: data.vitesseMax,
      prix: data.prix,
      autonomie: data.autonomie,
      isDisponible: data.isDisponible,
      stock: {
        create: {
          quantiteDisponible: data.quantiteDisponible,
          seuilAlerte: data.seuilAlerte,
        },
      },
    },
  });

  revalidatePath("/admin/trottinettes");
  revalidatePath("/admin");
  redirect("/admin/trottinettes");
}

export async function updateTrottinetteAction(
  id: number,
  _prevState: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const data = parseTrottinetteForm(formData);
  const error = validateTrottinette(data);
  if (error) return { error };

  const existing = await prisma.trottinette.findUnique({
    where: { idTrottinettes: id },
    include: { stock: true },
  });
  if (!existing) return { error: "Trottinette introuvable." };

  await prisma.trottinette.update({
    where: { idTrottinettes: id },
    data: {
      modele: data.modele,
      idCategories: data.idCategories,
      poids: data.poids,
      vitesseMax: data.vitesseMax,
      prix: data.prix,
      autonomie: data.autonomie,
      isDisponible: data.isDisponible,
      stock: {
        upsert: {
          create: {
            quantiteDisponible: data.quantiteDisponible,
            seuilAlerte: data.seuilAlerte,
          },
          update: {
            quantiteDisponible: data.quantiteDisponible,
            seuilAlerte: data.seuilAlerte,
          },
        },
      },
    },
  });

  revalidatePath("/admin/trottinettes");
  revalidatePath(`/admin/trottinettes/${id}`);
  revalidatePath("/admin");
  return { success: "Trottinette mise a jour." };
}

export async function deleteTrottinetteAction(id: number): Promise<AdminActionState> {
  await requireAdmin();

  const existing = await prisma.trottinette.findUnique({
    where: { idTrottinettes: id },
    include: { _count: { select: { lignesCommande: true } } },
  });
  if (!existing) return { error: "Trottinette introuvable." };

  if (existing._count.lignesCommande > 0) {
    await prisma.trottinette.update({
      where: { idTrottinettes: id },
      data: { isDisponible: false },
    });
    revalidatePath("/admin/trottinettes");
    revalidatePath("/admin");
    return {
      success: "Des commandes existent pour ce modele. Il a ete desactive au lieu d'etre supprime.",
    };
  }

  await prisma.stock.deleteMany({ where: { idTrottinettes: id } });
  await prisma.trottinette.delete({ where: { idTrottinettes: id } });

  revalidatePath("/admin/trottinettes");
  revalidatePath("/admin");
  redirect("/admin/trottinettes");
}
