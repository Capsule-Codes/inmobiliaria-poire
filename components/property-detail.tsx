"use client"

import type React from "react"
import { type Property } from "@/types/Property"
import { normalizeImages } from "@/lib/media"
import { useState, useEffect, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
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
} from "lucide-react"

interface PropertyDetailProps {
  property: Property
}

export function PropertyDetail({ property }: PropertyDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  const normalizedImages = useMemo(() => normalizeImages('propiedades', property.id, property.images), [property])
  
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  })

  useEffect(() => {
    const raw: any = (property as any)?.images
    if (raw && typeof raw === 'object' && Array.isArray(raw.items)) {
      const coverId: string | null = raw.coverId ?? null
      if (coverId) {
        const idx = normalizedImages.findIndex((img) => img.key === coverId)
        setCurrentImageIndex(idx >= 0 ? idx : 0)
      } else {
        setCurrentImageIndex(0)
      }
    } else {
      setCurrentImageIndex(0)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        prevImage()
      } else if (e.key === "ArrowRight") {
        nextImage()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [property.id])

  const nextImage = () => {
    if (normalizedImages.length > 0) {
      setCurrentImageIndex((prev) => {
        const newIndex = (prev + 1) % normalizedImages.length
        return newIndex
      })
    }
  }

  const prevImage = () => {
    if (normalizedImages.length > 0) {
      setCurrentImageIndex((prev) => {
        const newIndex = (prev - 1 + normalizedImages.length) % normalizedImages.length
        return newIndex
      })
    }
  }

  const selectImage = (index: number) => {
    setCurrentImageIndex(index)
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Contact form submitted:", contactForm)
    // Here you would handle the form submission
  }

  if (!normalizedImages || normalizedImages.length === 0) {
    console.log("[v0] No images available for property:", property.id)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Images and Details */}
        <div className="lg:col-span-2 space-y-8">
          {/* Image Gallery */}
          <div className="relative">
            <div className="relative h-96 md:h-[500px] rounded-lg overflow-hidden bg-muted">
              {normalizedImages && normalizedImages.length > 0 ? (
                <Image
                  src={normalizedImages[currentImageIndex]?.src || "/placeholder.svg"}
                  alt={normalizedImages[currentImageIndex]?.alt || `${property.title} - Imagen ${currentImageIndex + 1}`}
                  fill
                  sizes="100vw"
                  className="object-cover transition-opacity duration-300"
                  onError={() => console.error("[v0] Image failed to load:", normalizedImages[currentImageIndex]?.src)}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                  <span>No hay imágenes disponibles</span>
                </div>
              )}

              {/* Navigation Arrows - Only show if there are multiple images */}
              {normalizedImages && normalizedImages.length > 1 && (
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
              {normalizedImages && normalizedImages.length > 1 && (
                <div className="absolute bottom-4 right-4 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                  {currentImageIndex + 1} / {normalizedImages.length}
                </div>
              )}
            </div>

            {/* Thumbnail Navigation - Only show if there are multiple images */}
            {normalizedImages && normalizedImages.length > 1 && (
              <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                {normalizedImages.map((image, index) => (
                  <button
                    key={image.key || index}
                    onClick={() => selectImage(index)}
                    className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 hover:scale-105 ${index === currentImageIndex
                      ? "border-accent shadow-lg"
                      : "border-transparent hover:border-accent/50"
                      }`}
                    aria-label={`Ver imagen ${index + 1}`}
                  >
                    <Image
                      src={image.src || "/placeholder.svg"}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                      onError={() => console.error("[v0] Thumbnail failed to load:", image.src)}
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Property Information */}
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-foreground mb-2">{property.title}</h1>
                  <div className="flex items-center text-muted-foreground mb-2">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{property.location}</span>
                  </div>
                  <Badge variant="outline" className="text-sm">
                    {property.type}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-accent mb-2">{property.price}</div>
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

              {/* Property Stats */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <Bed className="h-6 w-6 mx-auto mb-3 text-accent" />
                  <div className="font-semibold">{property.bedrooms}</div>
                  <div className="text-sm text-muted-foreground">Dormitorios</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <Bath className="h-6 w-6 mx-auto mb-3 text-accent" />
                  <div className="font-semibold">{property.bathrooms}</div>
                  <div className="text-sm text-muted-foreground">Baños</div>
                </div>
                <div className="text-center p-4 bg-muted/30 rounded-lg">
                  <Square className="h-6 w-6 mx-auto mb-3 text-accent" />
                  <div className="font-semibold">{property.area}m²</div>
                  <div className="text-sm text-muted-foreground">Superficie</div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Descripción</h3>
                <p className="text-muted-foreground leading-relaxed">{property.description}</p>
              </div>

              {/* Features */}
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-3">Características</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {property.features.map((feature, index) => (
                    <div key={index} className="flex items-center text-sm">
                      <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="text-xl font-semibold mb-3">Amenities</h3>
                <div className="flex flex-wrap gap-2">
                  {property.features.map((feature, index) => (
                    <Badge key={index} variant="secondary">
                      {feature}
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
              <h3 className="text-xl font-semibold mb-4">Contactar por esta propiedad</h3>

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
