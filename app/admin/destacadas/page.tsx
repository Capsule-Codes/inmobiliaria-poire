import { AdminRouteGuard } from "@/components/admin-route-guard";
import { FeaturedManagement } from "@/components/featured-management";
import { getFeaturedProperties } from "@/domain/Property";
import { getFeaturedProjects } from "@/domain/Project";
import { type Property } from "@/types/Property";
import { type Project } from "@/types/project";

// Deshabilitar caché para el admin - siempre datos frescos
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminFeaturedPage() {
  const featuredProperties = (await getFeaturedProperties()) as Property[];
  const featuredProjects = (await getFeaturedProjects()) as Project[];
  return (
    <AdminRouteGuard>
      <FeaturedManagement
        featuredProperties={featuredProperties}
        featuredProjects={featuredProjects}
      />
    </AdminRouteGuard>
  );
}
