"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react"
import Link from "next/link"
import { useConfig } from "@/contexts/config-context"

export function ContactInfo() {
  const { config } = useConfig()

  const sanitizedTelHref = config.companyPhone.replace(/[^+\d]/g, "")
  const waNumber = config.companyPhone.replace(/\D/g, "")

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
              <p className="text-muted-foreground">{config.companyAddress}</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Phone className="h-5 w-5 text-accent mt-1" />
            <div>
              <h4 className="font-semibold text-foreground">Teléfono</h4>
              <p className="text-muted-foreground">{config.companyPhone}</p>
            </div>
          </div>

          <div className="flex items-start space-x-4">
            <Mail className="h-5 w-5 text-accent mt-1" />
            <div>
              <h4 className="font-semibold text-foreground">Email</h4>
              <p className="text-muted-foreground">{config.companyEmail}</p>
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
            <Link href={`https://wa.me/${waNumber}`} target="_blank" rel="noopener noreferrer">
              WhatsApp: {config.companyPhone}
            </Link>
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Phone className="h-4 w-4 mr-2" />
            <Link href={`tel:${sanitizedTelHref}`} target="_blank" rel="noopener noreferrer">
              Llamar Ahora
            </Link>
          </Button>
          <Button variant="outline" className="w-full justify-start bg-transparent">
            <Mail className="h-4 w-4 mr-2" />
            <Link href={`mailto:${config.companyEmail}`} target="_blank" rel="noopener noreferrer">
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
              <p className="text-sm">{config.companyAddress}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

