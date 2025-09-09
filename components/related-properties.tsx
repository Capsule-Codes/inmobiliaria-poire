import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Bed, Bath, Square } from "lucide-react"
import Link from "next/link"

const relatedProperties = [
  {
    id: '10e96653-25d5-42b4-a0f9-30b20137f4bb',
    title: "Villa de Lujo en Nordelta",
    location: "Nordelta, Buenos Aires",
    price: "USD 950.000",
    bedrooms: 5,
    bathrooms: 4,
    area: 350,
    image: "/luxury-villa-pool-garden.png",
  },
  {
    id: '34c842a3-fe4e-44ab-8d54-5b441c381351',
    title: "Departamento en Recoleta",
    location: "Recoleta, Buenos Aires",
    price: "USD 650.000",
    bedrooms: 3,
    bathrooms: 2,
    area: 120,
    image: "/elegant-apartment-living.png",
  },
  {
    id: '6eb4172b-d702-451e-98ba-2491f1863525',
    title: "Loft Industrial en San Telmo",
    location: "San Telmo, Buenos Aires",
    price: "USD 480.000",
    bedrooms: 2,
    bathrooms: 1,
    area: 95,
    image: "/industrial-loft-design.png",
  },
]

interface RelatedPropertiesProps {
  currentPropertyId: string
}

export function RelatedProperties({ currentPropertyId }: RelatedPropertiesProps) {
  const filteredProperties = relatedProperties.filter((property) => property.id !== currentPropertyId)

  return (
    <section className="py-16 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Propiedades Similares</h2>
          <p className="text-lg text-muted-foreground">Otras propiedades que podrían interesarte</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProperties.map((property) => (
            <Card key={property.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="relative">
                <img
                  src={property.image || "/placeholder.svg"}
                  alt={property.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-3 py-1 rounded-full font-semibold">
                  {property.price}
                </div>
              </div>

              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-foreground mb-2">{property.title}</h3>

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
