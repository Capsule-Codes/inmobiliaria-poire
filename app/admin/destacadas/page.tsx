
import { AdminRouteGuard } from "@/components/admin-route-guard"
import { FeaturedManagement } from "@/components/featured-management"
import { getFeaturedProperties } from "@/domain/Property"
import { getFeaturedProjects } from "@/domain/Projects"
import { type Property } from "@/types/Property"

export default async function AdminFeaturedPage() {
  const featuredProperties = await getFeaturedProperties() as Property[]
  return (
    <AdminRouteGuard>
      <FeaturedManagement
        featuredProperties={featuredProperties}
      />
    </AdminRouteGuard>
  )
}
