import Link from "next/link";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Paiement | EcoRide",
};

export default function PaiementPage() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />

      <main className="ec-container py-10">
        <div className="ec-card max-w-4xl space-y-8 p-6">
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-strong)]">
              Paiement
            </p>
            <h1 className="text-3xl font-semibold text-[var(--title)]">
              Valider votre commande
            </h1>
            <p className="text-sm text-slate-600">
              Choisissez un mode de paiement et finalisez votre achat. Cette page montre la maquette du parcours paiement.
            </p>
          </div>

          <div className="grid gap-6 xl:grid-cols-[1.4fr_0.6fr]">
            <section className="space-y-6 rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[var(--title)]">Informations de paiement</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-600">
                    <span>Nom sur la carte</span>
                    <input
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
                      type="text"
                      placeholder="Marie Dupont"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-slate-600">
                    <span>Numéro de carte</span>
                    <input
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
                      type="text"
                      placeholder="1234 5678 9012 3456"
                    />
                  </label>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="space-y-2 text-sm text-slate-600">
                    <span>Date d&apos;expiration</span>
                    <input
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
                      type="text"
                      placeholder="MM/AA"
                    />
                  </label>
                  <label className="space-y-2 text-sm text-slate-600">
                    <span>Cryptogramme</span>
                    <input
                      className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm outline-none transition focus:border-[var(--primary)]"
                      type="text"
                      placeholder="123"
                    />
                  </label>
                </div>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[var(--title)]">Mode de paiement</h2>
                <div className="space-y-3">
                  {[
                    { label: "Carte bancaire", description: "Visa, Mastercard, Amex" },
                    { label: "PayPal", description: "Paiement rapide sécurisé" },
                    { label: "Virement bancaire", description: "Enregistrement manuel" },
                  ].map((method) => (
                    <label
                      key={method.label}
                      className="flex cursor-pointer items-start gap-3 rounded-3xl border border-[var(--border)] bg-[var(--background)] p-4 transition hover:border-[var(--primary)]"
                    >
                      <input type="radio" name="payment-method" className="mt-2 h-4 w-4 text-[var(--primary)]" />
                      <div>
                        <p className="text-sm font-semibold text-[var(--title)]">{method.label}</p>
                        <p className="text-sm text-slate-500">{method.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-500">
                  Cette page est une maquette. L&apos;intégration réelle du paiement n&apos;est pas encore connectée.
                </p>
                <Button type="button">Payer maintenant</Button>
              </div>
            </section>

            <aside className="space-y-6 rounded-3xl border border-[var(--border)] bg-white p-6 shadow-sm">
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-[var(--title)]">Récapitulatif</h2>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between">
                    <span>Trottinette EcoRide City One</span>
                    <span>499,99 €</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Frais de livraison</span>
                    <span>15,00 €</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Réduction</span>
                    <span>- 20,00 €</span>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl bg-[var(--background)] p-4">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>Total</span>
                  <strong className="text-lg text-[var(--title)]">494,99 €</strong>
                </div>
              </div>

              <div className="rounded-3xl border border-[var(--border)] bg-[var(--background)] p-4 text-sm text-slate-600">
                <p className="font-semibold text-[var(--title)]">Besoin d&apos;aide ?</p>
                <p>Contactez notre support ou consultez les conditions de paiement.</p>
                <Link className="text-[var(--accent-strong)] hover:underline" href="#">
                  Support EcoRide
                </Link>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
