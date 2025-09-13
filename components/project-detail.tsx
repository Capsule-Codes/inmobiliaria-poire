"use client"

import type React from "react"
import { type Project } from "@/types/project"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import {
  MapPin,
  Bed,
  Bath,
  Square,
  Heart,
  Share2,
  ChevronLeft,
  ChevronRight,
  Phone,
  Mail,
  MessageCircle,
  Calendar,
  Building,
  Users,
} from "lucide-react"
import { Progress } from "./ui/progress"

interface ProjectDetailProps {
  project: Project
}

export function ProjectDetail({ project }: ProjectDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  useEffect(() => {
    setCurrentImageIndex(0)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevImage()
      } else if (e.key === "ArrowRight") {
        nextImage()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [project.id])

  const nextImage = () => {
    if (project.images.length > 0) {
      setCurrentImageIndex((prev) => {
        const newIndex = (prev + 1) % project.images.length
        console.log("[v0] Next image:", newIndex, "of", project.images.length)
        return newIndex
      })
    }
  }

  const prevImage = () => {
    if (project.images.length > 0) {
      setCurrentImageIndex((prev) => {
        const newIndex = (prev - 1 + project.images.length) % project.images.length
        console.log("[v0] Previous image:", newIndex, "of", project.images.length)
        return newIndex
      })
    }
  }

  const selectImage = (index: number) => {
    console.log("[v0] Selecting image:", index)
    setCurrentImageIndex(index)
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Contact form submitted:", contactForm)
    // Here you would handle the form submission
  }

  if (!project.images || project.images.length === 0) {
    console.log("[v0] No images available for project:", project.id)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images and Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <div className="relative">
            <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden bg-muted">
              {project.images && project.images.length > 0 ? (
                <img
                  src={project.images[currentImageIndex] || "/placeholder.svg"}
                  alt={`${project.name} - Imagen ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover transition-opacity duration-300"
                  onLoad={() => console.log("[v0] Image loaded:", currentImageIndex)}
                  onError={() => console.log("[v0] Image failed to load:", project.images[currentImageIndex])}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <span>No hay imágenes disponibles</span>
                </div>
              )}

              {/* Navigation Arrows - Only show if there are multiple images */}
              {project.images && project.images.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 hover:scale-110"
                    aria-label="Imagen anterior"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-all duration-200 hover:scale-110"
                    aria-label="Imagen siguiente"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}

              {/* Image Counter */}
              {project.images && project.images.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {project.images.length}
                </div>
              )}
            </div>

            {/* Thumbnail Navigation - Only show if there are multiple images */}
            {project.images && project.images.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {project.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => selectImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${index === currentImageIndex
                      ? "border-accent shadow-lg"
                      : "border-transparent hover:border-accent/50"
                      }`}
                    aria-label={`Ver imagen ${index + 1}`}
                  >
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                      onError={() => console.log("[v0] Thumbnail failed to load:", image)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* project Information */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{project.name}</h1>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{project.location}</span>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {project.status}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-accent mb-2">Desde {project.price_from}</div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Heart className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Descripción</h3>
                <p className="text-muted-foreground leading-relaxed">{project.description}</p>
              </div>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-medium text-foreground">Progreso</span>
                  <span className="text-xs text-muted-foreground">{project.progress}%</span>
                </div>
                <Progress value={project.progress} className="h-1.5" />
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-2 mb-6 text-xs text-muted-foreground">
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

              {/* Amenities */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {project.amenities.map((amenity, index) => (
                    <Badge key={index} variant="secondary">
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Contact Form */}
        <div className="space-y-6">
          <Card className="sticky top-8">
            <CardContent className="p-6">
              <h3 className="text-xl font-semibold mb-4">Contactar por este emprendimiento</h3>

              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Nombre completo"
                    value={contactForm.name}
                    onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Input
                    type="tel"
                    placeholder="Teléfono"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Mensaje (opcional)"
                    value={contactForm.message}
                    onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                    rows={4}
                  />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  Enviar Consulta
                </Button>
              </form>

              <Separator className="my-6" />

              {/* Quick Contact Options */}
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Phone className="h-4 w-4 mr-2" />
                  Llamar Ahora
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  WhatsApp
                </Button>
                <Button variant="outline" className="w-full justify-start bg-transparent">
                  <Mail className="h-4 w-4 mr-2" />
                  Email
                </Button>
              </div>

              <Separator className="my-6" />

              {/* Agent Info */}
              <div className="text-center">
                <div className="w-16 h-16 bg-accent rounded-full mx-auto mb-3 flex items-center justify-center">
                  <span className="text-accent-foreground font-bold text-lg">AG</span>
                </div>
                <h4 className="font-semibold">Agente Inmobiliario</h4>
                <p className="text-sm text-muted-foreground">Especialista en propiedades premium</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
