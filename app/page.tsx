import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProperties } from "@/components/featured-properties"
import { FeaturedProjects } from "@/components/featured-projects"
import { getFeaturedProperties } from "@/domain/property"
import { Property } from "@/types/property"
import { getFeaturedProjects } from "@/domain/project"
import { Project } from "@/types/project"

export default async function HomePage() {

  const allFeaturedProperties = await getFeaturedProperties() as Property[];

  const allFeaturedProjects = await getFeaturedProjects() as Project[];

  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturedProperties allFeaturedProperties={allFeaturedProperties} />
      <FeaturedProjects allFeaturedProjects={allFeaturedProjects} />
    </main>
  )
}
