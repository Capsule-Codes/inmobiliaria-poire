"use client"

import { AdminRouteGuard } from "@/components/admin-route-guard"
import { PropertiesManagement } from "@/components/properties-management"
import { SearchPropertyProvider } from "@/contexts/search-property-context"

export default function AdminPropertiesPage() {
  return (
    <AdminRouteGuard>
      <SearchPropertyProvider>
        <PropertiesManagement />
      </SearchPropertyProvider>
    </AdminRouteGuard>
  )
}
