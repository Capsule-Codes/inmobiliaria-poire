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
import { Badge } from "@/components/ui/badge"
import { AdminSidebar } from "@/components/admin-sidebar"
import { ArrowLeft, X, Plus } from "lucide-react"

interface ProjectFormProps {
  project?: any
  onSave: (project: any) => void
  onCancel: () => void
}

export function ProjectForm({ project, onSave, onCancel }: ProjectFormProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: project?.title || "",
    location: project?.location || "",
    description: project?.description || "",
    status: project?.status || "Próximamente",
    progress: project?.progress || 0,
    deliveryDate: project?.deliveryDate || "",
    totalUnits: project?.totalUnits || 0,
    availableUnits: project?.availableUnits || 0,
    priceFrom: project?.priceFrom || "",
    featured: project?.featured || false,
    images: project?.images || [],
    amenities: project?.amenities || [],
  })

  const [newAmenity, setNewAmenity] = useState("")

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleImageAdd = () => {
    const imageUrl = prompt("Ingresa la URL de la imagen:")
    if (imageUrl) {
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, imageUrl],
      }))
    }
  }

  const handleImageRemove = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_: any, i: number) => i !== index),
    }))
  }

  const handleAmenityAdd = () => {
    if (newAmenity.trim() && !formData.amenities.includes(newAmenity.trim())) {
      setFormData((prev) => ({
        ...prev,
        amenities: [...prev.amenities, newAmenity.trim()],
      }))
      setNewAmenity("")
    }
  }

  const handleAmenityRemove = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.filter((a: string) => a !== amenity),
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} currentPage="emprendimientos" />

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
                {project ? "Editar Emprendimiento" : "Nuevo Emprendimiento"}
              </h1>
              <p className="text-muted-foreground">
                {project ? "Modifica los datos del emprendimiento" : "Completa la información del nuevo emprendimiento"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Información Básica */}
              <Card>
                <CardHeader>
                  <CardTitle>Información Básica</CardTitle>
                  <CardDescription>Datos principales del emprendimiento</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      placeholder="Ej: Torres del Río"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Ubicación</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => handleInputChange("location", e.target.value)}
                      placeholder="Ej: Puerto Madero, Buenos Aires"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe el emprendimiento..."
                      rows={3}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="priceFrom">Precio Desde</Label>
                    <Input
                      id="priceFrom"
                      value={formData.priceFrom}
                      onChange={(e) => handleInputChange("priceFrom", e.target.value)}
                      placeholder="Ej: USD 450.000"
                      required
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Estado y Progreso */}
              <Card>
                <CardHeader>
                  <CardTitle>Estado del Proyecto</CardTitle>
                  <CardDescription>Información sobre el progreso y estado</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="status">Estado</Label>
                    <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Próximamente">Próximamente</SelectItem>
                        <SelectItem value="En Construcción">En Construcción</SelectItem>
                        <SelectItem value="En Venta">En Venta</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="progress">Progreso (%)</Label>
                    <Input
                      id="progress"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.progress}
                      onChange={(e) => handleInputChange("progress", Number.parseInt(e.target.value))}
                    />
                  </div>

                  <div>
                    <Label htmlFor="deliveryDate">Fecha de Entrega</Label>
                    <Input
                      id="deliveryDate"
                      value={formData.deliveryDate}
                      onChange={(e) => handleInputChange("deliveryDate", e.target.value)}
                      placeholder="Ej: Diciembre 2024"
                      required
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="featured"
                      checked={formData.featured}
                      onCheckedChange={(checked) => handleInputChange("featured", checked)}
                    />
                    <Label htmlFor="featured">Marcar como destacado</Label>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Unidades */}
            <Card>
              <CardHeader>
                <CardTitle>Información de Unidades</CardTitle>
                <CardDescription>Datos sobre las unidades del proyecto</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="totalUnits">Total de Unidades</Label>
                    <Input
                      id="totalUnits"
                      type="number"
                      min="0"
                      value={formData.totalUnits}
                      onChange={(e) => handleInputChange("totalUnits", Number.parseInt(e.target.value))}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="availableUnits">Unidades Disponibles</Label>
                    <Input
                      id="availableUnits"
                      type="number"
                      min="0"
                      value={formData.availableUnits}
                      onChange={(e) => handleInputChange("availableUnits", Number.parseInt(e.target.value))}
                      required
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Amenities */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
                <CardDescription>Servicios y comodidades del emprendimiento</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {formData.amenities.map((amenity: string, index: number) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {amenity}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => handleAmenityRemove(amenity)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={newAmenity}
                      onChange={(e) => setNewAmenity(e.target.value)}
                      placeholder="Agregar amenity..."
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAmenityAdd())}
                    />
                    <Button type="button" variant="outline" onClick={handleAmenityAdd}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Imágenes */}
            <Card>
              <CardHeader>
                <CardTitle>Imágenes</CardTitle>
                <CardDescription>Agrega imágenes del emprendimiento</CardDescription>
              </CardHeader>
              <CardContent>
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

                <Button type="button" variant="outline" onClick={handleImageAdd} className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Agregar Imagen
                </Button>
              </CardContent>
            </Card>

            {/* Botones de Acción */}
            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                {project ? "Actualizar Emprendimiento" : "Crear Emprendimiento"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
