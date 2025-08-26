"use client"

import { AdminRouteGuard } from "@/components/admin-route-guard"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Calendar, Eye } from "lucide-react"
import { useState } from "react"

export default function ContactosPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Mock data de contactos
  const contacts = [
    {
      id: 1,
      name: "María González",
      email: "maria@email.com",
      phone: "+54 11 1234-5678",
      type: "Consulta General",
      property: "Casa en Belgrano",
      date: "2024-01-15",
      status: "Pendiente",
    },
    {
      id: 2,
      name: "Carlos Rodríguez",
      email: "carlos@email.com",
      phone: "+54 11 8765-4321",
      type: "Tasación",
      property: "Departamento Palermo",
      date: "2024-01-14",
      status: "Contactado",
    },
    {
      id: 3,
      name: "Ana López",
      email: "ana@email.com",
      phone: "+54 11 5555-1234",
      type: "Información",
      property: "Torres del Río",
      date: "2024-01-13",
      status: "Cerrado",
    },
  ]

  return (
    <AdminRouteGuard>
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
                          {contact.type} - {contact.property}
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
                        <span className="text-sm">{contact.date}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Eye className="h-4 w-4 mr-2" />
                        Ver Detalles
                      </Button>
                      <Button size="sm">Marcar como Contactado</Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AdminRouteGuard>
  )
}
