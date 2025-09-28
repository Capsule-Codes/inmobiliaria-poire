"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { AdminSidebar } from "@/components/admin-sidebar"
import { ArrowLeft, X } from "lucide-react"
import { Property } from "@/types/Property"
import { useConfig } from "@/contexts/config-context"
import { Autocomplete } from "@/components/ui/autocomplete"
import { FileDropzone } from "@/components/ui/file-dropzone"
import Image from "next/image"

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

  const allowedTypes: string[] = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/avif',
    'image/heic',
    'image/heif',
  ]

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFilesSelected = (selected: File[]) => {
    setFileError(null)
    const filtered = selected.filter((f) => allowedTypes.includes(f.type))
    if (filtered.length !== selected.length) {
      setFileError('Algunos archivos fueron descartados por formato no permitido')
    }
    const merged = [...files, ...filtered]
    if (merged.length > 5) {
      setFileError('Máximo 5 imágenes')
    }
    setFiles(merged.slice(0, 5))
  }

  const handleFileRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const previews = files.map((f) => ({ file: f, url: URL.createObjectURL(f) }))
  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url))
    }
  }, [files])


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
                <FileDropzone
                  onFilesSelected={handleFilesSelected}
                  accept={allowedTypes}
                  maxFiles={5}
                  className="mb-2"
                />
                {fileError && (
                  <p className="text-sm text-red-600 mt-2">{fileError}</p>
                )}
                {files.length > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">{files.length} archivo(s) seleccionado(s)</p>
                )}

                {/* Thumbnails en memoria, similar a PropertyDetail */}
                {files.length > 0 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {previews.map((p, index) => (
                      <div key={index} className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-transparent">
                        <Image src={p.url} alt={`Preview ${index + 1}`} fill sizes="80px" className="object-cover" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-1 right-1 h-6 w-6"
                          onClick={() => handleFileRemove(index)}
                          aria-label={`Eliminar imagen ${index + 1}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
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



