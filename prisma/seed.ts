import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const TEST_PASSWORD = "EcoRide2026!";

async function main() {
  await prisma.sortieStock.deleteMany();
  await prisma.reparation.deleteMany();
  await prisma.ligneCommande.deleteMany();
  await prisma.facture.deleteMany();
  await prisma.commande.deleteMany();
  await prisma.stock.deleteMany();
  await prisma.trottinette.deleteMany();
  await prisma.categorie.deleteMany();
  await prisma.utilisateur.deleteMany();

  const hashedPassword = await bcrypt.hash(TEST_PASSWORD, 12);

  await prisma.utilisateur.createMany({
    data: [
      {
        nom: "Dupont",
        prenom: "Marie",
        email: "client@ecoride.test",
        motDePasse: hashedPassword,
        telephone: "0601020304",
        adresse: "12 rue de la Mobilité",
        ville: "Lyon",
        codePostal: "69001",
        role: "client",
      },
      {
        nom: "Martin",
        prenom: "Lucas",
        email: "technicien@ecoride.test",
        motDePasse: hashedPassword,
        telephone: "0605060708",
        adresse: "5 avenue de l'Atelier",
        ville: "Lyon",
        codePostal: "69003",
        role: "technicien",
      },
      {
        nom: "Bernard",
        prenom: "Sophie",
        email: "admin@ecoride.test",
        motDePasse: hashedPassword,
        telephone: "0611223344",
        adresse: "1 place EcoRide",
        ville: "Paris",
        codePostal: "75001",
        role: "admin",
      },
    ],
  });

  const urbain = await prisma.categorie.create({
    data: {
      nom: "Urbain",
      description: "Trottinettes compactes pour la ville",
    },
  });

  const toutTerrain = await prisma.categorie.create({
    data: {
      nom: "Tout-terrain",
      description: "Modeles robustes pour chemins mixes",
    },
  });

  const pliable = await prisma.categorie.create({
    data: {
      nom: "Pliable",
      description: "Faciles a transporter et ranger",
    },
  });

  const trottinettes = [
    {
      modele: "EcoRide City One",
      poids: 12.5,
      vitesseMax: 25,
      prix: 499.99,
      autonomie: 35,
      idCategories: urbain.idCategories,
      stock: 24,
    },
    {
      modele: "EcoRide Urban Pro",
      poids: 14.2,
      vitesseMax: 25,
      prix: 649.99,
      autonomie: 45,
      idCategories: urbain.idCategories,
      stock: 18,
    },
    {
      modele: "EcoRide Trail X",
      poids: 18.0,
      vitesseMax: 25,
      prix: 799.99,
      autonomie: 50,
      idCategories: toutTerrain.idCategories,
      stock: 12,
    },
    {
      modele: "EcoRide Fold Air",
      poids: 11.8,
      vitesseMax: 25,
      prix: 549.99,
      autonomie: 30,
      idCategories: pliable.idCategories,
      stock: 20,
    },
    {
      modele: "EcoRide Connect S",
      poids: 13.5,
      vitesseMax: 25,
      prix: 699.99,
      autonomie: 40,
      idCategories: urbain.idCategories,
      stock: 15,
    },
    {
      modele: "EcoRide Family",
      poids: 16.0,
      vitesseMax: 20,
      prix: 459.99,
      autonomie: 28,
      idCategories: pliable.idCategories,
      stock: 10,
    },
  ];

  const createdTrottinettes = [];

  for (const item of trottinettes) {
    const { stock, ...data } = item;
    const trottinette = await prisma.trottinette.create({ data });

    await prisma.stock.create({
      data: {
        idTrottinettes: trottinette.idTrottinettes,
        quantiteDisponible: stock,
        seuilAlerte: 5,
      },
    });

    createdTrottinettes.push(trottinette);
  }

  const technicien = await prisma.utilisateur.findUnique({
    where: { email: "technicien@ecoride.test" },
  });

  if (technicien) {
    await prisma.reparation.createMany({
      data: [
        {
          idTrottinettes: createdTrottinettes[0].idTrottinettes,
          idTechnicien: technicien.idClient,
          commentaire: "Revision generale et reglage des freins.",
          statut: "terminee",
        },
        {
          idTrottinettes: createdTrottinettes[2].idTrottinettes,
          idTechnicien: technicien.idClient,
          commentaire: "Remplacement pneu arriere, controle etancheite.",
          statut: "en_cours",
        },
      ],
    });
  }

  console.log("Seed termine.");
  console.log("Comptes de test (mot de passe pour tous):", TEST_PASSWORD);
  console.log("- client@ecoride.test (client)");
  console.log("- technicien@ecoride.test (technicien)");
  console.log("- admin@ecoride.test (admin)");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
