import { AdminRouteGuard } from "@/components/admin-route-guard";
import { PropertiesManagement } from "@/components/properties-management";
import { getAllProperties } from "@/domain/Property";

export default async function AdminPropertiesPage() {
  const allProperties = await getAllProperties();

  return (
    <AdminRouteGuard>
      <PropertiesManagement allProperties={allProperties} />
    </AdminRouteGuard>
  );
}
