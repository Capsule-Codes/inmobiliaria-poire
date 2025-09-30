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
import { Badge } from "@/components/ui/badge"
import { AdminSidebar } from "@/components/admin-sidebar"
import { ArrowLeft, X, Plus } from "lucide-react"
import { Project } from "@/types/project"
import { compareMediaItems } from "@/lib/media"
import type { Images, MediaItem } from "@/lib/media"
import { ALLOWED_IMAGE_MIME, MAX_IMAGES } from "@/lib/constants/media"
import { Autocomplete } from "@/components/ui/autocomplete"
import { useConfig } from "@/contexts/config-context"
import { FileDropzone } from "@/components/ui/file-dropzone"
import Image from "next/image"

type ProjectFormData = Omit<Project, "id">

interface ProjectFormProps {
  project?: Project | null
  onSave: (project: ProjectFormData, files?: File[]) => void
  onCancel: () => void
  submitting?: boolean
}

export function ProjectForm({ project, onSave, onCancel, submitting = false }: ProjectFormProps) {
  const { config } = useConfig()
  const locationOptions = config.availableLocations ?? []
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: project?.name ?? "",
    location: project?.location ?? "",
    description: project?.description ?? "",
    status: project?.status ?? "Próximamente",
    progress: project?.progress ?? 0,
    delivery_date: project?.delivery_date ?? "",
    total_units: project?.total_units ?? 0,
    available_units: project?.available_units ?? 0,
    price_from: project?.price_from ?? "",
    is_featured: project?.is_featured ?? false,
    images: project?.images ?? [],
    amenities: project?.amenities ?? [],
  })

  const [newAmenity, setNewAmenity] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [fileError, setFileError] = useState<string | null>(null)

  type ExistingItem = MediaItem
  const [existingItems, setExistingItems] = useState<ExistingItem[]>([])
  const [coverId, setCoverId] = useState<string | null>(null)

  useEffect(() => {
    if (!project) {
      setExistingItems([])
      setCoverId(null)
      return
    }
    const raw: any = (project as any)?.images
    if (raw && typeof raw === 'object' && Array.isArray(raw.items)) {
      const items: ExistingItem[] = [...raw.items].sort((a: any, b: any) => compareMediaItems(a, b, raw.coverId ?? null))
      setExistingItems(items)
      setCoverId(raw.coverId ?? null)
    } else {
      setExistingItems([])
      setCoverId(null)
    }
  }, [project?.id])

  const allowedTypes: string[] = Array.from(ALLOWED_IMAGE_MIME)

  const handleInputChange = <K extends keyof typeof formData>(field: K, value: typeof formData[K]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleFilesSelectedWithLimit = (selected: File[]) => {
    setFileError(null)
    const filtered = selected.filter((f) => ALLOWED_IMAGE_MIME.has(f.type))
    if (filtered.length !== selected.length) {
      setFileError('Algunos archivos fueron descartados por formato no permitido')
    }
    const max = MAX_IMAGES
    const availableSlots = Math.max(0, max - existingItems.length)
    const merged = [...files, ...filtered].slice(0, availableSlots)
    if (filtered.length > availableSlots) {
      setFileError('Límite total 5 imágenes (incluye existentes)')
    }
    setFiles(merged)
  }

  const handleFileRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index))
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
    const imagesJson = existingItems.length > 0
      ? { version: 1, coverId: coverId ?? (existingItems[0]?.mediaId ?? null), items: existingItems }
      : []
    onSave({ ...formData, images: imagesJson }, files)
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} currentPage="emprendimientos" />

      <div className="lg:ml-64">
        <div className="p-6 lg:p-8">
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
                    <Label htmlFor="name">Nombre</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="Ej: Torres del Río"
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
                      placeholder="Ej: Puerto Madero"
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
                    <Label htmlFor="price_from">Precio Desde</Label>
                    <Input
                      id="price_from"
                      value={formData.price_from}
                      onChange={(e) => handleInputChange("price_from", e.target.value)}
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
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Selecciona estado" />
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
                    <Label htmlFor="delivery_date">Fecha de Entrega</Label>
                    <Input
                      id="delivery_date"
                      type="date"
                      value={formData.delivery_date}
                      onChange={(e) => handleInputChange("delivery_date", e.target.value)}
                      placeholder="AAAA-MM-DD"
                      required
                    />
                  </div>


                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="total_units">Total de Unidades</Label>
                      <Input id="total_units" type="number" min="0" value={formData.total_units} onChange={(e) => handleInputChange("total_units", Number.parseInt(e.target.value))} required />
                    </div>
                    <div>
                      <Label htmlFor="available_units">Unidades Disponibles</Label>
                      <Input id="available_units" type="number" min="0" value={formData.available_units} onChange={(e) => handleInputChange("available_units", Number.parseInt(e.target.value))} required />
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch id="is_featured" checked={formData.is_featured} onCheckedChange={(checked) => handleInputChange("is_featured", checked)} />
                    <Label htmlFor="is_featured">Marcar como destacado</Label>
                  </div>
                </CardContent>
              </Card>
            </div>

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
                {project && existingItems.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">Imágenes actuales</p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {existingItems.map((item, index) => (
                        <div key={item.mediaId} className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-transparent">
                          <Image
                            src={`/api/emprendimientos/${project.id}/media/${item.mediaId}`}
                            alt={item.alt || `Imagen ${index + 1}`}
                            fill
                            sizes="80px"
                            className="object-cover"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-1 right-1 h-6 w-6"
                            onClick={() => setExistingItems((prev) => prev.filter((_, i) => i !== index))}
                            aria-label={`Eliminar imagen existente ${index + 1}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <FileDropzone onFilesSelected={handleFilesSelectedWithLimit} accept={allowedTypes} maxFiles={MAX_IMAGES} className="mb-2" />
                {fileError && <p className="text-sm text-red-600 mt-2">{fileError}</p>}
                <p className="text-sm text-muted-foreground mt-2">{existingItems.length} existente(s) + {files.length} nueva(s) (máx. 5)</p>
                {files.length > 0 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {files.map((file, index) => {
                      const url = URL.createObjectURL(file)
                      return (
                        <div key={index} className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-transparent">
                          <Image src={url} alt={`Preview ${index + 1}`} fill sizes="80px" className="object-cover" />
                          <Button type="button" variant="destructive" size="icon" className="absolute top-1 right-1 h-6 w-6" onClick={() => handleFileRemove(index)} aria-label={`Eliminar imagen ${index + 1}`}>
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="flex gap-4 justify-end">
              <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
              <Button type="submit" disabled={submitting} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">{project ? "Actualizar Emprendimiento" : "Crear Emprendimiento"}</Button>
            </div>
          </form>
        </div>
      </div >
    </div >
  )
}
