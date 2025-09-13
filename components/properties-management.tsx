"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { PropertyForm } from "@/components/property-form"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Building2, Plus, Search, Edit, Trash2, Star, StarOff, MapPin, Bed, Bath, Square } from "lucide-react"
import { useSearchPropertyContext } from "@/contexts/search-property-context"
import { Property } from "@/types/Property"


export function PropertiesManagement() {
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const { properties } = useSearchPropertyContext()

  const filteredProperties = properties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProperty = () => {
    setEditingProperty(null)
    setShowForm(true)
  }

  const handleEditProperty = (property: Property) => {
    setEditingProperty(property)
    setShowForm(true)
  }

  const handleDeleteProperty = (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta propiedad?")) {
      console.log('Eliminando propiedad con id:', id);

      fetch(`/api/admin/propiedades/${id}`, {
        method: 'DELETE',
      }).then((res) => {
        if (res.ok) {
          console.log('Propiedad eliminada');
        } else {
          console.error('Error al eliminar la propiedad');
        }

      });
    }
  }

  const handleToggleFeatured = (id: string) => {
    const property = properties.find((p) => p.id === id);
    if (property) {
      const updatedProperty = { ...property, is_featured: !property.is_featured };

      fetch(`/api/admin/propiedades/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProperty),
      }).then((res) => {
        if (res.ok) {
          console.log('Propiedad actualizada', res);
        } else {
          console.error('Error al actualizar la propiedad');
        }
      });
    }
  }

  const handleSaveProperty = (propertyData: any) => {

    if (editingProperty) {
      fetch(`/api/admin/propiedades/${editingProperty.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      }).then((res) => {
        if (res.ok) {
          console.log('Propiedad actualizada');
        } else {
          console.error('Error al actualizar la propiedad');
        }
      }).finally(() => {
        setShowForm(false);
        setEditingProperty(null);
      });
    } else {
      fetch('/api/admin/propiedades', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData),
      }).then((res) => {
        if (res.ok) {
          console.log('Propiedad creada');
        } else {
          console.error('Error al crear la propiedad');
        }
      }).finally(() => {
        setShowForm(false);
        setEditingProperty(null);
      });
    }
  }

  if (showForm) {
    return (
      <PropertyForm
        property={editingProperty}
        onSave={handleSaveProperty}
        onCancel={() => {
          setShowForm(false)
          setEditingProperty(null)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} currentPage="propiedades" />

      <div className="lg:ml-64">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Gestión de Propiedades</h1>
              <p className="text-muted-foreground">Administra todas las propiedades del sitio</p>
            </div>
            <Button
              onClick={handleAddProperty}
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
            >
              <Plus className="h-4 w-4 mr-2" />
              Agregar Propiedad
            </Button>
          </div>

          {/* Search and Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar propiedades..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total</p>
                    <p className="text-2xl font-bold">{properties.length}</p>
                  </div>
                  <Building2 className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Destacadas</p>
                    <p className="text-2xl font-bold">{properties.filter((p) => p.is_featured).length}</p>
                  </div>
                  <Star className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Properties Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={property.images[0] || "/placeholder.svg"}
                    alt={property.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    {property.is_featured && (
                      <Badge className="bg-secondary text-secondary-foreground">
                        <Star className="h-3 w-3 mr-1" />
                        Destacada
                      </Badge>
                    )}
                    <Badge variant="outline" className="bg-background/80">
                      {property.status}
                    </Badge>
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-semibold text-foreground line-clamp-1">{property.title}</h3>
                    <span className="text-sm font-bold text-secondary">{property.price}</span>
                  </div>

                  <div className="flex items-center text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm line-clamp-1">{property.location}</span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 mr-1" />
                      <span>{property.bedrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <Bath className="h-4 w-4 mr-1" />
                      <span>{property.bathrooms}</span>
                    </div>
                    <div className="flex items-center">
                      <Square className="h-4 w-4 mr-1" />
                      <span>{property.area}m²</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleFeatured(property.id)}
                      className="flex-1"
                    >
                      {property.is_featured ? <StarOff className="h-4 w-4 mr-1" /> : <Star className="h-4 w-4 mr-1" />}
                      {property.is_featured ? "Quitar" : "Destacar"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditProperty(property)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProperty(property.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProperties.length === 0 && (
            <div className="text-center py-12">
              <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No se encontraron propiedades</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza agregando tu primera propiedad"}
              </p>
              {!searchTerm && (
                <Button
                  onClick={handleAddProperty}
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Primera Propiedad
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
