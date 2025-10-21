import { AdminRouteGuard } from "@/components/admin-route-guard";
import { PropertiesManagement } from "@/components/properties-management";
import { getAllProperties } from "@/domain/Property";

// Deshabilitar caché para el admin - siempre datos frescos
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminPropertiesPage() {
  const allProperties = await getAllProperties();

  return (
    <AdminRouteGuard>
      <PropertiesManagement allProperties={allProperties} />
    </AdminRouteGuard>
  );
}
