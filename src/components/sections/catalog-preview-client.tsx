"use client";

import { useState } from "react";
import Link from "next/link";

type CategoryDto = {
  idCategories: number;
  nom: string;
};

type ProductDto = {
  idTrottinettes: number;
  modele: string;
  prix: number;
  autonomie: number;
  vitesseMax: number;
  poids: number;
  isDisponible: boolean;
  categorie: {
    idCategories: number;
    nom: string;
  };
  stock: {
    quantiteDisponible: number;
  } | null;
};

type CatalogPreviewClientProps = {
  categories: CategoryDto[];
  products: ProductDto[];
};

export function CatalogPreviewClient({ categories, products }: CatalogPreviewClientProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");

  const filteredProducts = products.filter((product) => {
    if (selectedCategory === "Tous") return true;
    return product.categorie.nom.toLowerCase() === selectedCategory.toLowerCase();
  });

  return (
    <div className="space-y-8">
      {/* Category Tabs */}
      <div className="flex flex-wrap justify-center gap-2">
        <button
          onClick={() => setSelectedCategory("Tous")}
          className={`inline-flex h-8 items-center rounded-full border px-4 text-xs font-semibold cursor-pointer transition ${
            selectedCategory === "Tous"
              ? "border-[var(--primary)] bg-[var(--primary)] text-white"
              : "border-[var(--border)] bg-white text-[var(--accent-strong)] hover:bg-slate-50"
          }`}
        >
          Tous
        </button>
        {categories.map((category) => (
          <button
            key={category.idCategories}
            onClick={() => setSelectedCategory(category.nom)}
            className={`inline-flex h-8 items-center rounded-full border px-4 text-xs font-semibold cursor-pointer transition ${
              selectedCategory === category.nom
                ? "border-[var(--primary)] bg-[var(--primary)] text-white"
                : "border-[var(--border)] bg-white text-[var(--accent-strong)] hover:bg-slate-50"
            }`}
          >
            {category.nom}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProducts.map((product) => {
          const inStock = (product.stock?.quantiteDisponible ?? 0) > 0;
          return (
            <article
              key={product.idTrottinettes}
              className="ec-card overflow-hidden flex flex-col group hover:shadow-md transition-all duration-300"
            >
              {/* Card visual background with nice gradient based on category */}
              <div className="h-36 w-full bg-gradient-to-br from-slate-800 to-[var(--accent-strong)] relative p-4 flex flex-col justify-between text-white">
                <span className="self-start text-[10px] uppercase font-mono tracking-wider bg-black/30 backdrop-blur px-2 py-0.5 rounded">
                  {product.categorie.nom}
                </span>
                <div>
                  <h3 className="font-semibold text-lg leading-snug group-hover:text-lime-300 transition-colors">
                    {product.modele}
                  </h3>
                </div>
              </div>

              {/* Product Info & Specs */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="grid grid-cols-3 gap-2 text-center text-xs border-b border-[var(--border)] pb-4">
                  <div className="space-y-1">
                    <p className="text-slate-400">Vitesse</p>
                    <p className="font-semibold text-slate-700">⚡ {product.vitesseMax} km/h</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-400">Autonomie</p>
                    <p className="font-semibold text-slate-700">🔋 {product.autonomie} km</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-slate-400">Poids</p>
                    <p className="font-semibold text-slate-700">⚖️ {product.poids} kg</p>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-xl font-bold text-[var(--primary)]">
                      {product.prix.toLocaleString("fr-FR", {
                        style: "currency",
                        currency: "EUR",
                      })}
                    </span>
                    <span className={`text-[11px] ${inStock ? "text-emerald-600" : "text-rose-500"}`}>
                      {inStock ? `● En stock (${product.stock?.quantiteDisponible})` : "● Rupture de stock"}
                    </span>
                  </div>

                  <Link href={`/catalogue?id=${product.idTrottinettes}`}>
                    <span className="inline-flex h-9 items-center justify-center rounded-lg border border-[var(--primary)] bg-[var(--primary)] text-white hover:bg-[var(--primary-strong)] px-4 text-xs font-semibold transition cursor-pointer">
                      Voir détails
                    </span>
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
