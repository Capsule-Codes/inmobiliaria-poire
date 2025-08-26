"use client"

import { AdminRouteGuard } from "@/components/admin-route-guard"
import { FeaturedManagement } from "@/components/featured-management"

export default function AdminFeaturedPage() {
  return (
    <AdminRouteGuard>
      <FeaturedManagement />
    </AdminRouteGuard>
  )
}
