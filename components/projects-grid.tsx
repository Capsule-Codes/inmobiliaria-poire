"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapPin, Calendar, Building, Users } from "lucide-react"
import Link from "next/link"

const projects = [
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
    image: "/luxury-villa-pool-garden.png",
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
    image: "/luxury-modern-living-room.png",
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
    image: "/luxury-penthouse-interior.png",
    amenities: ["Club House", "Muelle Privado", "Cancha de Tenis", "Parque"],
    featured: true,
  },
  {
    id: 4,
    title: "Lofts Industriales San Telmo",
    location: "San Telmo, Buenos Aires",
    description: "Conversión de edificio histórico en modernos lofts con diseño industrial contemporáneo.",
    status: "En Construcción",
    progress: 45,
    deliveryDate: "Marzo 2025",
    totalUnits: 32,
    availableUnits: 18,
    priceFrom: "USD 320.000",
    image: "/luxury-penthouse-interior.png",
    amenities: ["Terraza Común", "Estudio de Arte", "Café", "Galería"],
    featured: false,
  },
  {
    id: 5,
    title: "Complejo Belgrano Heights",
    location: "Belgrano, Buenos Aires",
    description: "Torres gemelas con departamentos de 1, 2 y 3 ambientes en el corazón de Belgrano.",
    status: "En Venta",
    progress: 90,
    deliveryDate: "Agosto 2024",
    totalUnits: 200,
    availableUnits: 35,
    priceFrom: "USD 280.000",
    image: "/luxury-penthouse-interior.png",
    amenities: ["Piscina", "Gimnasio", "Playground", "Lavadero"],
    featured: false,
  },
  {
    id: 6,
    title: "Eco Village Tigre",
    location: "Tigre, Buenos Aires",
    description: "Comunidad sustentable con casas ecológicas y energías renovables en entorno natural.",
    status: "Próximamente",
    progress: 5,
    deliveryDate: "Octubre 2025",
    totalUnits: 60,
    availableUnits: 60,
    priceFrom: "USD 420.000",
    image: "/modern-house-exterior.png",
    amenities: ["Huerta Comunitaria", "Centro Wellness", "Senderos", "Laguna"],
    featured: true,
  },
]

const statusColors = {
  "En Construcción": "bg-yellow-500",
  "En Venta": "bg-green-500",
  Próximamente: "bg-blue-500",
}

export function ProjectsGrid() {
  const [filter, setFilter] = useState<string>("all")

  const filteredProjects = filter === "all" ? projects : projects.filter((project) => project.status === filter)

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Filter Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className="bg-primary hover:bg-primary/90"
          >
            Todos los Proyectos
          </Button>
          <Button
            variant={filter === "En Venta" ? "default" : "outline"}
            onClick={() => setFilter("En Venta")}
            className="bg-primary hover:bg-primary/90"
          >
            En Venta
          </Button>
          <Button
            variant={filter === "En Construcción" ? "default" : "outline"}
            onClick={() => setFilter("En Construcción")}
            className="bg-primary hover:bg-primary/90"
          >
            En Construcción
          </Button>
          <Button
            variant={filter === "Próximamente" ? "default" : "outline"}
            onClick={() => setFilter("Próximamente")}
            className="bg-primary hover:bg-primary/90"
          >
            Próximamente
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredProjects.map((project) => (
            <Card key={project.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 group">
              <div className="relative">
                <img
                  src={project.image || "/placeholder.svg"}
                  alt={project.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Status and Featured badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  {project.featured && <Badge className="bg-accent text-accent-foreground">Destacado</Badge>}
                  <Badge className={`${statusColors[project.status as keyof typeof statusColors]} text-white`}>
                    {project.status}
                  </Badge>
                </div>

                {/* Price badge */}
                <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-4 py-2 rounded-full font-semibold">
                  Desde {project.priceFrom}
                </div>
              </div>

              <CardContent className="p-6">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                    {project.title}
                  </h3>
                  <div className="flex items-center text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">{project.location}</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed">{project.description}</p>
                </div>

                {/* Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-foreground">Progreso de Obra</span>
                    <span className="text-sm text-muted-foreground">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                </div>

                {/* Project Stats */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{project.deliveryDate}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Building className="h-4 w-4 mr-2" />
                    <span>{project.totalUnits} unidades</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Users className="h-4 w-4 mr-2" />
                    <span>{project.availableUnits} disponibles</span>
                  </div>
                </div>

                {/* Amenities */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-foreground mb-2">Amenities</h4>
                  <div className="flex flex-wrap gap-2">
                    {project.amenities.slice(0, 4).map((amenity, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {project.amenities.length > 4 && (
                      <Badge variant="secondary" className="text-xs">
                        +{project.amenities.length - 4} más
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button asChild className="flex-1 bg-primary hover:bg-primary/90">
                    <Link href={`/emprendimientos/${project.id}`}>Ver Proyecto</Link>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
                  >
                    Consultar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-16">
          <div className="bg-muted/30 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-foreground mb-4">¿Buscas algo específico?</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Nuestro equipo de especialistas puede ayudarte a encontrar el emprendimiento perfecto para tu inversión.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8"
            >
              <Link href="/contacto">Contactar Especialista</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
