import { getAdminConfig } from "@/domain/Config";
import { ConfigManagement } from "@/components/config-management";

// Deshabilitar caché para el admin - siempre datos frescos
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ConfiguracionPage() {
  const config = await getAdminConfig();
  return <ConfigManagement config={config} />;
}
