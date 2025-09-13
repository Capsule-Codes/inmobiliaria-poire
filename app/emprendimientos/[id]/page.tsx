import { Navigation } from "@/components/navigation"
import { ProjectDetail } from "@/components/project-detail"
import { notFound } from "next/navigation"
import { getProjectById } from "@/domain/project"


export default async function ProjectDetailPage({ params }: { params: { id: string } }) {

  const { id } = await params;
  const project = await getProjectById(id)

  if (!project) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <ProjectDetail project={project} />
    </main>
  )
}
