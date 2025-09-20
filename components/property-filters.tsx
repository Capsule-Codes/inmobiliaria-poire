"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Search, SlidersHorizontal } from "lucide-react"
import { useSearchPropertyContext } from "@/contexts/search-property-context"
import { useConfig } from "@/contexts/config-context"

export function PropertyFilters() {
  const { filters, setFilters, fetchProperties } = useSearchPropertyContext()
  const [showFilters, setShowFilters] = useState(false)
  const { config } = useConfig()

  useEffect(() => {
    // just to re-render when config changes
  }, [config])

  const handleApplyFilters = () => {
    fetchProperties()
  }

  return (
    <div className="mb-8">
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por ubicación, tipo de propiedad..."
            className="pl-10 h-12"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                <label className="text-sm font-medium text-foreground mb-2 block">Tipo de Propiedad</label>
                <Select
                  value={filters.type ?? ""}
                  onValueChange={(value) => setFilters({ ...filters, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="casa">Casa</SelectItem>
                    <SelectItem value="departamento">Departamento</SelectItem>
                    <SelectItem value="penthouse">Penthouse</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="loft">Loft</SelectItem>
                  </SelectContent>
                </Select>
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
              <Button variant="outline" onClick={() => setFilters({})}>
                Limpiar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
