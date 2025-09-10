import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProperties } from "@/components/featured-properties"
import { FeaturedProjects } from "@/components/featured-projects"
import { getFeaturedProperties } from "@/domain/Property"
import { Property } from "@/types/Propery"

export default async function HomePage() {

  const featuredProperties = await getFeaturedProperties();

  const allFeaturedProperties = featuredProperties as Property[];

  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturedProperties allFeaturedProperties={allFeaturedProperties} />
      <FeaturedProjects />
    </main>
  )
}
