-- CreateTable
CREATE TABLE "reparations" (
    "id_reparations" SERIAL NOT NULL,
    "id_trottinettes" INTEGER NOT NULL,
    "id_technicien" INTEGER NOT NULL,
    "date_reparation" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "commentaire" TEXT NOT NULL,
    "statut" TEXT NOT NULL DEFAULT 'terminee',

    CONSTRAINT "reparations_pkey" PRIMARY KEY ("id_reparations")
);

-- CreateTable
CREATE TABLE "sorties_stock" (
    "id_sortie_stock" SERIAL NOT NULL,
    "id_trottinettes" INTEGER NOT NULL,
    "id_technicien" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL,
    "motif" TEXT,
    "date_sortie" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sorties_stock_pkey" PRIMARY KEY ("id_sortie_stock")
);

-- CreateIndex
CREATE INDEX "reparations_id_trottinettes_idx" ON "reparations"("id_trottinettes");

-- CreateIndex
CREATE INDEX "reparations_id_technicien_idx" ON "reparations"("id_technicien");

-- CreateIndex
CREATE INDEX "sorties_stock_id_trottinettes_idx" ON "sorties_stock"("id_trottinettes");

-- CreateIndex
CREATE INDEX "sorties_stock_id_technicien_idx" ON "sorties_stock"("id_technicien");

-- AddForeignKey
ALTER TABLE "reparations" ADD CONSTRAINT "reparations_id_trottinettes_fkey" FOREIGN KEY ("id_trottinettes") REFERENCES "trottinettes"("id_trottinettes") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reparations" ADD CONSTRAINT "reparations_id_technicien_fkey" FOREIGN KEY ("id_technicien") REFERENCES "utilisateurs"("id_client") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sorties_stock" ADD CONSTRAINT "sorties_stock_id_trottinettes_fkey" FOREIGN KEY ("id_trottinettes") REFERENCES "trottinettes"("id_trottinettes") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sorties_stock" ADD CONSTRAINT "sorties_stock_id_technicien_fkey" FOREIGN KEY ("id_technicien") REFERENCES "utilisateurs"("id_client") ON DELETE RESTRICT ON UPDATE CASCADE;
