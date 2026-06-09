-- CreateTable
CREATE TABLE "utilisateurs" (
    "id_client" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "prenom" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "mot_de_passe" TEXT NOT NULL,
    "telephone" TEXT,
    "adresse" TEXT NOT NULL,
    "ville" TEXT NOT NULL,
    "code_postal" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "date_inscription" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "utilisateurs_pkey" PRIMARY KEY ("id_client")
);

-- CreateTable
CREATE TABLE "commandes" (
    "id_commandes" SERIAL NOT NULL,
    "id_client" INTEGER NOT NULL,
    "date_commande" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statut" TEXT NOT NULL,
    "montant_total" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "commandes_pkey" PRIMARY KEY ("id_commandes")
);

-- CreateTable
CREATE TABLE "factures" (
    "id_factures" SERIAL NOT NULL,
    "id_commandes" INTEGER NOT NULL,
    "date_facture" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "montant_total" DECIMAL(10,2) NOT NULL,
    "mode_paiement" TEXT NOT NULL,
    "statut_paiement" TEXT NOT NULL,

    CONSTRAINT "factures_pkey" PRIMARY KEY ("id_factures")
);

-- CreateTable
CREATE TABLE "ligne_commandes" (
    "id_ligne_commandes" SERIAL NOT NULL,
    "id_commandes" INTEGER NOT NULL,
    "id_trottinettes" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL,
    "prix_unitaire" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "ligne_commandes_pkey" PRIMARY KEY ("id_ligne_commandes")
);

-- CreateTable
CREATE TABLE "categories" (
    "id_categories" SERIAL NOT NULL,
    "nom" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id_categories")
);

-- CreateTable
CREATE TABLE "trottinettes" (
    "id_trottinettes" SERIAL NOT NULL,
    "id_categories" INTEGER NOT NULL,
    "modele" TEXT NOT NULL,
    "poids" DECIMAL(6,2) NOT NULL,
    "vitesse_max" INTEGER NOT NULL,
    "prix" DECIMAL(10,2) NOT NULL,
    "autonomie" INTEGER NOT NULL,
    "isDisponible" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "trottinettes_pkey" PRIMARY KEY ("id_trottinettes")
);

-- CreateTable
CREATE TABLE "stocks" (
    "id_stock" SERIAL NOT NULL,
    "id_trottinettes" INTEGER NOT NULL,
    "quantite_disponible" INTEGER NOT NULL DEFAULT 0,
    "seuil_alerte" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "stocks_pkey" PRIMARY KEY ("id_stock")
);

-- CreateIndex
CREATE UNIQUE INDEX "utilisateurs_email_key" ON "utilisateurs"("email");

-- CreateIndex
CREATE INDEX "commandes_id_client_idx" ON "commandes"("id_client");

-- CreateIndex
CREATE UNIQUE INDEX "factures_id_commandes_key" ON "factures"("id_commandes");

-- CreateIndex
CREATE INDEX "ligne_commandes_id_commandes_idx" ON "ligne_commandes"("id_commandes");

-- CreateIndex
CREATE INDEX "ligne_commandes_id_trottinettes_idx" ON "ligne_commandes"("id_trottinettes");

-- CreateIndex
CREATE INDEX "trottinettes_id_categories_idx" ON "trottinettes"("id_categories");

-- CreateIndex
CREATE UNIQUE INDEX "stocks_id_trottinettes_key" ON "stocks"("id_trottinettes");

-- AddForeignKey
ALTER TABLE "commandes" ADD CONSTRAINT "commandes_id_client_fkey" FOREIGN KEY ("id_client") REFERENCES "utilisateurs"("id_client") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "factures" ADD CONSTRAINT "factures_id_commandes_fkey" FOREIGN KEY ("id_commandes") REFERENCES "commandes"("id_commandes") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ligne_commandes" ADD CONSTRAINT "ligne_commandes_id_commandes_fkey" FOREIGN KEY ("id_commandes") REFERENCES "commandes"("id_commandes") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ligne_commandes" ADD CONSTRAINT "ligne_commandes_id_trottinettes_fkey" FOREIGN KEY ("id_trottinettes") REFERENCES "trottinettes"("id_trottinettes") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trottinettes" ADD CONSTRAINT "trottinettes_id_categories_fkey" FOREIGN KEY ("id_categories") REFERENCES "categories"("id_categories") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "stocks" ADD CONSTRAINT "stocks_id_trottinettes_fkey" FOREIGN KEY ("id_trottinettes") REFERENCES "trottinettes"("id_trottinettes") ON DELETE RESTRICT ON UPDATE CASCADE;
