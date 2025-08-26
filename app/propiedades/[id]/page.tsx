import { Navigation } from "@/components/navigation"
import { PropertyDetail } from "@/components/property-detail"
import { RelatedProperties } from "@/components/related-properties"
import { notFound } from "next/navigation"

// Mock data - in a real app this would come from a database
const properties = [
  {
    id: 1,
    title: "Casa Moderna en Palermo",
    location: "Palermo, Buenos Aires",
    fullAddress: "Av. Santa Fe 3450, Palermo, Buenos Aires",
    price: "USD 850.000",
    type: "Casa",
    bedrooms: 4,
    bathrooms: 3,
    area: 280,
    lotSize: 400,
    yearBuilt: 2020,
    status: "Venta",
    description:
      "Espectacular casa moderna de diseño contemporáneo ubicada en el corazón de Palermo. Esta propiedad única combina elegancia y funcionalidad en cada detalle. Con amplios espacios, terminaciones de primera calidad y un diseño que maximiza la luz natural, esta casa representa la perfecta armonía entre el confort urbano y el diseño vanguardista.",
    features: [
      "Cocina integrada con isla central",
      "Living comedor de doble altura",
      "Master suite con vestidor",
      "Terraza con parrilla",
      "Cochera para 2 autos",
      "Sistema de domótica",
      "Calefacción por losa radiante",
      "Aire acondicionado central",
    ],
    amenities: ["Jardín privado", "Piscina", "Quincho", "Seguridad 24hs"],
    images: [
      "/modern-house-exterior.png",
      "/luxury-modern-living-room.png",
      "/modern-apartment-kitchen.png",
      "/elegant-apartment-living.png",
    ],
    coordinates: { lat: -34.5875, lng: -58.42 },
  },
  {
    id: 2,
    title: "Penthouse con Vista al Río",
    location: "Puerto Madero, Buenos Aires",
    fullAddress: "Juana Manso 1500, Puerto Madero, Buenos Aires",
    price: "USD 1.200.000",
    type: "Penthouse",
    bedrooms: 3,
    bathrooms: 2,
    area: 180,
    lotSize: null,
    yearBuilt: 2019,
    status: "Venta",
    description:
      "Exclusivo penthouse con vistas panorámicas al Río de la Plata y la ciudad. Ubicado en una de las torres más prestigiosas de Puerto Madero, este departamento ofrece lujo y sofisticación en cada ambiente. Con terminaciones premium y amenities de primer nivel, es la opción perfecta para quienes buscan vivir en el epicentro de la modernidad porteña.",
    features: [
      "Vista panorámica 360°",
      "Terraza privada de 50m²",
      "Cocina premium con electrodomésticos importados",
      "Toilette de recepción",
      "Dormitorio principal en suite",
      "Vestidor walk-in",
      "Baulera privada",
      "2 cocheras fijas",
    ],
    amenities: ["Piscina climatizada", "Gimnasio completo", "SUM con cocina", "Concierge 24hs", "Valet parking"],
    images: [
      "/luxury-penthouse-interior.png",
      "/duplex-penthouse-terrace.png",
      "/modern-apartment-kitchen.png",
      "/elegant-apartment-living.png",
    ],
    coordinates: { lat: -34.6118, lng: -58.3636 },
  },
]

export default function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = properties.find((p) => p.id === Number.parseInt(params.id))

  if (!property) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <PropertyDetail property={property} />
      <RelatedProperties currentPropertyId={property.id} />
    </main>
  )
}
