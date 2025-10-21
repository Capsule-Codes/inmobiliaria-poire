import { AdminRouteGuard } from "@/components/admin-route-guard";
import { AdminDashboard } from "@/components/admin-dashboard";
import { getDashboardStats } from "@/domain/services/dashboardStats";

// Deshabilitar caché para el admin - siempre datos frescos
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminDashboardPage() {
  const data = await getDashboardStats();

  return (
    <AdminRouteGuard>
      <AdminDashboard stats={data} />
    </AdminRouteGuard>
  );
}
