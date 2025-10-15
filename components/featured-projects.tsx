"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  MapPin,
  Calendar,
  Building,
  Users,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getCoverSrc } from "@/lib/media";
import { useConfig } from "@/contexts/config-context";
import { type Project } from "@/types/project";

const statusColors = {
  "En Construcción": "bg-yellow-500",
  "En Venta": "bg-green-500",
  Próximamente: "bg-blue-500",
};

export function FeaturedProjects({
  allFeaturedProjects,
}: {
  allFeaturedProjects: Project[];
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [itemsPerSlide, setItemsPerSlide] = useState(1);
  const { config } = useConfig();

  const featuredProjects = allFeaturedProjects.slice(
    0,
    config.maxFeaturedProjects
  );
  const totalSlides = Math.ceil(featuredProjects.length / itemsPerSlide);

  useEffect(() => {
    const updateItemsPerSlide = () => {
      if (window.innerWidth >= 1024) {
        setItemsPerSlide(config.maxProjectsPerSlide);
      } else if (window.innerWidth >= 768) {
        setItemsPerSlide(2);
      } else {
        setItemsPerSlide(1);
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

    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  return (
    <section
      className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-background via-muted/20 to-background relative"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-32 h-32 bg-accent rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-48 h-48 bg-primary rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 relative">
        <div className="text-center mb-8 sm:mb-12 lg:mb-16">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3 sm:mb-6">
            Emprendimientos <span className="text-accent">Destacados</span>
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed px-2">
            Descubre nuestros proyectos más exclusivos con las mejores
            ubicaciones y amenities de primer nivel
          </p>
        </div>

        <div className="relative perspective-1000">
          <button
            onClick={prevSlide}
            className="absolute left-1 sm:left-2 lg:left-4 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm border border-border rounded-full p-2 sm:p-3 hover:bg-accent hover:text-accent-foreground transition-all duration-300 shadow-lg"
          >
            <ChevronLeft className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-1 sm:right-2 lg:right-4 top-1/2 -translate-y-1/2 z-20 bg-background/90 backdrop-blur-sm border border-border rounded-full p-2 sm:p-3 hover:bg-accent hover:text-accent-foreground transition-all duration-300 shadow-lg"
          >
            <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
          </button>

          <div className="overflow-hidden rounded-xl sm:rounded-2xl mx-8 sm:mx-10 lg:mx-12">
            <div
              className="flex transition-transform duration-700 ease-out transform-gpu"
              style={{
                transform: `translateX(-${
                  currentSlide * (100 / itemsPerSlide)
                }%)`,
              }}
            >
              {featuredProjects.map((project, index) => {
                const slideIndex = Math.floor(index / itemsPerSlide);
                const offset = slideIndex - currentSlide;
                const isActive = slideIndex === currentSlide;

                return (
                  <div
                    key={project.id}
                    className={`flex-shrink-0 px-2 ${
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
                    <Card className="overflow-hidden bg-card/80 backdrop-blur-sm border-border/50 hover:shadow-2xl transition-all duration-500 transform-gpu hover:scale-[1.02] h-full min-h-[600px]">
                      <div
                        className={`grid gap-0 h-full ${
                          itemsPerSlide === 1 ? "lg:grid-cols-2" : "grid-cols-1"
                        }`}
                      >
                        <div className="relative h-64 lg:h-96 overflow-hidden flex-shrink-0">
                          {(() => {
                            const coverSrc = getCoverSrc(
                              "emprendimientos",
                              project.id,
                              project.images
                            );
                            return (
                              <Image
                                src={coverSrc}
                                alt={project.name}
                                fill
                                sizes="(min-width: 1024px) 33vw, 100vw"
                                className="object-cover hover:scale-110 transition-transform duration-700"
                              />
                            );
                          })()}

                          <div className="absolute top-6 left-6 flex gap-3">
                            <Badge className="bg-accent text-accent-foreground shadow-lg">
                              Destacado
                            </Badge>
                            <Badge
                              className={`${
                                statusColors[
                                  project.status as keyof typeof statusColors
                                ]
                              } text-white shadow-lg`}
                            >
                              {project.status}
                            </Badge>
                          </div>
                          {/* Price badge: mobile = full-width ribbon; md+ = centered pill */}
                          <div
                            className="absolute inset-x-0 bottom-0 z-10 bg-primary/90 backdrop-blur-sm text-primary-foreground text-center px-3 py-1.5 text-sm font-semibold shadow-lg
                                       md:inset-x-auto md:left-1/2 md:-translate-x-1/2 md:bottom-4 md:w-auto md:px-4 md:py-2 md:rounded-full md:text-base"
                          >
                            Desde ${project.price_from}
                          </div>

                          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>

                        <CardContent
                          className={`flex flex-col h-full ${
                            itemsPerSlide === 1 ? "p-8 lg:p-10" : "p-6"
                          }`}
                        >
                          <div className="flex-1 flex flex-col">
                            <div className="mb-6">
                              <h3
                                className={`font-bold text-foreground mb-3 hover:text-accent transition-colors ${
                                  itemsPerSlide === 1
                                    ? "text-2xl lg:text-3xl"
                                    : "text-xl"
                                }`}
                              >
                                {project.name}
                              </h3>
                              <div className="flex items-center text-muted-foreground mb-4">
                                <MapPin className="h-5 w-5 mr-2 text-accent" />
                                <span className="text-base">
                                  {project.location}
                                </span>
                              </div>
                              <div className="h-16 overflow-hidden">
                                <p className="text-muted-foreground leading-relaxed text-base line-clamp-3">
                                  {project.description}
                                </p>
                              </div>
                            </div>

                            <div className="mb-6">
                              <div className="flex justify-between items-center mb-3">
                                <span className="text-sm font-semibold text-foreground">
                                  Progreso de Obra
                                </span>
                                <span className="text-sm text-accent font-bold">
                                  {project.progress}%
                                </span>
                              </div>
                              <Progress
                                value={project.progress}
                                className="h-3 bg-muted"
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4 mb-6">
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4 mr-2 text-accent" />
                                <span>{project.delivery_date}</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground">
                                <Building className="h-4 w-4 mr-2 text-accent" />
                                <span>{project.total_units} unidades</span>
                              </div>
                              <div className="flex items-center text-sm text-muted-foreground col-span-2">
                                <Users className="h-4 w-4 mr-2 text-accent" />
                                <span>
                                  {project.available_units} unidades disponibles
                                </span>
                              </div>
                            </div>

                            <div className="mb-8 flex-1">
                              <h4 className="text-sm font-semibold text-foreground mb-3">
                                Amenities Principales
                              </h4>
                              <div className="flex flex-wrap gap-2">
                                {project.amenities
                                  .slice(0, 4)
                                  .map((amenity, amenityIndex) => (
                                    <Badge
                                      key={amenityIndex}
                                      variant="secondary"
                                      className="text-xs bg-muted hover:bg-accent hover:text-accent-foreground transition-colors"
                                    >
                                      {amenity}
                                    </Badge>
                                  ))}
                                {project.amenities.length > 4 && (
                                  <Badge
                                    variant="secondary"
                                    className="text-xs bg-muted"
                                  >
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
                              <Link href={`/emprendimientos/${project.id}`}>
                                Ver Proyecto
                              </Link>
                            </Button>
                            <Button
                              asChild
                              variant="outline"
                              className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
                            >
                              <Link
                                href={`/contacto/emprendimiento/${project.id}`}
                              >
                                Consultar
                              </Link>
                            </Button>
                          </div>
                        </CardContent>
                      </div>
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
                  style={{
                    width: `${((currentSlide + 1) / totalSlides) * 100}%`,
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
            <Link href="/emprendimientos">Ver Todos los Emprendimientos</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
