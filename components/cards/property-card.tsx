"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Bed, Bath, Square } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { getCoverSrc } from "@/lib/media"
import type { Property } from "@/types/Property"

export function PropertyCard({ property }: { property: Property }) {
  const coverSrc = getCoverSrc('propiedades', property.id, property.images)
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
      <div className="relative h-64">
        <Image
          src={coverSrc}
          alt={property.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          {property.is_featured && <Badge className="bg-accent text-accent-foreground">Destacada</Badge>}
          <Badge variant="secondary">{property.status}</Badge>
        </div>
        <div className="absolute top-4 right-4 bg-primary text-primary-foreground px-3 py-1 rounded-full font-semibold">
          {property.price}
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
            asChild
          >
            <Link href={`/contacto/propiedad/${property.id}`}>Contactar</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

