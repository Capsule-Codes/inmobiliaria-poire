import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { FeaturedProperties } from "@/components/featured-properties"
import { FeaturedProjects } from "@/components/featured-projects"
import { getFeaturedProperties } from "@/domain/Property"

export default async function HomePage() {

  const featuredProperties = await getFeaturedProperties();

  const allFeaturedProperties = featuredProperties.map(f => ({
    id: f.id,
    title: f.title,
    location: f.location,
    price: f.price,
    bedrooms: f.bedrooms,
    bathrooms: f.bathrooms,
    area: f.area,
    image: f.images[0] || ''
  }));

  return (
    <main className="min-h-screen">
      <Navigation />
      <HeroSection />
      <FeaturedProperties allFeaturedProperties={allFeaturedProperties} />
      <FeaturedProjects />
    </main>
  )
}
