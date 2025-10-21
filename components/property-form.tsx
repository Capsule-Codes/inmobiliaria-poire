"use client";

import type React from "react";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AdminSidebar } from "@/components/admin-sidebar";
import { ArrowLeft, X, Plus } from "lucide-react";
import { Property } from "@/types/Property";
import type { Images, MediaItem } from "@/lib/media";
import { compareMediaItems } from "@/lib/media";
import { ALLOWED_IMAGE_MIME, MAX_IMAGES } from "@/lib/constants/media";
import { useConfig } from "@/contexts/config-context";
import { Autocomplete } from "@/components/ui/autocomplete";
import { FileDropzone } from "@/components/ui/file-dropzone";
import Image from "next/image";
import { compressImages } from "@/lib/image-compression";

type PropertyFormData = Omit<Property, "id">;

interface PropertyFormProps {
  property?: Property | null;
  onSave: (property: PropertyFormData, files?: File[]) => void;
  onCancel: () => void;
  submitting?: boolean;
}

export function PropertyForm({
  property,
  onSave,
  onCancel,
  submitting = false,
}: PropertyFormProps) {
  const { config } = useConfig();
  const locationOptions = config.availableLocations ?? [];
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [formData, setFormData] = useState<PropertyFormData>({
    title: property?.title || "",
    location: property?.location || "",
    address: property?.address || "",
    price: property?.price || 0,
    currency: property?.currency || "USD",
    operation_type: property?.operation_type || "venta",
    bedrooms: property?.bedrooms || 1,
    bathrooms: property?.bathrooms || 1,
    area: property?.area || 0,
    type: property?.type || "Casa",
    status: property?.status || "Disponible",
    is_featured: property?.is_featured || false,
    description: property?.description || "",
    images: property?.images || [],
    features: property?.features || [],
  });

  const [newFeature, setNewFeature] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [fileError, setFileError] = useState<string | null>(null);

  // Existing images (when editing) in the structured JSON format used by the API
  type ExistingItem = MediaItem;
  const [existingItems, setExistingItems] = useState<ExistingItem[]>([]);
  const [coverId, setCoverId] = useState<string | null>(null);

  useEffect(() => {
    if (!property) {
      setExistingItems([]);
      setCoverId(null);
      return;
    }
    const raw: any = (property as any)?.images;
    if (raw && typeof raw === "object" && Array.isArray(raw.items)) {
      const items: ExistingItem[] = [...raw.items].sort((a: any, b: any) =>
        compareMediaItems(a, b, raw.coverId ?? null)
      );
      setExistingItems(items);
      setCoverId(raw.coverId ?? null);
    } else {
      setExistingItems([]);
      setCoverId(null);
    }
  }, [property?.id]);

  const allowedTypes: string[] = Array.from(ALLOWED_IMAGE_MIME);

  const handleInputChange = <K extends keyof PropertyFormData>(
    field: K,
    value: PropertyFormData[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFilesSelected = (selected: File[]) => {
    setFileError(null);
    const filtered = selected.filter((f) => ALLOWED_IMAGE_MIME.has(f.type));
    if (filtered.length !== selected.length) {
      setFileError(
        "Algunos archivos fueron descartados por formato no permitido"
      );
    }
    const merged = [...files, ...filtered];
    if (merged.length > MAX_IMAGES) {
      setFileError("Máximo 10 imágenes");
    }
    setFiles(merged.slice(0, MAX_IMAGES));
  };

  const handleFileRemove = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleFeatureAdd = () => {
    const v = newFeature.trim();
    if (!v) return;
    if (formData.features.includes(v)) return;
    setFormData((prev) => ({ ...prev, features: [...prev.features, v] }));
    setNewFeature("");
  };

  const handleFeatureRemove = (feature: string) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.filter((f) => f !== feature),
    }));
  };

  // New handler that enforces total limit including existing images
  const handleFilesSelectedWithLimit = async (selected: File[]) => {
    setFileError(null);
    const filtered = selected.filter((f) => ALLOWED_IMAGE_MIME.has(f.type));
    if (filtered.length !== selected.length) {
      setFileError(
        "Algunos archivos fueron descartados por formato no permitido"
      );
    }

    // Comprimir imágenes antes de agregarlas
    const compressed = await compressImages(filtered, 1600, 0.8);

    const max = MAX_IMAGES;
    const availableSlots = Math.max(0, max - existingItems.length);
    const next = [...files, ...compressed].slice(0, availableSlots);
    if (existingItems.length + (files.length + compressed.length) > max) {
      setFileError("Máximo 10 imágenes (incluye existentes y nuevas)");
    }
    setFiles(next);
  };

  const previews = files.map((f) => ({ file: f, url: URL.createObjectURL(f) }));
  useEffect(() => {
    return () => {
      previews.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, [files]);

  const desiredImagesJson = useMemo(() => {
    if (!property) return [] as any;
    if (existingItems.length === 0) return [] as any;
    return {
      version: 1,
      coverId:
        coverId && existingItems.find((it) => it.mediaId === coverId)
          ? coverId
          : null,
      items: existingItems,
    };
  }, [property?.id, existingItems, coverId]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: PropertyFormData = {
      ...formData,
      images: desiredImagesJson as Images,
    };
    onSave(payload, files);
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        currentPage="propiedades"
      />

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
                {property
                  ? "Modifica los datos de la propiedad"
                  : "Completa la información de la nueva propiedad"}
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Información Básica */}
              <Card>
                <CardHeader>
                  <CardTitle>Información Básica</CardTitle>
                  <CardDescription>
                    Datos principales de la propiedad
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) =>
                        handleInputChange("title", e.target.value)
                      }
                      placeholder="Ej: Casa Moderna en Palermo"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="location">Ubicación</Label>
                    <Autocomplete
                      id="location"
                      value={formData.location}
                      onValueChange={(value) =>
                        handleInputChange("location", value)
                      }
                      options={locationOptions}
                      placeholder="Ej: Palermo, Buenos Aires"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Dirección Completa</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      placeholder="Ej: Av. Corrientes 1234, CABA"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="currency">Moneda</Label>
                      <Select
                        value={formData.currency}
                        onValueChange={(value) =>
                          handleInputChange("currency", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">USD</SelectItem>
                          <SelectItem value="ARS">ARS</SelectItem>
                          <SelectItem value="EUR">EUR</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="price">Precio</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) =>
                          handleInputChange("price", Number(e.target.value))
                        }
                        placeholder="850000"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="operation_type">Operación</Label>
                      <Select
                        value={formData.operation_type}
                        onValueChange={(value) =>
                          handleInputChange("operation_type", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="venta">Venta</SelectItem>
                          <SelectItem value="alquiler">Alquiler</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="type">Tipo</Label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) =>
                          handleInputChange("type", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Casa">Casa</SelectItem>
                          <SelectItem value="Departamento">
                            Departamento
                          </SelectItem>
                          <SelectItem value="Edificio">Edificio</SelectItem>
                          <SelectItem value="Galpón">Galpón</SelectItem>
                          <SelectItem value="Cochera">Cochera</SelectItem>
                          <SelectItem value="Local">Local comercial</SelectItem>
                          <SelectItem value="Oficina">Oficina</SelectItem>
                          <SelectItem value="Lote">Lote</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="status">Estado</Label>
                      <Select
                        value={formData.status}
                        onValueChange={(value) =>
                          handleInputChange("status", value)
                        }
                      >
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
                  <CardDescription>
                    Detalles técnicos de la propiedad
                  </CardDescription>
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
                        onChange={(e) =>
                          handleInputChange(
                            "bedrooms",
                            Number.parseInt(e.target.value)
                          )
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="bathrooms">Baños</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        min="0"
                        value={formData.bathrooms}
                        onChange={(e) =>
                          handleInputChange(
                            "bathrooms",
                            Number.parseInt(e.target.value)
                          )
                        }
                      />
                    </div>

                    <div>
                      <Label htmlFor="area">Área (m²)</Label>
                      <Input
                        id="area"
                        type="number"
                        min="0"
                        value={formData.area}
                        onChange={(e) =>
                          handleInputChange(
                            "area",
                            Number.parseInt(e.target.value)
                          )
                        }
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="is_featured"
                      checked={formData.is_featured}
                      onCheckedChange={(checked) =>
                        handleInputChange("is_featured", checked)
                      }
                    />
                    <Label htmlFor="is_featured">Marcar como destacada</Label>
                  </div>

                  <div>
                    <Label htmlFor="description">Descripción</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      placeholder="Describe las características principales de la propiedad..."
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Amenities/Características */}
            <Card>
              <CardHeader>
                <CardTitle>Amenities</CardTitle>
                <CardDescription>
                  Servicios y características adicionales de la propiedad
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {formData.features.map((feature: string, index: number) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1"
                      >
                        {feature}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={() => handleFeatureRemove(feature)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <Input
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      placeholder="Agregar amenity..."
                      onKeyPress={(e) =>
                        e.key === "Enter" &&
                        (e.preventDefault(), handleFeatureAdd())
                      }
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleFeatureAdd}
                    >
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
                <CardDescription>
                  Agrega imágenes de la propiedad
                </CardDescription>
              </CardHeader>
              <CardContent>
                {/* Imágenes existentes al editar */}
                {property && existingItems.length > 0 && (
                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-2">
                      Imágenes actuales
                    </p>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {existingItems.map((item, index) => (
                        <div
                          key={item.mediaId}
                          className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-transparent"
                        >
                          <Image
                            src={`/api/propiedades/${property.id}/media/${item.mediaId}`}
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
                            onClick={() =>
                              setExistingItems((prev) =>
                                prev.filter((_, i) => i !== index)
                              )
                            }
                            aria-label={`Eliminar imagen existente ${
                              index + 1
                            }`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                <FileDropzone
                  onFilesSelected={handleFilesSelectedWithLimit}
                  accept={allowedTypes}
                  maxFiles={MAX_IMAGES}
                  className="mb-2"
                />
                {fileError && (
                  <p className="text-sm text-red-600 mt-2">{fileError}</p>
                )}
                <p className="text-sm text-muted-foreground mt-2">
                  {existingItems.length} existente(s) + {files.length} nueva(s)
                  (máx. 10)
                </p>

                {/* Thumbnails en memoria, similar a PropertyDetail */}
                {files.length > 0 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {previews.map((p, index) => (
                      <div
                        key={index}
                        className="relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 border-transparent"
                      >
                        <Image
                          src={p.url}
                          alt={`Preview ${index + 1}`}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
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
              <Button
                type="submit"
                disabled={submitting}
                className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              >
                {property ? "Actualizar Propiedad" : "Crear Propiedad"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
