import { Navigation } from "@/components/navigation";
import { ProjectsGrid } from "@/components/projects-grid";
import { ProjectsHero } from "@/components/projects-hero";
import { Footer } from "@/components/footer";
import { getProjects } from "@/domain/Project";
import { Project } from "@/types/project";

// Revalidar cada 60 segundos
export const revalidate = 60;

export default async function EmprendimientosPage() {
  const allProjects = (await getProjects()) as Project[];

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <ProjectsHero />
      <ProjectsGrid allProjects={allProjects} />
      <Footer />
    </main>
  );
}
