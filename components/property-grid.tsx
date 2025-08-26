"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Bed, Bath, Square, Heart, Eye } from "lucide-react"
import Link from "next/link"

const properties = [
  {
    id: 1,
    title: "Casa Moderna en Palermo",
    location: "Palermo, Buenos Aires",
    price: "USD 850.000",
    type: "Casa",
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    image: "/modern-house-exterior.png",
    featured: true,
    status: "Venta",
  },
  {
    id: 2,
    title: "Penthouse con Vista al Río",
    location: "Puerto Madero, Buenos Aires",
    price: "USD 1.200.000",
    type: "Penthouse",
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    image: "/luxury-penthouse-interior.png",
    featured: true,
    status: "Venta",
  },
  {
    id: 3,
    title: "Villa de Lujo en Nordelta",
    location: "Nordelta, Buenos Aires",
    price: "USD 950.000",
    type: "Villa",
    bedrooms: 5,
    bathrooms: 4,
    area: 350,
    image: "/luxury-villa-pool-garden.png",
    featured: false,
    status: "Venta",
  },
  {
    id: 4,
    title: "Departamento en Recoleta",
    location: "Recoleta, Buenos Aires",
    price: "USD 650.000",
    type: "Departamento",
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    image: "/elegant-apartment-living.png",
    featured: false,
    status: "Venta",
  },
  {
    id: 5,
    title: "Loft Industrial en San Telmo",
    location: "San Telmo, Buenos Aires",
    price: "USD 480.000",
    type: "Loft",
    bedrooms: 2,
    bathrooms: 1,
    area: 95,
    image: "/industrial-loft-design.png",
    featured: false,
    status: "Venta",
  },
  {
    id: 6,
    title: "Casa con Jardín en Belgrano",
    location: "Belgrano, Buenos Aires",
    price: "USD 720.000",
    type: "Casa",
    bedrooms: 4,
    bathrooms: 3,
    area: 200,
    image: "/family-house-garden.png",
    featured: false,
    status: "Venta",
  },
  {
    id: 7,
    title: "Penthouse Dúplex en Barrio Norte",
    location: "Barrio Norte, Buenos Aires",
    price: "USD 1.100.000",
    type: "Penthouse",
    bedrooms: 4,
    bathrooms: 3,
    area: 220,
    image: "/duplex-penthouse-terrace.png",
    featured: false,
    status: "Venta",
  },
  {
    id: 8,
    title: "Departamento Moderno en Caballito",
    location: "Caballito, Buenos Aires",
    price: "USD 380.000",
    type: "Departamento",
    bedrooms: 2,
    bathrooms: 1,
    area: 85,
    image: "/modern-apartment-kitchen.png",
    featured: false,
    status: "Venta",
  },
  {
    id: 9,
    title: "Casa Estilo Colonial en San Isidro",
    location: "San Isidro, Buenos Aires",
    price: "USD 890.000",
    type: "Casa",
    bedrooms: 5,
    bathrooms: 4,
    area: 320,
    image: "/colonial-house-patio.png",
    featured: false,
    status: "Venta",
  },
]

export function PropertyGrid() {
  const [currentPage, setCurrentPage] = useState(1)
  const propertiesPerPage = 6

  const totalPages = Math.ceil(properties.length / propertiesPerPage)
  const startIndex = (currentPage - 1) * propertiesPerPage
  const currentProperties = properties.slice(startIndex, startIndex + propertiesPerPage)

  return (
    <div>
      {/* Results Header */}
      <div className="flex justify-between items-center mb-6">
        <p className="text-muted-foreground">
          Mostrando {startIndex + 1}-{Math.min(startIndex + propertiesPerPage, properties.length)} de{" "}
          {properties.length} propiedades
        </p>
      </div>

      {/* Properties Grid */}
      <div className="grid gap-6 mb-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {currentProperties.map((property) => (
          <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
            <div className="relative">
              <img
                src={property.image || "/placeholder.svg"}
                alt={property.title}
                className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Property badges */}
              <div className="absolute top-4 left-4 flex gap-2">
                {property.featured && <Badge className="bg-accent text-accent-foreground">Destacada</Badge>}
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
              <div className="flex justify-between items-start mb-2">
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
