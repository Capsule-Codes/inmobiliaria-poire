"use client"

import { useSearchPropertyContext } from "@/contexts/search-property-context"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Bath, Square, Heart, Eye } from "lucide-react"
import Link from "next/link"

export function PropertyGrid() {
  const { properties, currentPage, totalPages, setCurrentPage, currentProperties, isLoading } = useSearchPropertyContext()

  return (
    <div>
      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          Mostrando {currentProperties.startIndex + 1}-{Math.min(currentProperties.startIndex + currentProperties.perPage, properties.length)} de{" "}
          {properties.length} propiedades
        </p>
      </div>

      {/* Properties Grid */}
      {isLoading ? (
        <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <Skeleton className="w-full h-64" />
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-2 h-[4rem]">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-5 w-16" />
                </div>
                <div className="flex items-center text-muted-foreground mb-4">
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
                  <Skeleton className="h-4 w-10" />
                  <Skeleton className="h-4 w-10" />
                  <Skeleton className="h-4 w-10" />
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {currentProperties.data.map((property) => (
          <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
            <div className="relative">
              <img
                src={property.images[0] || "/placeholder.svg"}
                alt={property.title}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Property badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {property.is_featured && <Badge className="bg-accent text-accent-foreground">Destacada</Badge>}
                <Badge variant="secondary">{property.status}</Badge>
              </div>

              {/* Price badge */}
              <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full font-semibold">
                {property.price}
              </div>

              {/* Action buttons */}
              <div className="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                  <Heart className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-2 h-[4rem]">
                <h3 className="text-xl font-semibold text-foreground group-hover:text-accent transition-colors">
                  {property.title}
                </h3>
                <Badge variant="outline" className="text-xs">
                  {property.type}
                </Badge>
              </div>

              <div className="flex items-center text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                <span className="text-sm">{property.location}</span>
              </div>

              <div className="flex items-center justify-between text-sm text-muted-foreground mb-6">
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
                <Button asChild className="flex-1 bg-primary hover:bg-primary/90">
                  <Link href={`/propiedades/${property.id}`}>Ver Detalles</Link>
                </Button>
                <Button
                  variant="outline"
                  className="border-accent text-accent hover:bg-accent hover:text-accent-foreground bg-transparent"
                >
                  Contactar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </Button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              onClick={() => setCurrentPage(page)}
              className="w-10"
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </Button>
        </div>
      )}
    </div>
  )
}
