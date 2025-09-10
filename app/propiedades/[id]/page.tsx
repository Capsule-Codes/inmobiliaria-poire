import { Navigation } from "@/components/navigation"
import { PropertyDetail } from "@/components/property-detail"
import { RelatedProperties } from "@/components/related-properties"
import { notFound } from "next/navigation"
import { getPropertyById, getRelatedProperties } from "@/domain/Property"


export default async function PropertyDetailPage({ params }: { params: { id: string } }) {

  const { id } = await params;
  const property = await getPropertyById(id)
  const relatedProperties = await getRelatedProperties(id)

  if (!property) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <PropertyDetail property={property} />
      {<RelatedProperties relatedProperties={relatedProperties} />}
    </main>
  )
}
