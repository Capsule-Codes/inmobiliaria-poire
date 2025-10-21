import { Navigation } from "@/components/navigation";
import { PropertyFilters } from "@/components/property-filters";
import { PropertyGrid } from "@/components/property-grid";
import { Footer } from "@/components/footer";
import { SearchPropertyProvider } from "@/contexts/search-property-context";

// Revalidar cada 60 segundos
export const revalidate = 60;

export default function PropiedadesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Page Header */}
      <section className="bg-muted/30 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Nuestras Propiedades
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Explora nuestra selección exclusiva de propiedades premium en las
              mejores ubicaciones
            </p>
          </div>
        </div>
      </section>

      <SearchPropertyProvider>
        {/* Filters and Properties */}
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PropertyFilters />
            <PropertyGrid />
          </div>
        </section>
      </SearchPropertyProvider>

      <Footer />
    </main>
  );
}
