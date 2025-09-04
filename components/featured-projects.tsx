"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { MapPin, Calendar, Building, Users, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { configStore } from "@/lib/config-store"

const allFeaturedProjects = [
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
    amenities: ["Piscina", "Gimnasio", "SUM", "Cocheras"],
  },
  {
    id: 2,
    title: "Green Residences",
    location: "Palermo, Buenos Aires",
    description: "Desarrollo sustentable con tecnología verde y espacios comunitarios innovadores.",
    status: "En Venta",
    progress: 95,
    deliveryDate: "Marzo 2024",
    totalUnits: 80,
    availableUnits: 12,
    priceFrom: "USD 380.000",
    image: "/green-residential-complex.png",
    amenities: ["Jardín Vertical", "Coworking", "Bicicletas", "Terraza Verde"],
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
    amenities: ["Club House", "Muelle Privado", "Cancha de Tenis", "Parque"],
  },
  {
    id: 4,
    title: "Industrial Lofts",
    location: "San Telmo, Buenos Aires",
    description: "Conversión de edificio histórico en lofts modernos con diseño industrial.",
    status: "En Construcción",
    progress: 60,
    deliveryDate: "Agosto 2024",
    totalUnits: 35,
    availableUnits: 18,
    priceFrom: "USD 320.000",
    image: "/industrial-lofts-conversion.png",
    amenities: ["Terraza Común", "Estudio Arte", "Café", "Galería"],
  },
  {
    id: 5,
    title: "Twin Towers Belgrano",
    location: "Belgrano, Buenos Aires",
    description: "Torres gemelas con departamentos de lujo y amenities de hotel cinco estrellas.",
    status: "En Venta",
    progress: 90,
    deliveryDate: "Mayo 2024",
    totalUnits: 200,
    availableUnits: 35,
    priceFrom: "USD 520.000",
    image: "/twin-towers-belgrano.png",
    amenities: ["Spa", "Pileta Climatizada", "Concierge", "Sky Bar"],
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
    image: "/eco-village-sustainable-homes.png",
    amenities: ["Huerta Comunitaria", "Centro Wellness", "Senderos", "Laguna"],
  },
  {
    id: 7,
    title: "Urban Plaza",
    location: "Recoleta, Buenos Aires",
    description: "Complejo mixto con departamentos, oficinas y locales comerciales en zona premium.",
    status: "En Construcción",
    progress: 45,
    deliveryDate: "Diciembre 2024",
    totalUnits: 150,
    availableUnits: 85,
    priceFrom: "USD 480.000",
    image: "/luxury-towers-river-view.png",
    amenities: ["Shopping", "Oficinas", "Restaurantes", "Cine"],
  },
  {
    id: 8,
    title: "Riverside Gardens",
    location: "Vicente López, Buenos Aires",
    description: "Desarrollo residencial con amplios jardines y vista al río en zona norte.",
    status: "En Venta",
    progress: 85,
    deliveryDate: "Abril 2024",
    totalUnits: 90,
    availableUnits: 22,
    priceFrom: "USD 410.000",
    image: "/green-residential-complex.png",
    amenities: ["Jardines", "Quincho", "Playroom", "Seguridad 24hs"],
  },
  {
    id: 9,
    title: "Metropolitan Heights",
    location: "Microcentro, Buenos Aires",
    description: "Torre corporativa con departamentos ejecutivos en el corazón financiero.",
    status: "Próximamente",
    progress: 10,
    deliveryDate: "Septiembre 2025",
    totalUnits: 180,
    availableUnits: 180,
    priceFrom: "USD 350.000",
    image: "/twin-towers-belgrano.png",
    amenities: ["Business Center", "Gimnasio", "Lavandería", "Valet Parking"],
  },
]

const statusColors = {
  "En Construcción": "bg-yellow-500",
  "En Venta": "bg-green-500",
  Próximamente: "bg-blue-500",
}

