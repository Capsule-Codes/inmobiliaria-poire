"use client"

import { useEffect, useMemo, useState } from "react";
import { AdminRouteGuard } from "@/components/admin-route-guard";
import { AdminSidebar } from "@/components/admin-sidebar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Settings, Save, Home, Building, MapPin, Plus, X } from "lucide-react";

export type ConfigProps = {
  config: {
    availableLocations: string[];
    maxFeaturedProperties: number;
    maxFeaturedProjects: number;
    maxPropertiesPerSlide: number;
    maxProjectsPerSlide: number;
    companyName: string;
    companyEmail: string;
    companyPhone: string;
    companyAddress: string;
    siteTitle: string;
    siteDescription: string;
  };
};

export function ConfigManagement({ config }: ConfigProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newLocation, setNewLocation] = useState("");
  const [form, setForm] = useState(config);
  const [initial, setInitial] = useState(config);

  useEffect(() => {
    setForm(config);
    setInitial(config);
  }, [config]);

  const update = (field: keyof typeof form, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const addLocation = () => {
    const v = newLocation.trim();
    if (!v) return;
    if (form.availableLocations.includes(v)) return;
    update("availableLocations", [...form.availableLocations, v]);
    setNewLocation("");
  };

  const removeLocation = (loc: string) => {
    update(
      "availableLocations",
      form.availableLocations.filter((l) => l !== loc)
    );
  };

  const diffLocations = useMemo(() => {
    const toAdd = form.availableLocations.filter((l) => !initial.availableLocations.includes(l));
    const toRemove = initial.availableLocations.filter((l) => !form.availableLocations.includes(l));
    return { toAdd, toRemove };
  }, [form.availableLocations, initial.availableLocations]);

  const saveLocations = async () => {
    setSaving(true);
    try {
      await Promise.all([
        ...diffLocations.toAdd.map((v) =>
          fetch(`/api/admin/configs/available_locations`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: v, type: 'string' }),
          })
        ),
        ...diffLocations.toRemove.map((v) =>
          fetch(`/api/admin/configs/available_locations`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value: v }),
          })
        ),
      ]);
      setInitial((prev) => ({ ...prev, availableLocations: [...form.availableLocations] }));
    } finally {
      setSaving(false);
    }
  };

  const saveLimits = async () => {
    setSaving(true);
    try {
      await Promise.all([
        fetch(`/api/admin/configs/max_featured_properties`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: form.maxFeaturedProperties, type: 'int' }),
        }),
        fetch(`/api/admin/configs/max_featured_projects`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: form.maxFeaturedProjects, type: 'int' }),
        }),
        fetch(`/api/admin/configs/max_slide_properties`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: form.maxPropertiesPerSlide, type: 'int' }),
        }),
        fetch(`/api/admin/configs/max_slide_projects`, {
          method: 'PUT', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ value: form.maxProjectsPerSlide, type: 'int' }),
        }),
      ]);
      setInitial((prev) => ({
        ...prev,
        maxFeaturedProperties: form.maxFeaturedProperties,
        maxFeaturedProjects: form.maxFeaturedProjects,
        maxPropertiesPerSlide: form.maxPropertiesPerSlide,
        maxProjectsPerSlide: form.maxProjectsPerSlide,
      }));
    } finally {
      setSaving(false);
    }
  };

  const saveGeneral = async () => {
    setSaving(true);
    try {
      await Promise.all([
        fetch(`/api/admin/configs/company_name`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: form.companyName, type: 'string' }) }),
        fetch(`/api/admin/configs/company_email`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: form.companyEmail, type: 'string' }) }),
        fetch(`/api/admin/configs/company_phone`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: form.companyPhone, type: 'string' }) }),
        fetch(`/api/admin/configs/company_address`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: form.companyAddress, type: 'string' }) }),
      ]);
      setInitial((prev) => ({
        ...prev,
        companyName: form.companyName,
        companyEmail: form.companyEmail,
        companyPhone: form.companyPhone,
        companyAddress: form.companyAddress,
      }));
    } finally {
      setSaving(false);
    }
  };

  const saveSite = async () => {
    setSaving(true);
    try {
      await Promise.all([
        fetch(`/api/admin/configs/site_title`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: form.siteTitle, type: 'string' }) }),
        fetch(`/api/admin/configs/site_descripcion`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ value: form.siteDescription, type: 'string' }) }),
      ]);
      setInitial((prev) => ({ ...prev, siteTitle: form.siteTitle, siteDescription: form.siteDescription }));
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminRouteGuard>
      <div className="min-h-screen bg-background">
        <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} currentPage="configuracion" />

        <div className="lg:ml-64">
          <div className="p-6 lg:p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2 mt-8 md:mt-0">Configuración</h1>
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
                      onKeyDown={(e) => e.key === 'Enter' && addLocation()}
                    />
                    <Button onClick={addLocation} size="sm">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {form.availableLocations.map((location) => (
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
                  <Button className="w-full" onClick={saveLocations} disabled={saving}>
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
                      min={1}
                      value={form.maxFeaturedProperties}
                      onChange={(e) => update("maxFeaturedProperties", Number.parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-featured-projects">Máximo Emprendimientos Destacados</Label>
                    <Input
                      id="max-featured-projects"
                      type="number"
                      min={1}
                      value={form.maxFeaturedProjects}
                      onChange={(e) => update("maxFeaturedProjects", Number.parseInt(e.target.value) || 1)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-properties-slide">Propiedades por Slide (Desktop)</Label>
                    <Input
                      id="max-properties-slide"
                      type="number"
                      min={1}
                      max={4}
                      value={form.maxPropertiesPerSlide}
                      onChange={(e) => update("maxPropertiesPerSlide", Number.parseInt(e.target.value) || 3)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="max-projects-slide">Emprendimientos por Slide (Desktop)</Label>
                    <Input
                      id="max-projects-slide"
                      type="number"
                      min={1}
                      max={4}
                      value={form.maxProjectsPerSlide}
                      onChange={(e) => update("maxProjectsPerSlide", Number.parseInt(e.target.value) || 3)}
                    />
                  </div>
                  <Button className="w-full" onClick={saveLimits} disabled={saving}>
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
                    <Input id="company-name" value={form.companyName} onChange={(e) => update("companyName", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="company-email">Email de Contacto</Label>
                    <Input id="company-email" type="email" value={form.companyEmail} onChange={(e) => update("companyEmail", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="company-phone">Teléfono</Label>
                    <Input id="company-phone" value={form.companyPhone} onChange={(e) => update("companyPhone", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="company-address">Dirección</Label>
                    <Textarea id="company-address" value={form.companyAddress} onChange={(e) => update("companyAddress", e.target.value)} />
                  </div>
                  <Button className="w-full" onClick={saveGeneral} disabled={saving}>
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
                    <Input id="site-title" value={form.siteTitle} onChange={(e) => update("siteTitle", e.target.value)} />
                  </div>
                  <div>
                    <Label htmlFor="site-description">Descripción</Label>
                    <Textarea id="site-description" value={form.siteDescription} onChange={(e) => update("siteDescription", e.target.value)} />
                  </div>
                  <Button className="w-full" onClick={saveSite} disabled={saving}>
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
  );
}

