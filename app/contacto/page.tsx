import { Navigation } from "@/components/navigation"
import { ContactForm } from "@/components/contact-form"
import { ContactInfo } from "@/components/contact-info"

export default function ContactoPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />

      {/* Page Header */}
      <section className="bg-primary text-primary-foreground py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Contactanos</h1>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Estamos aquí para ayudarte a encontrar la propiedad perfecta o realizar la tasación que necesitas
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <ContactForm />
            <ContactInfo />
          </div>
        </div>
      </section>
    </main>
  )
}
