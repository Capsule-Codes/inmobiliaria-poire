
import { AdminRouteGuard } from "@/components/admin-route-guard"
import { FeaturedManagement } from "@/components/featured-management"
import { getFeaturedProperties } from "@/domain/property"
import { getFeaturedProjects } from "@/domain/project"
import { type Property } from "@/types/property"
import { type Project } from "@/types/project"

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
