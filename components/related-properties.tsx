import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Bed, Bath, Square } from "lucide-react"
import Link from "next/link"
import { Property } from "@/types/property"
import Image from "next/image"

interface RelatedPropertyDetailProps {
  relatedProperties: Property[]
}

export function RelatedProperties({ relatedProperties }: RelatedPropertyDetailProps) {

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Propiedades Similares</h2>
          <p className="text-lg text-muted-foreground">Otras propiedades que podrían interesarte</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {relatedProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative h-48">
                {(() => {
                  const raw: any = (property as any)?.images
                  let coverSrc = "/placeholder.svg"
                  if (raw && typeof raw === 'object' && Array.isArray(raw.items)) {
                    const items: any[] = raw.items as any[]
                    const main = items.find((it) => typeof it?.sortOrder === 'number' && it.sortOrder === 0)
                    const chosen = main ?? items[0]
                    if (chosen?.mediaId) {
                      coverSrc = `/api/propiedades/${property.id}/media/${chosen.mediaId}`
                    }
                  } else if (Array.isArray(raw) && raw.length > 0) {
                    coverSrc = raw[0]
                  }
                  return (
                    <Image
                      src={coverSrc}
                      alt={property.title}
                      fill
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      className="object-cover"
                    />
                  )
                })()}
                <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full font-semibold">
                  {property.price}
                </div>
              </div>

              <CardContent className="p-6">
                <div className="h-[4rem]">
                <h3 className="text-lg font-semibold text-foreground mb-2">{property.title}</h3>
                </div>

                <div className="flex items-center text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{property.location}</span>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
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

                <Button asChild className="w-full bg-primary hover:bg-primary/90">
                  <Link href={`/propiedades/${property.id}`}>Ver Detalles</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
