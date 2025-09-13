"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Bed, Bath, Square, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useState, useEffect, useCallback } from "react"
import { configStore } from "@/lib/config-store"
import { Property } from "@/types/property"

export function FeaturedProperties({ allFeaturedProperties }: { allFeaturedProperties: Property[] }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [itemsPerSlide, setItemsPerSlide] = useState(1)
  const [config, setConfig] = useState(configStore.getConfig())

  const featuredProperties = allFeaturedProperties.slice(0, config.maxFeaturedProperties)
  const totalSlides = Math.ceil(featuredProperties.length / itemsPerSlide)

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
        setItemsPerSlide(currentConfig.maxPropertiesPerSlide) // Desktop: configurable
      } else if (window.innerWidth >= 768) {
        setItemsPerSlide(2) // Tablet: 2 items
      } else {
        setItemsPerSlide(1) // Mobile: 1 item
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

    const interval = setInterval(nextSlide, 5000)
    return () => clearInterval(interval)
  }, [isAutoPlaying, nextSlide])

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex)
  }

  if (featuredProperties.length === 0) {
    return null
  }

  return (
    <section className="py-20 bg-muted/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Propiedades <span className="text-accent">Destacadas</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Selección exclusiva de nuestras mejores propiedades disponibles
          </p>
        </div>

        <div
          className="relative perspective-1000"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm border-accent hover:bg-accent hover:text-accent-foreground shadow-lg"
            onClick={prevSlide}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm border-accent hover:bg-accent hover:text-accent-foreground shadow-lg"
            onClick={nextSlide}
          >
            <ChevronRight className="h-5 w-5" />
          </Button>

          <div className="overflow-hidden mx-12 rounded-2xl">
            <div
              className="flex transition-all duration-700 ease-out transform-gpu"
              style={{
                transform: `translateX(-${currentSlide * (100 / itemsPerSlide)}%) rotateY(${currentSlide * -2}deg)`,
                transformStyle: "preserve-3d",
              }}
            >
              {featuredProperties.map((property, index) => {
                const slideIndex = Math.floor(index / itemsPerSlide)
                const offset = slideIndex - currentSlide
                const isActive = slideIndex === currentSlide

                return (
                  <div
                    key={property.id}
                    className={`flex-shrink-0 px-2 ${itemsPerSlide === 1 ? "w-full" : itemsPerSlide === 2 ? "w-1/2" : "w-1/3"
                      }`}
                    style={{
                      transform: `
                        translateZ(${isActive ? "0px" : "-50px"}) 
                        rotateY(${offset * 10}deg) 
                        scale(0.95)
                      `,
                      opacity: Math.abs(offset) > 1 && totalSlides > 1 ? 0.6 : 1,
                      transition: "all 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 transform-gpu hover:scale-105 bg-card/80 backdrop-blur-sm">
                      <div className="relative">
                        <img
                          src={property.images ? property.images[0] : "/placeholder.svg"}
                          alt={property.title}
                          className="w-full h-64 object-cover transition-transform duration-700 hover:scale-110"
                        />
                        <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full font-semibold shadow-lg">
                          {property.price}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>

                      <CardContent className="p-6">
                        <div className="h-[95px]">
                          <h3 className="text-xl font-semibold text-foreground mb-2">{property.title}</h3>
                        </div>

                        <div className="flex items-center text-muted-foreground mb-4">
                          <MapPin className="h-4 w-4 mr-1 text-accent" />
                          <span className="text-sm">{property.location}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                          <div className="flex items-center">
                            <Bed className="h-4 w-4 mr-1 text-accent" />
                            <span>{property.bedrooms}</span>
                          </div>
                          <div className="flex items-center">
                            <Bath className="h-4 w-4 mr-1 text-accent" />
                            <span>{property.bathrooms}</span>
                          </div>
                          <div className="flex items-center">
                            <Square className="h-4 w-4 mr-1 text-accent" />
                            <span>{property.area}m²</span>
                          </div>
                        </div>

                        <Button asChild className="w-full bg-primary hover:bg-primary/90">
                          <Link href={`/propiedades/${property.id}`}>Ver Detalles</Link>
                        </Button>
                      </CardContent>
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
                className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentSlide
                  ? "bg-accent scale-125 shadow-lg"
                  : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>

          {isAutoPlaying && (
            <div className="mt-6">
              <div className="w-full bg-muted-foreground/20 rounded-full h-1 overflow-hidden">
                <div
                  className="h-full bg-accent transition-all duration-100 ease-linear rounded-full"
                  style={{
                    width: "100%",
                    animation: "progress 5s linear infinite",
                  }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="text-center mt-16">
          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Link href="/propiedades">Ver Todas las Propiedades</Link>
          </Button>
        </div>
      </div>

      <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
      `}</style>
    </section>
  )
}
