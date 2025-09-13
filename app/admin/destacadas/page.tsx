
import { AdminRouteGuard } from "@/components/admin-route-guard"
import { FeaturedManagement } from "@/components/featured-management"
import { getFeaturedProperties } from "@/domain/Property"
import { getFeaturedProjects } from "@/domain/Project"
import { type Property } from "@/types/Property"
import { type Project } from "@/types/Project"

export default async function AdminFeaturedPage() {
  const featuredProperties = await getFeaturedProperties() as Property[]
  const featuredProjects = await getFeaturedProjects() as Project[]
  return (
    <AdminRouteGuard>
      <FeaturedManagement
        featuredProperties={featuredProperties}
        featuredProjects={featuredProjects}
      />
    </AdminRouteGuard>
  )
}
