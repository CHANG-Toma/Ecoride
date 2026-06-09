"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

type CategoryDto = {
  idCategories: number;
  nom: string;
  description: string | null;
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
    seuilAlerte: number;
  } | null;
};

type CatalogPageProps = {
  categories: CategoryDto[];
  products: ProductDto[];
  initialProductId?: number;
};

export function CatalogPage({ categories, products, initialProductId }: CatalogPageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Tous");
  const [sortBy, setSortBy] = useState<string>("default");
  const [selectedProduct, setSelectedProduct] = useState<ProductDto | null>(null);
  const [cart, setCart] = useState<number[]>([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem("ecoride_cart");
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  // Open initial product if provided in URL search params
  useEffect(() => {
    if (initialProductId) {
      const prod = products.find((p) => p.idTrottinettes === initialProductId);
      if (prod) {
        setSelectedProduct(prod);
      }
    }
  }, [initialProductId, products]);

  const handleAddToCart = (productId: number, modelName: string) => {
    const newCart = [...cart, productId];
    setCart(newCart);
    localStorage.setItem("ecoride_cart", JSON.stringify(newCart));

    // Show nice feedback toast
    setToastMessage(`"${modelName}" a été ajouté à votre panier !`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Filter products
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.modele.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedCategory === "Tous" ||
      product.categorie.nom.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.prix - b.prix;
    if (sortBy === "price-desc") return b.prix - a.prix;
    if (sortBy === "autonomie-desc") return b.autonomie - a.autonomie;
    if (sortBy === "speed-desc") return b.vitesseMax - a.vitesseMax;
    return 0; // default (id)
  });

  return (
    <div className="space-y-8">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center bg-slate-900 text-white px-5 py-3 rounded-lg shadow-lg animate-bounce text-sm font-semibold">
          <span>{toastMessage}</span>
          <button onClick={() => setShowToast(false)} className="ml-3 text-lime-400 font-bold hover:text-lime-300">
            ×
          </button>
        </div>
      )}

      {/* Hero Header */}
      <section className="bg-gradient-to-r from-[var(--primary)] to-[var(--primary-strong)] text-white py-12 rounded-2xl p-6 md:p-10 shadow-sm relative overflow-hidden">
        <div className="max-w-xl space-y-4 relative z-10">
          <span className="font-mono text-xs uppercase tracking-[0.2em] bg-black/25 px-3 py-1 rounded-full text-lime-200">
            Catalogue
          </span>
          <h1 className="text-3xl md:text-5xl font-bold">Nos Trottinettes Électriques</h1>
          <p className="text-lime-100 text-sm md:text-base">
            Comparez et trouvez la trottinette parfaite selon son autonomie, sa vitesse ou sa praticité.
          </p>
        </div>
        {/* Floating Cart Indicator */}
        <div className="absolute top-6 right-6 flex items-center gap-2 bg-white/10 backdrop-blur px-4 py-2 rounded-full border border-white/20">
          <span className="text-xl">🛒</span>
          <span className="font-bold text-sm">{cart.length} articles</span>
        </div>
      </section>

      {/* Filters & Search controls */}
      <div className="bg-white p-6 rounded-xl border border-[var(--border)] shadow-sm grid gap-4 md:grid-cols-4 items-end">
        {/* Search Input */}
        <div className="md:col-span-2 space-y-1.5">
          <label htmlFor="search" className="block text-xs font-semibold uppercase text-slate-500">
            Rechercher un modèle
          </label>
          <div className="relative">
            <input
              id="search"
              type="text"
              placeholder="Ex: City One, Trail X..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 w-full rounded-lg border border-[var(--border)] bg-slate-50 px-4 pl-10 text-sm text-[var(--foreground)] outline-none transition focus:border-[var(--accent)] focus:bg-white focus:ring-2 focus:ring-[var(--accent)]/10"
            />
            <span className="absolute left-3.5 top-3 text-slate-400">🔍</span>
          </div>
        </div>

        {/* Sort Select */}
        <div className="space-y-1.5">
          <label htmlFor="sort" className="block text-xs font-semibold uppercase text-slate-500">
            Trier par
          </label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="h-11 w-full rounded-lg border border-[var(--border)] bg-slate-50 px-3 text-sm text-[var(--foreground)] outline-none cursor-pointer focus:border-[var(--accent)] focus:bg-white"
          >
            <option value="default">Pertinence</option>
            <option value="price-asc">Prix : croissant</option>
            <option value="price-desc">Prix : décroissant</option>
            <option value="autonomie-desc">Autonomie : max</option>
            <option value="speed-desc">Vitesse : max</option>
          </select>
        </div>

        {/* Clear Filters Button */}
        <div>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("Tous");
              setSortBy("default");
            }}
            className="h-11 w-full rounded-lg border border-[var(--border)] text-slate-600 font-semibold text-xs hover:bg-slate-50 transition cursor-pointer"
          >
            Réinitialiser les filtres
          </button>
        </div>
      </div>

      {/* Layout Content */}
      <div className="grid gap-8 lg:grid-cols-4">
        {/* Sidebar Filters */}
        <aside className="lg:col-span-1 space-y-6">
          <div className="bg-white p-5 rounded-xl border border-[var(--border)] shadow-sm space-y-4">
            <h3 className="font-bold text-slate-700 text-sm border-b border-[var(--border)] pb-2 uppercase tracking-wide">
              Catégories
            </h3>
            <div className="flex flex-col gap-2">
              <button
                onClick={() => setSelectedCategory("Tous")}
                className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer flex justify-between items-center ${
                  selectedCategory === "Tous"
                    ? "bg-[var(--primary)]/10 text-[var(--primary)] font-bold"
                    : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <span>Toutes</span>
                <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-normal">
                  {products.length}
                </span>
              </button>
              {categories.map((category) => {
                const count = products.filter((p) => p.categorie.nom === category.nom).length;
                return (
                  <button
                    key={category.idCategories}
                    onClick={() => setSelectedCategory(category.nom)}
                    className={`text-left px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer flex justify-between items-center ${
                      selectedCategory === category.nom
                        ? "bg-[var(--primary)]/10 text-[var(--primary)] font-bold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <span>{category.nom}</span>
                    <span className="text-xs bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full font-normal">
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Grid */}
        <main className="lg:col-span-3 space-y-6">
          {sortedProducts.length === 0 ? (
            <div className="bg-white rounded-xl border border-[var(--border)] p-12 text-center text-slate-500">
              <span className="text-4xl block mb-2">🛴</span>
              <p className="font-semibold">Aucun modèle ne correspond à vos critères.</p>
              <p className="text-sm text-slate-400 mt-1">Essayez de modifier votre recherche ou de changer de catégorie.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {sortedProducts.map((product) => {
                const inStock = (product.stock?.quantiteDisponible ?? 0) > 0;
                return (
                  <article
                    key={product.idTrottinettes}
                    onClick={() => setSelectedProduct(product)}
                    className="ec-card overflow-hidden flex flex-col group hover:shadow-md cursor-pointer hover:-translate-y-0.5 transition-all duration-300"
                  >
                    {/* Visual head */}
                    <div className="h-32 w-full bg-gradient-to-br from-slate-700 to-[var(--accent)] relative p-4 flex flex-col justify-between text-white">
                      <span className="self-start text-[9px] uppercase font-mono tracking-wider bg-black/40 backdrop-blur px-2 py-0.5 rounded">
                        {product.categorie.nom}
                      </span>
                      <h3 className="font-semibold text-base leading-snug group-hover:text-lime-300 transition-colors">
                        {product.modele}
                      </h3>
                    </div>

                    {/* Short Specs */}
                    <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-600 border-b border-[var(--border)] pb-3">
                        <div>⚡ Vitesse : <span className="font-semibold">{product.vitesseMax} km/h</span></div>
                        <div>🔋 Autonomie : <span className="font-semibold">{product.autonomie} km</span></div>
                        <div>⚖️ Poids : <span className="font-semibold">{product.poids} kg</span></div>
                        <div>🔧 Garantie : <span className="font-semibold">2 ans</span></div>
                      </div>

                      <div className="flex items-end justify-between">
                        <div className="flex flex-col">
                          <span className="text-lg font-bold text-[var(--primary)]">
                            {product.prix.toLocaleString("fr-FR", {
                              style: "currency",
                              currency: "EUR",
                            })}
                          </span>
                          <span className={`text-[10px] ${inStock ? "text-emerald-600" : "text-rose-500"}`}>
                            {inStock ? `En stock (${product.stock?.quantiteDisponible})` : "Rupture de stock"}
                          </span>
                        </div>

                        <span className="inline-flex h-8 items-center justify-center rounded-md border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 px-3 text-xs font-semibold transition">
                          Détails
                        </span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Details Modal */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-2xl rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-200">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-slate-800 to-[var(--accent-strong)] text-white p-6 relative">
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-4 right-4 size-8 flex items-center justify-center rounded-full bg-black/20 text-white hover:bg-black/40 transition font-bold text-lg cursor-pointer"
              >
                ×
              </button>
              <span className="text-xs uppercase font-mono tracking-wider bg-white/20 backdrop-blur px-2.5 py-0.5 rounded-full">
                {selectedProduct.categorie.nom}
              </span>
              <h2 className="text-2xl font-bold mt-2">{selectedProduct.modele}</h2>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Detailed Specs */}
              <div>
                <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider mb-3">Caractéristiques Techniques</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-50 p-3 rounded-lg text-center border border-[var(--border)]">
                    <p className="text-xs text-slate-400">Vitesse Maximale</p>
                    <p className="text-lg font-bold text-slate-700">⚡ {selectedProduct.vitesseMax} km/h</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg text-center border border-[var(--border)]">
                    <p className="text-xs text-slate-400">Autonomie moyenne</p>
                    <p className="text-lg font-bold text-slate-700">🔋 {selectedProduct.autonomie} km</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg text-center border border-[var(--border)]">
                    <p className="text-xs text-slate-400">Poids de l&apos;appareil</p>
                    <p className="text-lg font-bold text-slate-700">⚖️ {selectedProduct.poids} kg</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-lg text-center border border-[var(--border)]">
                    <p className="text-xs text-slate-400">Garantie incluse</p>
                    <p className="text-lg font-bold text-slate-700">🛡️ 2 ans</p>
                  </div>
                </div>
              </div>

              {/* General details & description */}
              <div className="space-y-2">
                <h3 className="font-bold text-slate-700 text-sm uppercase tracking-wider">Description</h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  Ce modèle {selectedProduct.modele} est spécialement optimisé pour offrir une expérience agréable,
                  sécurisée et durable. Idéal pour tous vos besoins de déplacement, il propose des finitions soignées, 
                  un système de freinage de dernière génération et une excellente efficacité énergétique.
                </p>
              </div>

              {/* Status and purchasing */}
              <div className="flex flex-col md:flex-row items-center justify-between border-t border-[var(--border)] pt-5 gap-4">
                <div className="flex flex-col">
                  <span className="text-xs text-slate-400">Tarif TTC</span>
                  <span className="text-3xl font-bold text-[var(--primary)]">
                    {selectedProduct.prix.toLocaleString("fr-FR", {
                      style: "currency",
                      currency: "EUR",
                    })}
                  </span>
                  <span className={`text-xs mt-1 font-semibold ${
                    (selectedProduct.stock?.quantiteDisponible ?? 0) > 0 ? "text-emerald-600" : "text-rose-500"
                  }`}>
                    {(selectedProduct.stock?.quantiteDisponible ?? 0) > 0
                      ? `En stock : ${selectedProduct.stock?.quantiteDisponible} unités disponibles`
                      : "Ce modèle est actuellement victime de son succès (rupture de stock)"}
                  </span>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                  <button
                    onClick={() => setSelectedProduct(null)}
                    className="flex-1 md:flex-none h-11 px-5 border border-slate-300 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 cursor-pointer"
                  >
                    Fermer
                  </button>
                  <button
                    disabled={(selectedProduct.stock?.quantiteDisponible ?? 0) <= 0}
                    onClick={() => handleAddToCart(selectedProduct.idTrottinettes, selectedProduct.modele)}
                    className="flex-1 md:flex-none h-11 px-6 bg-[var(--primary)] hover:bg-[var(--primary-strong)] text-white font-semibold rounded-lg text-sm transition disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Ajouter au panier
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
