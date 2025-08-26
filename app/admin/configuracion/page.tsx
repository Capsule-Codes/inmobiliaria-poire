"use client"

import { AdminRouteGuard } from "@/components/admin-route-guard"
import { AdminSidebar } from "@/components/admin-sidebar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Settings, Save, Home, Building, MapPin, Plus, X } from "lucide-react"
import { useState, useEffect } from "react"
import { configStore, type SiteConfig } from "@/lib/config-store"

export default function ConfiguracionPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [config, setConfig] = useState<SiteConfig>(configStore.getConfig())
  const [saving, setSaving] = useState(false)
  const [newLocation, setNewLocation] = useState("")

  useEffect(() => {
    const unsubscribe = configStore.subscribe(() => {
      setConfig(configStore.getConfig())
    })
    return unsubscribe
  }, [])

  const handleSave = async (section: "general" | "site" | "limits" | "locations") => {
    setSaving(true)
    try {
      configStore.updateConfig(config)
      // Simular delay de guardado
      await new Promise((resolve) => setTimeout(resolve, 500))
    } finally {
      setSaving(false)
    }
  }

  const updateConfig = (field: keyof SiteConfig, value: string | number | string[]) => {
    setConfig((prev) => ({ ...prev, [field]: value }))
  }

  const addLocation = () => {
    if (newLocation.trim() && !config.availableLocations.includes(newLocation.trim())) {
      const updatedLocations = [...config.availableLocations, newLocation.trim()]
      updateConfig("availableLocations", updatedLocations)
      setNewLocation("")
    }
  }

  const removeLocation = (locationToRemove: string) => {
    const updatedLocations = config.availableLocations.filter((loc) => loc !== locationToRemove)
    updateConfig("availableLocations", updatedLocations)
  }

  return (
    <AdminRouteGuard>
      <div className="min-h-screen bg-background">
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} currentPage="configuracion" />

        <div className="lg:ml-64">
          <div className="p-6 lg:p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Configuración</h1>
              <p className="text-muted-foreground">Ajusta la configuración general del sitio</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5" />
                    Ubicaciones Disponibles
                  </CardTitle>
                  <CardDescription>Gestiona las ubicaciones que aparecen en los filtros</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Nueva ubicación..."
                      value={newLocation}
                      onChange={(e) => setNewLocation(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && addLocation()}
                    />
                    <Button onClick={addLocation} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {config.availableLocations.map((location) => (
                      <div key={location} className="flex items-center justify-between p-2 bg-muted rounded-md">
                        <span className="text-sm">{location}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeLocation(location)}
                          className="h-6 w-6 p-0 hover:bg-destructive hover:text-destructive-foreground"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full" onClick={() => handleSave("locations")} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Guardando..." : "Guardar Ubicaciones"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Home className="h-5 w-5" />
                    Límites de Contenido
                  </CardTitle>
                  <CardDescription>Controla cuántos elementos se muestran en cada sección</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="max-featured-properties">Máximo Propiedades Destacadas</Label>
                    <Input
                      id="max-featured-properties"
                      type="number"
                      min="3"
                      max="12"
                      value={config.maxFeaturedProperties}
                      onChange={(e) => updateConfig("maxFeaturedProperties", Number.parseInt(e.target.value) || 9)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Recomendado: múltiplo de 3 (3, 6, 9, 12)</p>
                  </div>
                  <div>
                    <Label htmlFor="max-featured-projects">Máximo Emprendimientos Destacados</Label>
                    <Input
                      id="max-featured-projects"
                      type="number"
                      min="3"
                      max="12"
                      value={config.maxFeaturedProjects}
                      onChange={(e) => updateConfig("maxFeaturedProjects", Number.parseInt(e.target.value) || 9)}
                    />
                    <p className="text-xs text-muted-foreground mt-1">Recomendado: múltiplo de 3 (3, 6, 9, 12)</p>
                  </div>
                  <div>
                    <Label htmlFor="max-properties-slide">Propiedades por Slide (Desktop)</Label>
                    <Input
                      id="max-properties-slide"
                      type="number"
                      min="1"
                      max="4"
                      value={config.maxPropertiesPerSlide}
                      onChange={(e) => updateConfig("maxPropertiesPerSlide", Number.parseInt(e.target.value) || 3)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-projects-slide">Emprendimientos por Slide (Desktop)</Label>
                    <Input
                      id="max-projects-slide"
                      type="number"
                      min="1"
                      max="4"
                      value={config.maxProjectsPerSlide}
                      onChange={(e) => updateConfig("maxProjectsPerSlide", Number.parseInt(e.target.value) || 3)}
                    />
                  </div>
                  <Button className="w-full" onClick={() => handleSave("limits")} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Guardando..." : "Guardar Límites"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Información General
                  </CardTitle>
                  <CardDescription>Datos básicos de la inmobiliaria</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="company-name">Nombre de la Empresa</Label>
                    <Input
                      id="company-name"
                      value={config.companyName}
                      onChange={(e) => updateConfig("companyName", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company-email">Email de Contacto</Label>
                    <Input
                      id="company-email"
                      type="email"
                      value={config.companyEmail}
                      onChange={(e) => updateConfig("companyEmail", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company-phone">Teléfono</Label>
                    <Input
                      id="company-phone"
                      value={config.companyPhone}
                      onChange={(e) => updateConfig("companyPhone", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="company-address">Dirección</Label>
                    <Textarea
                      id="company-address"
                      value={config.companyAddress}
                      onChange={(e) => updateConfig("companyAddress", e.target.value)}
                    />
                  </div>
                  <Button className="w-full" onClick={() => handleSave("general")} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Guardando..." : "Guardar Información"}
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Configuración del Sitio
                  </CardTitle>
                  <CardDescription>Ajustes de visualización y SEO</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="site-title">Título del Sitio</Label>
                    <Input
                      id="site-title"
                      value={config.siteTitle}
                      onChange={(e) => updateConfig("siteTitle", e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="site-description">Descripción</Label>
                    <Textarea
                      id="site-description"
                      value={config.siteDescription}
                      onChange={(e) => updateConfig("siteDescription", e.target.value)}
                    />
                  </div>
                  <Button className="w-full" onClick={() => handleSave("site")} disabled={saving}>
                    <Save className="h-4 w-4 mr-2" />
                    {saving ? "Guardando..." : "Guardar Configuración"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AdminRouteGuard>
  )
}
