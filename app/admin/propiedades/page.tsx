import { AdminRouteGuard } from "@/components/admin-route-guard";
import { PropertiesManagement } from "@/components/properties-management";
import { getProperties } from "@/domain/Property";

export default async function AdminPropertiesPage() {
  const allProperties = await getProperties();

  return (
    <AdminRouteGuard>
      <PropertiesManagement allProperties={allProperties} />
    </AdminRouteGuard>
  );
}
