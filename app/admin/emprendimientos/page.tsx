import { AdminRouteGuard } from "@/components/admin-route-guard"
import { ProjectsManagement } from "@/components/projects-management"
import { getProjects } from "@/domain/project"

export default async function AdminProjectsPage() {
  const allProjects = await getProjects()

  return (
    <AdminRouteGuard>
      <ProjectsManagement allProjects={allProjects} />
    </AdminRouteGuard>
  )
}
