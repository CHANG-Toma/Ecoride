import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { SidebarNav } from "@/components/dashboard/sidebar-nav";
import { getSession } from "@/lib/auth/session";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Gestion des utilisateurs | EcoRide Admin",
  description: "Liste et gestion de tous les utilisateurs EcoRide.",
};

const ROLE_STYLE: Record<string, { label: string; color: string; bg: string }> = {
  client: { label: "Client", color: "#15803d", bg: "#dcfce7" },
  technicien: { label: "Technicien", color: "#1d4ed8", bg: "#dbeafe" },
  admin: { label: "Admin", color: "#7c3aed", bg: "#ede9fe" },
};

export default async function AdminUtilisateursPage() {
  const session = await getSession();
  if (!session) redirect("/connexion");

  const utilisateurs = await prisma.utilisateur.findMany({
    orderBy: { dateInscription: "desc" },
    include: {
      _count: { select: { commandes: true } },
    },
  });

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main className="ec-container py-8">
        <div className="flex flex-col gap-6 md:flex-row">
          <SidebarNav
            role="admin"
            activePath="/admin/utilisateurs"
            prenom={session.prenom}
            nom={session.nom}
          />

          <div className="min-w-0 flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-[var(--title)]">
                Utilisateurs
              </h1>
              <span className="rounded-full bg-purple-100 px-3 py-1 text-sm font-semibold text-purple-700">
                {utilisateurs.length} inscrits
              </span>
            </div>

            <div className="ec-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)] bg-[var(--background)]">
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Utilisateur
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Email
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Rôle
                      </th>
                      <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Ville
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Commandes
                      </th>
                      <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Inscrit le
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[var(--border)]">
                    {utilisateurs.map((u) => {
                      const roleStyle = ROLE_STYLE[u.role] ?? {
                        label: u.role,
                        color: "#64748b",
                        bg: "#f1f5f9",
                      };
                      const initials = `${u.prenom[0] ?? ""}${u.nom[0] ?? ""}`.toUpperCase();

                      return (
                        <tr
                          key={u.idClient}
                          className="transition-colors hover:bg-[var(--background)]"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className="grid size-8 shrink-0 place-items-center rounded-full text-xs font-bold text-white"
                                style={{ background: roleStyle.color }}
                              >
                                {initials}
                              </div>
                              <span className="font-medium text-[var(--foreground)]">
                                {u.prenom} {u.nom}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4 text-slate-500">{u.email}</td>
                          <td className="px-5 py-4">
                            <span
                              className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold"
                              style={{ color: roleStyle.color, background: roleStyle.bg }}
                            >
                              {roleStyle.label}
                            </span>
                          </td>
                          <td className="px-5 py-4 text-slate-500">
                            {u.ville}
                          </td>
                          <td className="px-5 py-4 text-right font-medium">
                            {u._count.commandes}
                          </td>
                          <td className="px-5 py-4 text-right text-slate-400">
                            {new Date(u.dateInscription).toLocaleDateString("fr-FR")}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