export function FeaturedProjects() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [itemsPerSlide, setItemsPerSlide] = useState(1)
  const [config, setConfig] = useState(configStore.getConfig())

  const featuredProjects = allFeaturedProjects.slice(0, config.maxFeaturedProjects)
  const totalSlides = Math.ceil(featuredProjects.length / itemsPerSlide)

  useEffect(() => {
    const unsubscribe = configStore.subscribe(() => {
      setConfig(configStore.getConfig())
    })
    return unsubscribe
  }, [])

  useEffect(() => {
    const updateItemsPerSlide = () => {
      const currentConfig = configStore.getConfig()
      if (window.innerWidth >= 1024) {
        setItemsPerSlide(currentConfig.maxProjectsPerSlide)
      } else if (window.innerWidth >= 768) {
        setItemsPerSlide(2)
      } else {
        setItemsPerSlide(1)
      }
    }

    updateItemsPerSlide()
    window.addEventListener("resize", updateItemsPerSlide)
    return () => window.removeEventListener("resize", updateItemsPerSlide)
  }, [config])

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev >= totalSlides - 1 ? 0 : prev + 1))
  }, [totalSlides])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev <= 0 ? totalSlides - 1 : prev - 1))
  }, [totalSlides])

  useEffect(() => {
    if (!isAutoPlaying) return

    const interval = setInterval(nextSlide, 6000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide])

  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
  }

  return (
    <section
      className="py-20 bg-gradient-to-br from-background via-muted/20 to-background relative"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-accent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-primary rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Emprendimientos <span className="text-accent">Destacados</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Descubre nuestros proyectos más exclusivos con las mejores ubicaciones y amenities de primer nivel
          </p>
        </div>

        <div className="relative perspective-1000">
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm border border-border rounded-full p-3 hover:bg-accent hover:text-accent-foreground transition-all duration-300 shadow-lg"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm border border-border rounded-full p-3 hover:bg-accent hover:text-accent-foreground transition-all duration-300 shadow-lg"
          >
            <ChevronRight className="h-6 w-6" />
          </button>

          <div className="overflow-hidden rounded-2xl mx-12">
            <div
              className="flex transition-all duration-700 ease-out transform-gpu"
              style={{
                transform: `translateX(-${currentSlide * (100 / itemsPerSlide)}%) rotateY(${currentSlide * -1}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              {featuredProjects.map((project, index) => {
                const slideIndex = Math.floor(index / itemsPerSlide)
                const offset = slideIndex - currentSlide
                const isActive = slideIndex === currentSlide

                return (
                  <div
                    key={project.id}
                    className={`flex-shrink-0 px-2 ${
                      itemsPerSlide === 1 ? "w-full" : itemsPerSlide === 2 ? "w-1/2" : "w-1/3"
                    }`}
                    style={{
                      transform: `
                        translateZ(${isActive ? "0px" : "-50px"}) 
                        rotateY(${offset * 10}deg) 
                        scale(0.95)
                      `,
                      opacity: Math.abs(offset) > 1 ? 0.4 : 1,
                      transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <Card className="overflow-hidden bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-2xl transition-all duration-500 transform-gpu hover:scale-[1.02] h-full min-h-[600px]">
                      <div className={`grid gap-0 h-full ${itemsPerSlide === 1 ? "lg:grid-cols-2" : "grid-cols-1"}`}>
                        <div className="relative h-64 lg:h-96 overflow-hidden flex-shrink-0">
                          <img
                            src={project.image || "/placeholder.svg"}
                            alt={project.title}
                            className="w-full h-full object-cover hover:scale-110 transition-transform duration-700"
                          />

                          <div className="absolute top-6 left-6 flex gap-3">
                            <Badge className="bg-accent text-accent-foreground shadow-lg">Destacado</Badge>
                            <Badge
                              className={`${statusColors[project.status as keyof typeof statusColors]} text-white shadow-lg`}
                            >
                              {project.status}
                            </Badge>
                          </div>

                          <div className="absolute top-6 right-6 bg-primary/90 backdrop-blur-sm text-primary-foreground px-4 py-2 rounded-full font-bold shadow-lg">
                            Desde {project.priceFrom}
                          </div>

                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>

                        <CardContent className={`flex flex-col h-full ${itemsPerSlide === 1 ? "p-8 lg:p-10" : "p-6"}`}>
                          <div className="flex-1 flex flex-col">
                            <div className="mb-6">
                              <h3
                                className={`font-bold text-foreground mb-3 hover:text-accent transition-colors ${
                                  itemsPerSlide === 1 ? "text-2xl lg:text-3xl" : "text-xl"
                                }`}
                              >
                                {project.title}
                              </h3>
                              <div className="flex items-center text-muted-foreground mb-4">
                                <MapPin className="h-5 w-5 mr-2 text-accent" />
                                <span className="text-base">{project.location}</span>
                              </div>
                              <div className="h-16 overflow-hidden">
                                <p className="text-muted-foreground leading-relaxed text-base line-clamp-3">
                                  {project.description}
                                </p>
                              </div>
                            </div>

                            <div className="mb-6">
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-semibold text-foreground">Progreso de Obra</span>
                                <span className="text-sm text-accent font-bold">{project.progress}%</span>
                              </div>
                              <Progress value={project.progress} className="h-3 bg-muted" />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 mr-2 text-accent" />
                                <span>{project.deliveryDate}</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Building className="h-4 w-4 mr-2 text-accent" />
                                <span>{project.totalUnits} unidades</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground col-span-2">
                                <Users className="h-4 w-4 mr-2 text-accent" />
                                <span>{project.availableUnits} unidades disponibles</span>
                              </div>
                            </div>

                            <div className="mb-8 flex-1">
                              <h4 className="text-sm font-semibold text-foreground mb-3">Amenities Principales</h4>
                              <div className="flex flex-wrap gap-2">
                                {project.amenities.slice(0, 4).map((amenity, amenityIndex) => (
                                  <Badge
                                    key={amenityIndex}
                                    variant="secondary"
                                    className="text-xs bg-muted hover:bg-accent hover:text-accent-foreground transition-colors"
                                  >
                                    {amenity}
                                  </Badge>
                                ))}
                                {project.amenities.length > 4 && (
                                  <Badge variant="secondary" className="text-xs bg-muted">
                                    +{project.amenities.length - 4} más
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-4 mt-auto">
                            <Button
                              asChild
                              className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold"
                            >
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
                      </div>
                    </Card>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="flex justify-center mt-8 gap-3">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-accent scale-125 shadow-lg"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                }`}
              />
            ))}
          </div>

          {isAutoPlaying && (
            <div className="mt-6">
              <div className="w-full bg-muted-foreground/20 rounded-full h-1">
                <div
                  className="bg-accent h-1 rounded-full transition-all duration-300"
                  style={{ width: `${((currentSlide + 1) / totalSlides) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-16">
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link href="/emprendimientos">Ver Todos los Emprendimientos</Link>
          </Button>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  )
}
