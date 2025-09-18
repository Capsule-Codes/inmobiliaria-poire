import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react"
import Link from "next/link"

export function ContactInfo() {
  return (
    <div className="space-y-8">
      {/* Contact Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Información de Contacto</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start space-x-4">
            <MapPin className="h-5 w-5 text-accent mt-1" />
            <div>
              <h4 className="font-semibold text-foreground">Dirección</h4>
              <p className="text-muted-foreground">
                Av. Santa Fe 1234, Piso 8
                <br />
                Recoleta, Buenos Aires
                <br />
                C1059ABF
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Phone className="h-5 w-5 text-accent mt-1" />
            <div>
              <h4 className="font-semibold text-foreground">Teléfono</h4>
              <p className="text-muted-foreground">+54 11 4815-9876</p>
              <p className="text-muted-foreground">+54 11 4815-9877</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Mail className="h-5 w-5 text-accent mt-1" />
            <div>
              <h4 className="font-semibold text-foreground">Email</h4>
              <p className="text-muted-foreground">info@poirepropiedades.com</p>
              <p className="text-muted-foreground">ventas@poirepropiedades.com</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Clock className="h-5 w-5 text-accent mt-1" />
            <div>
              <h4 className="font-semibold text-foreground">Horarios de Atención</h4>
              <p className="text-muted-foreground">
                Lunes a Viernes: 9:00 - 19:00
                <br />
                Sábados: 9:00 - 14:00
                <br />
                Domingos: Cerrado
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Contact */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Contacto Rápido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full justify-start bg-green-600 hover:bg-green-700 text-white">
            <MessageCircle className="h-4 w-4 mr-2" />
            <Link href="https://wa.me/5491112345678" target="_blank" rel="noopener noreferrer">
              WhatsApp: +54 9 11 1234-5678
            </Link>
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Phone className="h-4 w-4 mr-2" />
            <Link href="tel:+541148159876" target="_blank" rel="noopener noreferrer">
              Llamar Ahora
            </Link>
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Mail className="h-4 w-4 mr-2" />
            <Link href="mailto:info@poirepropiedades.com" target="_blank" rel="noopener noreferrer">
              Enviar Email
            </Link>
          </Button>
        </CardContent>
      </Card>

      {/* Map Placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl text-foreground">Nuestra Ubicación</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full h-64 bg-muted/30 rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-2" />
              <p>Mapa Interactivo</p>
              <p className="text-sm">Av. Santa Fe 1234, Recoleta</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
