import { Navigation } from "@/components/navigation";
import { HeroSection } from "@/components/hero-section";
import { FeaturedProperties } from "@/components/featured-properties";
import { FeaturedProjects } from "@/components/featured-projects";
import { Footer } from "@/components/footer";
import { getFeaturedProperties } from "@/domain/Property";
import { Property } from "@/types/Property";
import { getFeaturedProjects } from "@/domain/Project";
import { Project } from "@/types/project";

// Revalidar cada 60 segundos para mostrar cambios recientes
export const revalidate = 60;

export default async function HomePage() {
  const allFeaturedProperties = (await getFeaturedProperties()) as Property[];

  const allFeaturedProjects = (await getFeaturedProjects()) as Project[];

  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturedProperties allFeaturedProperties={allFeaturedProperties} />
      <FeaturedProjects allFeaturedProjects={allFeaturedProjects} />
      <Footer />
    </main>
  );
}
