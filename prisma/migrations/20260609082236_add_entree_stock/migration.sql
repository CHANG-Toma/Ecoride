-- CreateTable
CREATE TABLE "entrees_stock" (
    "id_entree_stock" SERIAL NOT NULL,
    "id_trottinettes" INTEGER NOT NULL,
    "id_technicien" INTEGER NOT NULL,
    "quantite" INTEGER NOT NULL,
    "motif" TEXT,
    "date_entree" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "entrees_stock_pkey" PRIMARY KEY ("id_entree_stock")
);

-- CreateIndex
CREATE INDEX "entrees_stock_id_trottinettes_idx" ON "entrees_stock"("id_trottinettes");

-- CreateIndex
CREATE INDEX "entrees_stock_id_technicien_idx" ON "entrees_stock"("id_technicien");

-- AddForeignKey
ALTER TABLE "entrees_stock" ADD CONSTRAINT "entrees_stock_id_trottinettes_fkey" FOREIGN KEY ("id_trottinettes") REFERENCES "trottinettes"("id_trottinettes") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "entrees_stock" ADD CONSTRAINT "entrees_stock_id_technicien_fkey" FOREIGN KEY ("id_technicien") REFERENCES "utilisateurs"("id_client") ON DELETE RESTRICT ON UPDATE CASCADE;
