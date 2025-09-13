import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProperties } from "@/components/featured-properties"
import { FeaturedProjects } from "@/components/featured-projects"
import { getFeaturedProperties } from "@/domain/Property"
import { Property } from "@/types/Property"
import { getFeaturedProjects } from "@/domain/Project"

export default async function HomePage() {

  const featuredProperties = await getFeaturedProperties();
  const allFeaturedProperties = featuredProperties as Property[];

  const allFeaturedProjects = await getFeaturedProjects();
  console.log(allFeaturedProjects);

  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturedProperties allFeaturedProperties={allFeaturedProperties} />
      <FeaturedProjects allFeaturedProjects={allFeaturedProjects} />
    </main>
  )
}
