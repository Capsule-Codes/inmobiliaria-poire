"use client"

import { AdminRouteGuard } from "@/components/admin-route-guard"
import { AdminDashboard } from "@/components/admin-dashboard"

export default function AdminDashboardPage() {
  return (
    <AdminRouteGuard>
      <AdminDashboard />
    </AdminRouteGuard>
  )
}
