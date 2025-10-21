import { AdminRouteGuard } from "@/components/admin-route-guard";
import { ProjectsManagement } from "@/components/projects-management";
import { getProjects } from "@/domain/Project";

// Deshabilitar caché para el admin - siempre datos frescos
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminProjectsPage() {
  const allProjects = await getProjects();

  return (
    <AdminRouteGuard>
      <ProjectsManagement allProjects={allProjects} />
    </AdminRouteGuard>
  );
}
