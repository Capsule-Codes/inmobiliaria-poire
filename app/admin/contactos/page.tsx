import { AdminRouteGuard } from "@/components/admin-route-guard"
import { ContactManagement } from "@/components/contact-management"
import { type Contact } from "@/types/contact"
import { type Property } from "@/types/property"
import { type Project } from "@/types/project"
import { getContacts } from "@/domain/contact"
import { getProjectById } from "@/domain/Project"
import { getPropertyById } from "@/domain/Property"


export default async function ContactosPage() {

  const contacts = await getContacts() as Contact[]
  const relatedProperties: Property[] = []
  const relatedProjects: Project[] = []

  contacts.forEach(async contact => {

    var propertyId = contact.property_id ? contact.property_id : ""
    var projectId = contact.project_id ? contact.project_id : ""

    var isPropertyAcquired = relatedProperties.some(prop => prop.id === propertyId);
    var isProjectAcquired = relatedProjects.some(proj => proj.id === projectId);

    try {
      if (contact.project_id !== "" && !isProjectAcquired) {
        const project = await getProjectById(projectId) as Project;
        relatedProjects.push(project);
      }

      if (contact.property_id !== "" && !isPropertyAcquired) {
        const property = await getPropertyById(propertyId) as Property;
        relatedProperties.push(property);
      }
    } catch (error) {
      console.error("Error fetching property or project:", error);
    }


  });


  return (
    <AdminRouteGuard>
      <ContactManagement contacts={contacts} relatedProperties={relatedProperties} relatedProjects={relatedProjects} />
    </AdminRouteGuard>
  )
}