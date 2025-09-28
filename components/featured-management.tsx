"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Star, StarOff, MapPin, Bed, Bath, Square, Calendar, Building, Users, Eye, TrendingUp } from "lucide-react"
import { type Property } from "@/types/Property"
import { type Project } from "@/types/project"
import Image from "next/image"


const statusColors = {
  "En Construcción": "bg-yellow-500",
  "En Venta": "bg-green-500",
  "Próximamente": "bg-blue-500",
}

export function FeaturedManagement({ featuredProperties, featuredProjects }: { featuredProperties: Property[], featuredProjects: Project[] }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [properties, setProperties] = useState(featuredProperties)
  const [projects, setProjects] = useState(featuredProjects)

  const allFeatured = [...properties.map((p) => ({ ...p, type: 'Propiedad', title: p.title, image: p.images[0] || "/placeholder.svg" })), ...projects.map((p) => ({ ...p, type: 'Emprendimiento', title: p.name, price: `Desde ${p.price_from}`, image: p.images[0] || "/placeholder.svg" }))]

  const handleToggleFeatured = (id: string, type: string) => {
    if (type === "Propiedad") {
      setProperties(properties.map((p) => (p.id === id ? { ...p, is_featured: !p.is_featured } : p)))
    } else {
      setProjects(projects.map((p) => (p.id === id ? { ...p, is_featured: !p.is_featured } : p)))
    }
  }

  const handlePreviewHome = () => {
    window.open("/", "_blank")
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} currentPage="destacadas" />

      <div className="lg:ml-64">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Gestión de Destacadas</h1>
              <p className="text-muted-foreground">
                Administra las propiedades y emprendimientos destacados en la home
              </p>
            </div>
            <Button onClick={handlePreviewHome} variant="outline" className="bg-transparent">
              <Eye className="h-4 w-4 mr-2" />
              Ver en Home
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Total Destacadas</p>
                    <p className="text-2xl font-bold">{allFeatured.length}</p>
                  </div>
                  <Star className="h-8 w-8 text-secondary" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Propiedades</p>
                    <p className="text-2xl font-bold">{properties.length}</p>
                  </div>
                  <MapPin className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Emprendimientos</p>
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
                    <p className="text-sm text-muted-foreground">Slides Activos</p>
                    <p className="text-2xl font-bold">{Math.ceil(allFeatured.length / 3)}</p>
                  </div>
                  <Eye className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Featured Items Preview */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-secondary" />
                Vista Previa del Carousel
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-muted-foreground mb-4">
                Así se verán las destacadas en la página principal (mostrando 3 por slide):
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {allFeatured.slice(0, 3).map((item) => (
                  <div key={`${item.type}-${item.id}`} className="relative h-32">
                    {(() => {
                      const raw: any = (item as any)?.images
                      let coverSrc = "/placeholder.svg"
                      if (raw && typeof raw === 'object' && Array.isArray(raw.items)) {
                        const items: any[] = raw.items as any[]
                        const main = items.find((it) => typeof it?.sortOrder === 'number' && it.sortOrder === 0)
                        const chosen = main ?? items[0]
                        if (chosen?.mediaId) {
                          const base = item.type === 'Propiedad' ? 'propiedades' : 'emprendimientos'
                          coverSrc = `/api/${base}/${(item as any).id}/media/${chosen.mediaId}`
                        }
                      } else if (Array.isArray(raw) && raw.length > 0) {
                        coverSrc = raw[0]
                      }
                      return (
                        <Image
                          src={coverSrc}
                          alt={item.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, 100vw"
                          className="object-cover rounded-lg"
                        />
                      )
                    })()}
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-secondary text-secondary-foreground text-xs">
                        {item.type}
                      </Badge>
                    </div>
                    <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-semibold">
                      {item.price}
                    </div>
                    <div className="mt-2">
                      <h4 className="font-medium text-sm line-clamp-1">{item.title}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-1">{item.location}</p>
                    </div>
                  </div>
                ))}
              </div>
              {allFeatured.length > 3 && (
                <div className="mt-4 text-center">
                  <Badge variant="outline">+{allFeatured.length - 3} más en otros slides</Badge>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Propiedades Destacadas */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Propiedades Destacadas ({properties.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {properties.map((property) => (
                  <Card key={property.id} className="overflow-hidden">
                    <div className="relative h-32">
                      {(() => {
                        const raw: any = (property as any)?.images
                        let coverSrc = "/placeholder.svg"
                        if (raw && typeof raw === 'object' && Array.isArray(raw.items)) {
                          const items: any[] = raw.items as any[]
                          const main = items.find((it) => typeof it?.sortOrder === 'number' && it.sortOrder === 0)
                          const chosen = main ?? items[0]
                          if (chosen?.mediaId) {
                            coverSrc = `/api/propiedades/${property.id}/media/${chosen.mediaId}`
                          }
                        } else if (Array.isArray(raw) && raw.length > 0) {
                          coverSrc = raw[0]
                        }
                        return (
                          <Image
                            src={coverSrc}
                            alt={property.title}
                            fill
                            sizes="(min-width: 1024px) 33vw, 100vw"
                            className="object-cover"
                          />
                        )
                      })()}
                      <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-semibold">
                        {property.price}
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <h4 className="font-medium text-sm mb-1 line-clamp-1">{property.title}</h4>
                      <div className="flex items-center text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="text-xs line-clamp-1">{property.location}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                        <div className="flex items-center">
                          <Bed className="h-3 w-3 mr-1" />
                          <span>{property.bedrooms}</span>
                        </div>
                        <div className="flex items-center">
                          <Bath className="h-3 w-3 mr-1" />
                          <span>{property.bathrooms}</span>
                        </div>
                        <div className="flex items-center">
                          <Square className="h-3 w-3 mr-1" />
                          <span>{property.area}m²</span>
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleFeatured(property.id, "Propiedad")}
                        className="w-full"
                      >
                        <StarOff className="h-3 w-3 mr-1" />
                        Quitar Destacada
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Emprendimientos Destacados */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Emprendimientos Destacados ({projects.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <Card key={project.id} className="overflow-hidden">
                    <div className="relative h-32">
                      {(() => {
                        const raw: any = (project as any)?.images
                        let coverSrc = "/placeholder.svg"
                        if (raw && typeof raw === 'object' && Array.isArray(raw.items)) {
                          const items: any[] = raw.items as any[]
                          const main = items.find((it) => typeof it?.sortOrder === 'number' && it.sortOrder === 0)
                          const chosen = main ?? items[0]
                          if (chosen?.mediaId) {
                            coverSrc = `/api/emprendimientos/${project.id}/media/${chosen.mediaId}`
                          }
                        } else if (Array.isArray(raw) && raw.length > 0) {
                          coverSrc = raw[0]
                        }
                        return (
                          <Image
                            src={coverSrc}
                            alt={project.name}
                            fill
                            sizes="(min-width: 1024px) 33vw, 100vw"
                            className="object-cover"
                          />
                        )
                      })()}
                      <div className="absolute top-2 left-2">
                        <Badge
                          className={`${statusColors[project.status as keyof typeof statusColors]} text-white text-xs`}
                        >
                          {project.status}
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 rounded text-xs font-semibold">
                        Desde {project.price_from}
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <h4 className="font-medium text-sm mb-1 line-clamp-1">{project.name}</h4>
                      <div className="flex items-center text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span className="text-xs line-clamp-1">{project.location}</span>
                      </div>

                      {/* Progress */}
                      <div className="mb-2">
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-xs text-foreground">Progreso</span>
                          <span className="text-xs text-muted-foreground">{project.progress}%</span>
                        </div>
                        <Progress value={project.progress} className="h-1" />
                      </div>

                      {/* Stats */}
                      <div className="grid grid-cols-2 gap-2 mb-3 text-xs text-muted-foreground">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span className="truncate">{project.delivery_date}</span>
                        </div>
                        <div className="flex items-center">
                          <Building className="h-3 w-3 mr-1" />
                          <span>{project.total_units} unidades</span>
                        </div>
                        <div className="flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          <span>{project.available_units} disponibles</span>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleToggleFeatured(project.id, "Emprendimiento")}
                        className="w-full"
                      >
                        <StarOff className="h-3 w-3 mr-1" />
                        Quitar Destacado
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Instructions */}
          <Card className="mt-8">
            <CardContent className="p-6">
              <div className="text-center">
                <Star className="h-8 w-8 text-secondary mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">Cómo Gestionar Destacadas</h3>
                <div className="text-sm text-muted-foreground space-y-2 max-w-2xl mx-auto">
                  <p>• Para agregar más destacadas, ve a "Propiedades" o "Emprendimientos" y marca las que desees</p>
                  <p>• Las destacadas aparecen automáticamente en el carousel de la página principal</p>
                  <p>• Se muestran 3 elementos por slide, creando múltiples slides según la cantidad</p>
                  <p>• El carousel rota automáticamente cada 5 segundos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
