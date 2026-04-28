import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import { CatalogPreviewSection } from "@/components/sections/catalog-preview";
import { CommunityCtaSection } from "@/components/sections/community-cta";
import { FeatureIconsSection } from "@/components/sections/feature-icons";
import { HeroSection } from "@/components/sections/hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--background)]">
      <Navbar />
      <main>
        <HeroSection />
        <FeatureIconsSection />
        <CatalogPreviewSection />
        <CommunityCtaSection />
      </main>
      <Footer />
    </div>
  );
}
