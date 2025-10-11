"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Search, SlidersHorizontal, Loader2 } from "lucide-react"
import { useSearchPropertyContext } from "@/contexts/search-property-context"
import { useConfig } from "@/contexts/config-context"

export function PropertyFilters() {
  const { filters, setFilters, fetchProperties, isLoading } = useSearchPropertyContext()
  const [showFilters, setShowFilters] = useState(false)
  const { config } = useConfig()
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    // just to re-render when config changes
  }, [config])

  const handleApplyFilters = () => {
    fetchProperties()
  }

  const handleSearchKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value || ""
    const len = value.trim().length
    if (typingTimeout.current) clearTimeout(typingTimeout.current)
    if (len === 0) {
      fetchProperties()
      return
    }
    typingTimeout.current = setTimeout(() => {
      if (len > 3) {
        fetchProperties()
      }
    }, 800)
  }

  useEffect(() => {
    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current)
    }
  }, [])

  return (
    <div className="mb-8">
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por ubicación, tipo de propiedad..."
            className="pl-10 h-12"
            value={filters.search ?? ""}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            onKeyUp={handleSearchKeyUp}
          />
          {isLoading && (
            <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 animate-spin" />
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => setShowFilters(!showFilters)}
          className="h-12 px-6 border-accent text-accent hover:bg-accent hover:text-accent-foreground"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          Filtros
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Ubicación</label>
                <Select
                  value={filters.location ?? ""}
                  onValueChange={(value) => setFilters({ ...filters, location: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar ubicación" />
                  </SelectTrigger>
                  <SelectContent>
                    {config.availableLocations.map((location) => (
                      <SelectItem key={location} value={location.toLowerCase()}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Operación</label>
                <Select
                  value={filters.operationType ?? ""}
                  onValueChange={(value) => setFilters({ ...filters, operationType: value || undefined })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Alquiler o Venta" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="venta">Venta</SelectItem>
                    <SelectItem value="alquiler">Alquiler</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="md:col-span-2 lg:col-span-4">
                <label className="text-sm font-medium text-foreground mb-3 block">Tipo de Propiedad</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: "casa", label: "Casa" },
                    { value: "departamento", label: "Departamento" },
                    { value: "edificio", label: "Edificio" },
                    { value: "galpon", label: "Galpón" },
                    { value: "cochera", label: "Cochera" },
                    { value: "local", label: "Local comercial" },
                    { value: "oficina", label: "Oficina" },
                    { value: "lote", label: "Lote" },
                  ].map((type) => (
                    <div key={type.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={`type-${type.value}`}
                        checked={filters.types?.includes(type.value) ?? false}
                        onCheckedChange={(checked) => {
                          const currentTypes = filters.types ?? []
                          const newTypes = checked
                            ? [...currentTypes, type.value]
                            : currentTypes.filter((t) => t !== type.value)
                          setFilters({ ...filters, types: newTypes.length > 0 ? newTypes : undefined })
                        }}
                        className="border-2 border-muted-foreground data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                      />
                      <Label htmlFor={`type-${type.value}`} className="text-sm cursor-pointer">
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Precio Mínimo</label>
                <Select
                  value={filters.minPrice ? String(filters.minPrice) : ""}
                  onValueChange={(value) => setFilters({ ...filters, minPrice: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Precio mín." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="100000">USD 100.000</SelectItem>
                    <SelectItem value="300000">USD 300.000</SelectItem>
                    <SelectItem value="500000">USD 500.000</SelectItem>
                    <SelectItem value="800000">USD 800.000</SelectItem>
                    <SelectItem value="1000000">USD 1.000.000</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Precio Máximo</label>
                <Select
                  value={filters.maxPrice ? String(filters.maxPrice) : ""}
                  onValueChange={(value) => setFilters({ ...filters, maxPrice: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Precio máx." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="500000">USD 500.000</SelectItem>
                    <SelectItem value="800000">USD 800.000</SelectItem>
                    <SelectItem value="1000000">USD 1.000.000</SelectItem>
                    <SelectItem value="1500000">USD 1.500.000</SelectItem>
                    <SelectItem value="2000000">USD 2.000.000+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Dormitorios</label>
                <Select
                  value={filters.bedrooms ? String(filters.bedrooms) : ""}
                  onValueChange={(value) => setFilters({ ...filters, bedrooms: Number(value) })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Dormitorios" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-4 mt-6">
              <Button className="bg-primary hover:bg-primary/90" onClick={handleApplyFilters}>
                Aplicar Filtros
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({})
                  // Asegura recarga inmediata sin filtros
                  fetchProperties({})
                }}
              >
                Limpiar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
