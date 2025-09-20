import { getAdminConfig } from "@/domain/Config";
import { ConfigManagement } from "@/components/config-management";

export default async function ConfiguracionPage() {
  const config = await getAdminConfig();
  return <ConfigManagement config={config} />;
}

