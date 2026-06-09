import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { AdminSidebar } from "@/components/admin/sidebar";
import { requireAdmin } from "@/lib/auth/guards";

export const metadata = {
  title: "Administration | EcoRide",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main className="ec-container py-10">
        <div className="flex flex-col gap-6 lg:flex-row">
          <AdminSidebar />
          <div className="min-w-0 flex-1">{children}</div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
