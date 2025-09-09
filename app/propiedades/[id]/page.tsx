import { Navigation } from "@/components/navigation"
import { PropertyDetail } from "@/components/property-detail"
import { RelatedProperties } from "@/components/related-properties"
import { notFound } from "next/navigation"
import { getPropertyById } from "@/domain/Property"


export default async function PropertyDetailPage({ params }: { params: { id: string } }) {
  const property = await getPropertyById(params.id)

  if (!property) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <PropertyDetail property={property} />
      {/* <RelatedProperties currentPropertyId={property.id} /> */}
    </main>
  )
}
