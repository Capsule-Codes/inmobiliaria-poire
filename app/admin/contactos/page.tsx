import { AdminRouteGuard } from "@/components/admin-route-guard"
import { ContactManagement } from "@/components/contact-management"
import { type Contact } from "@/types/contact"
import { type Property } from "@/types/property"
import { type Project } from "@/types/project"
import { getContacts } from "@/domain/contact"
import { getProjectById } from "@/domain/Project"
import { getPropertyById } from "@/domain/Property"


export default async function ContactosPage() {
  const allContacts = (await getContacts()) as Contact[];
  const relatedProperties: Property[] = [];
  const relatedProjects: Project[] = [];

  for (const contact of allContacts) {
    const propertyId = contact.property_id ?? "";
    const projectId = contact.project_id ?? "";

    const propFetched = relatedProperties.some(p => p.id === propertyId);
    const projFetched = relatedProjects.some(p => p.id === projectId);

    try {
      if (projectId && !projFetched) {
        const project = (await getProjectById(projectId)) as Project;
        if (project) relatedProjects.push(project);
      }
      if (propertyId && !propFetched) {
        const property = (await getPropertyById(propertyId)) as Property;
        if (property) relatedProperties.push(property);
      }
    } catch (err) {
      console.error("Error fetching property or project:", err);
    }
  }

  return (
    <AdminRouteGuard>
      <ContactManagement allContacts={allContacts} relatedProperties={relatedProperties} relatedProjects={relatedProjects} />
    </AdminRouteGuard>
  )
}