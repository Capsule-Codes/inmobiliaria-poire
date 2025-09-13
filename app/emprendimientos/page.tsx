import { Navigation } from "@/components/navigation"
import { ProjectsGrid } from "@/components/projects-grid"
import { ProjectsHero } from "@/components/projects-hero"
import { getProjects } from "@/domain/project"
import { Project } from "@/types/project"

export default async function EmprendimientosPage() {

  const allProjects = await getProjects() as Project[];

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <ProjectsHero />
      <ProjectsGrid allProjects={allProjects} />
    </main>
  )
}
