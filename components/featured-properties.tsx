"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Bed,
  Bath,
  Square,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getCoverSrc } from "@/lib/media";
import { useState, useEffect, useCallback } from "react";
import { useConfig } from "@/contexts/config-context";
import { Property } from "@/types/Property";

export function FeaturedProperties({
  allFeaturedProperties,
}: {
  allFeaturedProperties: Property[];
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [itemsPerSlide, setItemsPerSlide] = useState(1);
  const { config } = useConfig();

  const featuredProperties = allFeaturedProperties.slice(
    0,
    config.maxFeaturedProperties
  );
  const totalSlides = Math.ceil(featuredProperties.length / itemsPerSlide);

  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerSlide(config.maxPropertiesPerSlide); // Desktop: configurable
      } else if (window.innerWidth >= 768) {
        setItemsPerSlide(2); // Tablet: 2 items
      } else {
        setItemsPerSlide(1); // Mobile: 1 item
      }
    };

    updateItemsPerSlide();
    window.addEventListener("resize", updateItemsPerSlide);
    return () => window.removeEventListener("resize", updateItemsPerSlide);
  }, [config]);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev >= totalSlides - 1 ? 0 : prev + 1));
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev <= 0 ? totalSlides - 1 : prev - 1));
  }, [totalSlides]);

  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  if (featuredProperties.length === 0) {
    return null;
  }

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-muted/30 relative">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-6">
            Propiedades <span className="text-accent">Destacadas</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-2xl mx-auto px-2">
            Selección exclusiva de nuestras mejores propiedades disponibles
          </p>
        </div>

        <div
          className="relative perspective-1000"
          onMouseEnter={() => setIsAutoPlaying(false)}
          onMouseLeave={() => setIsAutoPlaying(true)}
        >
          <button
            type="button"
            onClick={prevSlide}
            className="absolute left-1 sm:left-2 lg:left-4 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm border border-border rounded-full p-2 sm:p-3 hover:bg-accent hover:text-accent-foreground transition-all duration-300 shadow-lg"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
          </button>

          <button
            type="button"
            onClick={nextSlide}
            className="absolute right-1 sm:right-2 lg:right-4 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm border border-border rounded-full p-2 sm:p-3 hover:bg-accent hover:text-accent-foreground transition-all duration-300 shadow-lg"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
          </button>

          <div className="overflow-hidden mx-8 sm:mx-10 lg:mx-12 rounded-xl sm:rounded-2xl">
            <div
              className="flex transition-transform duration-700 ease-out transform-gpu"
              style={{
                transform: `translateX(-${
                  currentSlide * (100 / itemsPerSlide)
                }%)`,
              }}
            >
              {featuredProperties.map((property, index) => {
                const slideIndex = Math.floor(index / itemsPerSlide);
                const offset = slideIndex - currentSlide;
                const isActive = slideIndex === currentSlide;
                const coverSrc = getCoverSrc(
                  "propiedades",
                  property.id,
                  property.images
                );

                return (
                  <div
                    key={property.id}
                    className={`flex-shrink-0 px-1 sm:px-2 ${
                      itemsPerSlide === 1
                        ? "w-full"
                        : itemsPerSlide === 2
                        ? "w-1/2"
                        : "w-1/3"
                    }`}
                    style={{
                      transform: `scale(${isActive ? 1 : 0.98})`,
                      opacity: 1,
                      transition: "transform 0.7s cubic-bezier(0.4, 0, 0.2, 1)",
                    }}
                  >
                    <Card className="overflow-hidden hover:shadow-2xl transition-all duration-500 transform-gpu hover:scale-105 bg-card/80 backdrop-blur-sm">
                      <div className="relative h-48 sm:h-56 lg:h-64">
                        <Image
                          src={coverSrc}
                          alt={property.title}
                          fill
                          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                          className="object-cover transition-transform duration-700 hover:scale-110"
                        />
                        <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-accent text-accent-foreground px-2 py-1 sm:px-3 sm:py-1 rounded-full font-semibold shadow-lg text-xs sm:text-sm">
                          ${property.price}
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                      </div>

                      <CardContent className="p-3 sm:p-4 lg:p-6">
                        <div className="h-[70px] sm:h-[80px] lg:h-[95px]">
                          <h3 className="text-lg sm:text-xl font-semibold text-foreground mb-1 sm:mb-2 line-clamp-2">
                            {property.title}
                          </h3>
                        </div>

                        <div className="flex items-center text-muted-foreground mb-3 sm:mb-4">
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-accent" />
                          <span className="text-xs sm:text-sm line-clamp-1">
                            {property.location}
                          </span>
                        </div>

                        <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                          <div className="flex items-center">
                            <Bed className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-accent" />
                            <span>{property.bedrooms}</span>
                          </div>
                          <div className="flex items-center">
                            <Bath className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-accent" />
                            <span>{property.bathrooms}</span>
                          </div>
                          <div className="flex items-center">
                            <Square className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-accent" />
                            <span>{property.area}m²</span>
                          </div>
                        </div>

                        <Button
                          asChild
                          className="w-full bg-primary hover:bg-primary/90 text-sm sm:text-base py-2 sm:py-3"
                        >
                          <Link href={`/propiedades/${property.id}`}>
                            Ver Detalles
                          </Link>
                        </Button>
                      </CardContent>
                    </Card>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-center mt-8 gap-3">
            {Array.from({ length: totalSlides }).map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide
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
    </section>
  );
}
