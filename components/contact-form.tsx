"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Send, CheckCircle } from "lucide-react"
import { Contact } from "@/types/contact"

interface ContactFormProps {
  defaultService?: string
}

export function ContactForm({ defaultService }: ContactFormProps) {
  const [formData, setFormData] = useState<Omit<Contact, "id" | "status" | "created_at" | "updated_at">>({
    name: "",
    email: "",
    phone: "",
    service: defaultService || "",
    propertyType: "",
    location: "",
    budget: "",
    message: "",
    inquiry_type: "",
    property_id: "",
    project_id: ""
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setIsSubmitted(false);

    const url = '/api/contacto';
    let request = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData) };

    fetch(url, request)
      .then(res => {
        if (!res.ok) {
          return res.json()
            .then(j => Promise.reject(new Error(j?.message ?? `HTTP ${res.status}`)));
        }
        return res.json();
      })
      .then(data => console.log('Creado:', data))
      .catch(err => console.error(err))
      .finally(() => {
        setIsSubmitted(true);
        setIsLoading(false);
      });
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isSubmitted) {
    return (
      <Card className="border-accent/20">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-16 w-16 text-accent mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-foreground mb-2">¡Mensaje Enviado!</h3>
          <p className="text-muted-foreground mb-6">
            Gracias por contactarnos. Nos pondremos en contacto contigo dentro de las próximas 24 horas.
          </p>
          <Button onClick={() => setIsSubmitted(false)} variant="outline">
            Enviar Otro Mensaje
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-accent/20">
      <CardHeader>
        <CardTitle className="text-2xl text-foreground">Envíanos tu Consulta</CardTitle>
        <p className="text-muted-foreground">
          Completa el formulario y nos pondremos en contacto contigo a la brevedad
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Nombre Completo *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Tu nombre completo"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                placeholder="tu@email.com"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="phone">Teléfono *</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleInputChange("phone", e.target.value)}
              placeholder="+54 11 1234-5678"
              required
            />
          </div>

          {/* Service Type */}
          <div>
            <Label htmlFor="inquiry_type">Tipo de Consulta *</Label>
            <Select value={formData.inquiry_type} onValueChange={(value) => handleInputChange("inquiry_type", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona el tipo de consulta" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="compra">Quiero Comprar</SelectItem>
                <SelectItem value="venta">Quiero Vender</SelectItem>
                <SelectItem value="alquiler">Busco Alquilar</SelectItem>
                <SelectItem value="tasacion">Solicitar Tasación</SelectItem>
                <SelectItem value="inversion">Oportunidades de Inversión</SelectItem>
                <SelectItem value="emprendimiento">Información sobre Emprendimientos</SelectItem>
                <SelectItem value="general">Consulta General</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Property Details */}
          {(formData.service === "compra" || formData.service === "alquiler" || formData.service === "tasacion") && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="propertyType">Tipo de Propiedad</Label>
                <Select
                  value={formData.propertyType}
                  onValueChange={(value) => handleInputChange("propertyType", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tipo de propiedad" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="departamento">Departamento</SelectItem>
                    <SelectItem value="penthouse">Penthouse</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="loft">Loft</SelectItem>
                    <SelectItem value="terreno">Terreno</SelectItem>
                    <SelectItem value="comercial">Local Comercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="location">Zona de Interés</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder="Ej: Palermo, Puerto Madero..."
                />
              </div>
            </div>
          )}

          {/* Budget */}
          {(formData.service === "compra" || formData.service === "alquiler") && (
            <div>
              <Label htmlFor="budget">Presupuesto</Label>
              <Select value={formData.budget} onValueChange={(value) => handleInputChange("budget", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Rango de presupuesto" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="100-300">USD 100.000 - 300.000</SelectItem>
                  <SelectItem value="300-500">USD 300.000 - 500.000</SelectItem>
                  <SelectItem value="500-800">USD 500.000 - 800.000</SelectItem>
                  <SelectItem value="800-1200">USD 800.000 - 1.200.000</SelectItem>
                  <SelectItem value="1200+">USD 1.200.000+</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Message */}
          <div>
            <Label htmlFor="message">Mensaje</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange("message", e.target.value)}
              placeholder="Cuéntanos más detalles sobre lo que buscas..."
              rows={4}
            />
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-foreground mr-2"></div>
                Enviando...
              </div>
            ) : (
              <div className="flex items-center">
                <Send className="h-4 w-4 mr-2" />
                Enviar Consulta
              </div>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
