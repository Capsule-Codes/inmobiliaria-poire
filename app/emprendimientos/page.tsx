import { Navigation } from "@/components/navigation"
import { ProjectsGrid } from "@/components/projects-grid"
import { ProjectsHero } from "@/components/projects-hero"

export default function EmprendimientosPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <ProjectsHero />
      <ProjectsGrid />
    </main>
  )
}
