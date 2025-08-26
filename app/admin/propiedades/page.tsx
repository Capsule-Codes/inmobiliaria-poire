"use client"

import { AdminRouteGuard } from "@/components/admin-route-guard"
import { PropertiesManagement } from "@/components/properties-management"

export default function AdminPropertiesPage() {
  return (
    <AdminRouteGuard>
      <PropertiesManagement />
    </AdminRouteGuard>
  )
}
