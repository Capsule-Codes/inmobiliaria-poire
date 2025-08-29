import { AdminRouteGuard } from "@/components/admin-route-guard"
import { AdminDashboard } from "@/components/admin-dashboard"
import { getDashboardStats } from "@/domain/services/dashboardStats"

export default async function AdminDashboardPage() {

  const data = await getDashboardStats();
  
  return (
    <AdminRouteGuard>
      <AdminDashboard stats={data} />
    </AdminRouteGuard>
  )
}
