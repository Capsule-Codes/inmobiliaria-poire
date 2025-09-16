"use client"

import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Calendar, Eye } from "lucide-react"
import { useState } from "react"
import { type Contact } from "@/types/contact"
import { type Project } from "@/types/project"
import { type Property } from "@/types/property"
import Link from "next/link"

export function ContactManagement({ allContacts, relatedProperties, relatedProjects }: { allContacts: Contact[], relatedProperties: Property[], relatedProjects: Project[] }) {
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [projects, setProjects] = useState<Project[]>(relatedProjects)
    const [properties, setProperties] = useState<Property[]>(relatedProperties)
    const [contacts, setContacts] = useState<Contact[]>(allContacts)

    const relatedPropertyName = (propertyId: string) => {
        const property = properties.find(prop => prop.id === propertyId);
        var ret = property ? property.title : "";
        return ret;
    }

    const relatedProjectName = (projectId: string) => {
        const project = projects.find(proj => proj.id === projectId);
        var ret = project ? project.name : "";
        return ret;
    }

    const contactDescription = (contact: Contact) => {
        let description = `${contact.inquiry_type}`;

        if (contact.property_id) {
            description += ` -  ${relatedPropertyName(contact.property_id)}`;
        }

        if (contact.project_id) {
            description += ` -  ${relatedProjectName(contact.project_id)}`;
        }
        return description;
    }

    const toogleStatus = (contactId: string) => {
        setContacts(prevContacts =>
            prevContacts.map(contact =>
                contact.id === contactId ? { ...contact, status: contact.status === "Contactado" ? "Pendiente" : "Contactado" } : contact
            )
        );
    }

    return (

        <div className="min-h-screen bg-background">
            <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} currentPage="contactos" />

            <div className="lg:ml-64">
                <div className="p-6 lg:p-8">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">Contactos</h1>
                        <p className="text-muted-foreground">Gestiona las consultas y contactos recibidos</p>
                    </div>

                    <div className="space-y-6">
                        {contacts.map((contact) => (
                            <Card key={contact.id}>
                                <CardHeader>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-lg">{contact.name}</CardTitle>
                                            <CardDescription>
                                                {contactDescription(contact)}
                                            </CardDescription>
                                        </div>
                                        <Badge
                                            variant={
                                                contact.status === "Pendiente"
                                                    ? "destructive"
                                                    : contact.status === "Contactado"
                                                        ? "secondary"
                                                        : "outline"
                                            }
                                        >
                                            {contact.status}
                                        </Badge>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{contact.email}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{contact.phone}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <span className="text-sm">{contact.created_at}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button size="sm" variant="outline">
                                            <Eye className="h-4 w-4 mr-2" />
                                            <Link href={`/contacto/${contact.id}`}>
                                                Ver Detalles
                                            </Link>
                                        </Button>
                                        <Button onClick={() => toogleStatus(contact.id)} size="sm">
                                            {contact.status === "Contactado" ? "Marcar como Pendiente" : "Marcar como Contactado"}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
