"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { AdminSidebar } from "@/components/admin-sidebar"
import { ArrowLeft, X, Plus } from "lucide-react"
import { Property } from "@/types/Property"
import { useConfig } from "@/contexts/config-context"
import { Autocomplete } from "@/components/ui/autocomplete"

interface PropertyFormProps {
  property?: Property | null
  onSave: (property: any, files?: File[]) => void
  onCancel: () => void
  submitting?: boolean
}

export function PropertyForm({ property, onSave, onCancel, submitting = false }: PropertyFormProps) {
  const { config } = useConfig()
  const locationOptions = config.availableLocations ?? []
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [formData, setFormData] = useState<Omit<Property, "id">>({
    title: property?.title || "",
    location: property?.location || "",
    price: property?.price || 0,
    bedrooms: property?.bedrooms || 1,
    bathrooms: property?.bathrooms || 1,
    area: property?.area || 0,
    type: property?.type || "Casa",
    status: property?.status || "Disponible",
    is_featured: property?.is_featured || false,
    description: property?.description || "",
    images: property?.images || [],
    features: [],
  })

  const [files, setFiles] = useState<File[]>([])
  const [fileError, setFileError] = useState<string | null>(null)

  const allowedTypes = new Set([
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/heic',
    'image/heif',
  ])

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }



  const handleImageRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_: any, i: number) => i !== index),
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFileError(null)
    const selected = Array.from(e.target.files || [])
    if (selected.length > 5) {
      setFiles([])
      setFileError('Máximo 5 imágenes')
      e.target.value = ''
      return
    }
    const valid: File[] = []
    for (const f of selected) {
      if (allowedTypes.has(f.type)) {
        valid.push(f)
      }
    }
    if (valid.length !== selected.length) {
      setFileError('Algunos archivos fueron descartados por formato no permitido')
    }
    setFiles(valid)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData, files)
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} currentPage="propiedades" />

      <div className="lg:ml-64">
        <div className="p-6 lg:p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={onCancel}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Volver
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                {property ? "Editar Propiedad" : "Nueva Propiedad"}
              </h1>
              <p className="text-muted-foreground">
                {property ? "Modifica los datos de la propiedad" : "Completa la información de la nueva propiedad"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Información Básica */}
              <Card>
                <CardHeader>
                  <CardTitle>Información Básica</CardTitle>
                  <CardDescription>Datos principales de la propiedad</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Ej: Casa Moderna en Palermo"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Ubicación</Label>
                    <Autocomplete
                      id="location"
                      value={formData.location}
                      onValueChange={(value) => handleInputChange("location", value)}
                      options={locationOptions}
                      placeholder="Ej: Palermo, Buenos Aires"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="price">Precio</Label>
                    <Input
                      id="price"
                      value={formData.price}
                      onChange={(e) => handleInputChange("price", e.target.value)}
                      placeholder="Ej: USD 850.000"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="type">Tipo</Label>
                      <Select value={formData.type} onValueChange={(value) => handleInputChange("type", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Casa">Casa</SelectItem>
                          <SelectItem value="Departamento">Departamento</SelectItem>
                          <SelectItem value="Oficina">Oficina</SelectItem>
                          <SelectItem value="Local">Local</SelectItem>
                          <SelectItem value="Terreno">Terreno</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="status">Estado</Label>
                      <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Disponible">Disponible</SelectItem>
                          <SelectItem value="Vendido">Vendido</SelectItem>
                          <SelectItem value="Reservado">Reservado</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Características */}
              <Card>
                <CardHeader>
                  <CardTitle>Características</CardTitle>
                  <CardDescription>Detalles técnicos de la propiedad</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="bedrooms">Dormitorios</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        min="0"
                        value={formData.bedrooms}
                        onChange={(e) => handleInputChange("bedrooms", Number.parseInt(e.target.value))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="bathrooms">Baños</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        min="0"
                        value={formData.bathrooms}
                        onChange={(e) => handleInputChange("bathrooms", Number.parseInt(e.target.value))}
                      />
                    </div>

                    <div>
                      <Label htmlFor="area">Área (m²)</Label>
                      <Input
                        id="area"
                        type="number"
                        min="0"
                        value={formData.area}
                        onChange={(e) => handleInputChange("area", Number.parseInt(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) => handleInputChange("is_featured", checked)}
                    />
                    <Label htmlFor="is_featured">Marcar como destacada</Label>
                  </div>

                  <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe las características principales de la propiedad..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Imágenes */}
            <Card>
              <CardHeader>
                <CardTitle>Imágenes</CardTitle>
                <CardDescription>Agrega imágenes de la propiedad</CardDescription>
              </CardHeader>
              <CardContent>
                <input
                  type="file"
                  multiple
                  accept=".jpeg,.jpg,.png,.webp,.avif,.heic,.heif,image/jpeg,image/jpg,image/png,image/webp,image/avif,image/heic,image/heif"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-foreground file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary/90"
                />
                {fileError && (
                  <p className="text-sm text-red-600 mt-2">{fileError}</p>
                )}
                {files.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">{files.length} archivo(s) seleccionado(s)</p>
                )}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {formData.images.map((image: string, index: number) => (
                    <div key={index} className="relative group">
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => handleImageRemove(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>

              </CardContent>
            </Card>

            {/* Botones de Acción */}
            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={submitting} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                {property ? "Actualizar Propiedad" : "Crear Propiedad"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}



