"use client"

import { AdminRouteGuard } from "@/components/admin-route-guard"
import { ProjectsManagement } from "@/components/projects-management"

export default function AdminProjectsPage() {
  return (
    <AdminRouteGuard>
      <ProjectsManagement />
    </AdminRouteGuard>
  )
}
