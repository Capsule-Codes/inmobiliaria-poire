import { Navigation } from "@/components/navigation"
import { ContactForm } from "@/components/contact-form"
import { ContactInfo } from "@/components/contact-info"

export default function TasacionesPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Page Header */}
      <section className="bg-accent text-accent-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Tasaciones</h1>
            <p className="text-xl text-accent-foreground/90 max-w-2xl mx-auto">
              Obtén una tasación profesional y precisa de tu propiedad con nuestro equipo de expertos
            </p>
          </div>
        </div>
      </section>

      {/* Tasaciones Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ContactForm defaultService="tasacion" />
            <div className="space-y-8">
              <ContactInfo />

              {/* Tasaciones Info */}
              <div className="bg-muted/30 rounded-lg p-6">
                <h3 className="text-xl font-semibold mb-4">¿Por qué elegir nuestras tasaciones?</h3>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3 mt-2"></div>
                    <span>Profesionales matriculados con amplia experiencia</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3 mt-2"></div>
                    <span>Análisis detallado del mercado inmobiliario</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3 mt-2"></div>
                    <span>Informes completos y documentados</span>
                  </li>
                  <li className="flex items-start">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3 mt-2"></div>
                    <span>Entrega en 48-72 horas</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
