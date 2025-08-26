"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ProjectForm } from "@/components/project-form"
import { AdminSidebar } from "@/components/admin-sidebar"
import { TrendingUp, Plus, Search, Edit, Trash2, Star, StarOff, MapPin, Calendar, Building, Users } from "lucide-react"

// Mock data - esto se reemplazará con datos reales
const initialProjects = [
  {
    id: 1,
    title: "Torres del Río",
    location: "Puerto Madero, Buenos Aires",
    description: "Complejo residencial de lujo con vista panorámica al río y amenities de primer nivel.",
    status: "En Construcción",
    progress: 75,
    deliveryDate: "Diciembre 2024",
    totalUnits: 120,
    availableUnits: 28,
    priceFrom: "USD 450.000",
    image: "/luxury-towers-river-view.png",
    images: ["/luxury-towers-river-view.png"],
    amenities: ["Piscina", "Gimnasio", "SUM", "Cocheras", "Seguridad 24hs"],
    featured: true,
  },
  {
    id: 2,
    title: "Residencial Palermo Green",
    location: "Palermo, Buenos Aires",
    description: "Desarrollo sustentable con espacios verdes y tecnología inteligente para el hogar moderno.",
    status: "En Venta",
    progress: 100,
    deliveryDate: "Entrega Inmediata",
    totalUnits: 80,
    availableUnits: 12,
    priceFrom: "USD 380.000",
    image: "/green-residential-complex.png",
    images: ["/green-residential-complex.png"],
    amenities: ["Jardín Vertical", "Coworking", "Bicicletero", "Terraza Verde"],
    featured: false,
  },
  {
    id: 3,
    title: "Nordelta Premium",
    location: "Nordelta, Buenos Aires",
    description: "Exclusivo barrio cerrado con casas de diseño contemporáneo y acceso al lago.",
    status: "Próximamente",
    progress: 15,
    deliveryDate: "Junio 2025",
    totalUnits: 45,
    availableUnits: 45,
    priceFrom: "USD 650.000",
    image: "/gated-community-lake-access.png",
    images: ["/gated-community-lake-access.png"],
    amenities: ["Club House", "Muelle Privado", "Cancha de Tenis", "Parque"],
    featured: true,
  },
]

const statusColors = {
  "En Construcción": "bg-yellow-500",
  "En Venta": "bg-green-500",
  Próximamente: "bg-blue-500",
}

export function ProjectsManagement() {
  const [projects, setProjects] = useState(initialProjects)
  const [searchTerm, setSearchTerm] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingProject, setEditingProject] = useState<any>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const filteredProjects = projects.filter(
    (project) =>
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const handleAddProject = () => {
    setEditingProject(null)
    setShowForm(true)
  }

  const handleEditProject = (project: any) => {
    setEditingProject(project)
    setShowForm(true)
  }

  const handleDeleteProject = (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar este emprendimiento?")) {
      setProjects(projects.filter((p) => p.id !== id))
    }
  }

  const handleToggleFeatured = (id: number) => {
    setProjects(projects.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p)))
  }

  const handleSaveProject = (projectData: any) => {
    if (editingProject) {
      // Editar proyecto existente
      setProjects(projects.map((p) => (p.id === editingProject.id ? { ...projectData, id: editingProject.id } : p)))
    } else {
      // Agregar nuevo proyecto
      const newProject = {
        ...projectData,
        id: Math.max(...projects.map((p) => p.id)) + 1,
      }
      setProjects([...projects, newProject])
    }
    setShowForm(false)
    setEditingProject(null)
  }

  if (showForm) {
    return (
      <ProjectForm
        project={editingProject}
        onSave={handleSaveProject}
        onCancel={() => {
          setShowForm(false)
          setEditingProject(null)
        }}
      />
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} currentPage="emprendimientos" />

      <div className="lg:ml-64">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Gestión de Emprendimientos</h1>
              <p className="text-muted-foreground">Administra todos los proyectos inmobiliarios</p>
            </div>
            <Button onClick={handleAddProject} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Emprendimiento
            </Button>
          </div>

          {/* Search and Stats */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar emprendimientos..."
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
                    <p className="text-2xl font-bold">{projects.length}</p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Destacados</p>
                    <p className="text-2xl font-bold">{projects.filter((p) => p.featured).length}</p>
                  </div>
                  <Star className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredProjects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <div className="relative">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 left-2 flex gap-2">
                    {project.featured && (
                      <Badge className="bg-secondary text-secondary-foreground">
                        <Star className="h-3 w-3 mr-1" />
                        Destacado
                      </Badge>
                    )}
                    <Badge className={`${statusColors[project.status as keyof typeof statusColors]} text-white`}>
                      {project.status}
                    </Badge>
                  </div>
                  <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
                    Desde {project.priceFrom}
                  </div>
                </div>

                <CardContent className="p-4">
                  <div className="mb-4">
                    <h3 className="font-semibold text-foreground mb-1 line-clamp-1">{project.title}</h3>
                    <div className="flex items-center text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4 mr-1" />
                      <span className="text-sm line-clamp-1">{project.location}</span>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{project.description}</p>
                  </div>

                  {/* Progress */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs font-medium text-foreground">Progreso</span>
                      <span className="text-xs text-muted-foreground">{project.progress}%</span>
                    </div>
                    <Progress value={project.progress} className="h-1.5" />
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-2 mb-4 text-xs text-muted-foreground">
                    <div className="flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span className="truncate">{project.deliveryDate}</span>
                    </div>
                    <div className="flex items-center">
                      <Building className="h-3 w-3 mr-1" />
                      <span>{project.totalUnits} unidades</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-3 w-3 mr-1" />
                      <span>{project.availableUnits} disponibles</span>
                    </div>
                  </div>

                  {/* Amenities */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {project.amenities.slice(0, 3).map((amenity, index) => (
                        <Badge key={index} variant="secondary" className="text-xs px-2 py-0">
                          {amenity}
                        </Badge>
                      ))}
                      {project.amenities.length > 3 && (
                        <Badge variant="secondary" className="text-xs px-2 py-0">
                          +{project.amenities.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleFeatured(project.id)}
                      className="flex-1"
                    >
                      {project.featured ? <StarOff className="h-4 w-4 mr-1" /> : <Star className="h-4 w-4 mr-1" />}
                      {project.featured ? "Quitar" : "Destacar"}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleEditProject(project)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteProject(project.id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredProjects.length === 0 && (
            <div className="text-center py-12">
              <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No se encontraron emprendimientos</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "Intenta con otros términos de búsqueda" : "Comienza agregando tu primer emprendimiento"}
              </p>
              {!searchTerm && (
                <Button
                  onClick={handleAddProject}
                  className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Primer Emprendimiento
                </Button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
