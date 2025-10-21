"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";
import { useSearchPropertyContext } from "@/contexts/search-property-context";
import { useConfig } from "@/contexts/config-context";

// Helper to generate price ranges from actual property prices
const generatePriceRanges = (
  properties: Array<{
    price: number;
    currency: string;
    operation_type: string;
  }>,
  currency: string,
  operationType: string
) => {
  // Filter properties by currency and operation type (case-insensitive)
  const filtered = properties.filter((p) => {
    const currencyMatch = p.currency?.toUpperCase() === currency.toUpperCase();
    const operationMatch =
      p.operation_type?.toLowerCase() === operationType?.toLowerCase();
    return currencyMatch && operationMatch;
  });

  console.log("Filtering price ranges:", {
    totalProperties: properties.length,
    currency,
    operationType,
    filteredCount: filtered.length,
    sample: filtered.slice(0, 2),
  });

  if (filtered.length === 0) {
    // Fallback to default ranges if no properties found
    return {
      min: [0],
      max: [999999999],
    };
  }

  const prices = filtered.map((p) => p.price).sort((a, b) => a - b);
  const minPrice = prices[0];
  const maxPrice = prices[prices.length - 1];

  // If all properties have the same price, return single value ranges
  if (minPrice === maxPrice) {
    return {
      min: [Math.floor(minPrice * 0.5)],
      max: [Math.ceil(minPrice * 1.5)],
    };
  }

  // Generate 5 intermediate values between min and max
  const range = maxPrice - minPrice;
  const step = range / 6; // 6 steps to get 5 intermediate values

  const minValues = [];
  const maxValues = [];

  for (let i = 1; i <= 5; i++) {
    const minValue = minPrice + step * i;
    const maxValue = minPrice + step * (i + 1);

    // Round nicely based on magnitude
    const roundTo =
      minValue > 1000000
        ? 100000
        : minValue > 100000
        ? 10000
        : minValue > 10000
        ? 1000
        : 100;

    minValues.push(Math.round(minValue / roundTo) * roundTo);
    maxValues.push(Math.round(maxValue / roundTo) * roundTo);
  }

  return {
    min: minValues,
    max: maxValues,
  };
};

export function PropertyFilters() {
  const { filters, setFilters, fetchProperties, isLoading, properties } =
    useSearchPropertyContext();
  const [showFilters, setShowFilters] = useState(false);
  const [allProperties, setAllProperties] = useState<Array<any>>([]);
  const { config } = useConfig();
  const typingTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Default currency to USD if not set
  const selectedCurrency = filters.currency || "USD";
  const selectedOperation = filters.operationType || "venta";

  // Fetch all properties to calculate price ranges
  useEffect(() => {
    const fetchAllProps = async () => {
      try {
        const response = await fetch("/api/propiedades");
        if (response.ok) {
          const data = await response.json();
          setAllProperties(data);
        }
      } catch (error) {
        console.error("Error fetching properties for price ranges:", error);
      }
    };
    fetchAllProps();
  }, []);

  // Get available currencies for selected operation type
  const availableCurrencies = useMemo(() => {
    const filtered = allProperties.filter(
      (p) =>
        p.operation_type?.toLowerCase() === selectedOperation?.toLowerCase()
    );
    const currencies = new Set(
      filtered.map((p) => p.currency?.toUpperCase()).filter(Boolean)
    );
    return Array.from(currencies);
  }, [allProperties, selectedOperation]);

  // Auto-select first available currency if current is not available
  useEffect(() => {
    if (
      availableCurrencies.length > 0 &&
      !availableCurrencies.includes(selectedCurrency)
    ) {
      setFilters((prev) => ({
        ...prev,
        currency: availableCurrencies[0],
        minPrice: undefined,
        maxPrice: undefined,
      }));
    }
  }, [availableCurrencies, selectedCurrency]);

  // Helper to format currency
  const formatPrice = (price: number, currency: string) => {
    const formatter = new Intl.NumberFormat("es-AR", {
      style: "decimal",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return `${currency} ${formatter.format(price)}`;
  };

  // Get dynamic price ranges based on actual properties
  const priceRanges = useMemo(() => {
    return generatePriceRanges(
      allProperties,
      selectedCurrency,
      selectedOperation
    );
  }, [allProperties, selectedCurrency, selectedOperation]);

  // Reset price filters when currency or operation type changes
  useEffect(() => {
    if (filters.minPrice || filters.maxPrice) {
      setFilters((prev) => ({
        ...prev,
        minPrice: undefined,
        maxPrice: undefined,
      }));
    }
  }, [selectedCurrency, selectedOperation]);

  useEffect(() => {
    // just to re-render when config changes
  }, [config]);

  const handleApplyFilters = () => {
    fetchProperties();
  };

  const handleSearchKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = (e.target as HTMLInputElement).value || "";
    const len = value.trim().length;
    if (typingTimeout.current) clearTimeout(typingTimeout.current);
    if (len === 0) {
      fetchProperties();
      return;
    }
    typingTimeout.current = setTimeout(() => {
      if (len > 3) {
        fetchProperties();
      }
    }, 800);
  };

  useEffect(() => {
    return () => {
      if (typingTimeout.current) clearTimeout(typingTimeout.current);
    };
  }, []);

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

      {/* Operation Type Buttons - Always Visible */}
      <div className="flex gap-3 mb-6">
        <Button
          variant={filters.operationType === "venta" ? "default" : "outline"}
          onClick={() => {
            const newFilters = {
              ...filters,
              operationType:
                filters.operationType === "venta" ? undefined : "venta",
            };
            setFilters(newFilters);
            fetchProperties(newFilters);
          }}
          className={
            filters.operationType === "venta"
              ? "bg-primary hover:bg-primary/90"
              : ""
          }
        >
          Venta
        </Button>
        <Button
          variant={filters.operationType === "alquiler" ? "default" : "outline"}
          onClick={() => {
            const newFilters = {
              ...filters,
              operationType:
                filters.operationType === "alquiler" ? undefined : "alquiler",
            };
            setFilters(newFilters);
            fetchProperties(newFilters);
          }}
          className={
            filters.operationType === "alquiler"
              ? "bg-primary hover:bg-primary/90"
              : ""
          }
        >
          Alquiler
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Ubicación
                </label>
                <Select
                  value={filters.location ?? ""}
                  onValueChange={(value) =>
                    setFilters({ ...filters, location: value })
                  }
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

              <div className="md:col-span-2 lg:col-span-4">
                <label className="text-sm font-medium text-foreground mb-3 block">
                  Tipo de Propiedad
                </label>
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
                    <div
                      key={type.value}
                      className="flex items-center space-x-2"
                    >
                      <Checkbox
                        id={`type-${type.value}`}
                        checked={filters.types?.includes(type.value) ?? false}
                        onCheckedChange={(checked) => {
                          const currentTypes = filters.types ?? [];
                          const newTypes = checked
                            ? [...currentTypes, type.value]
                            : currentTypes.filter((t) => t !== type.value);
                          setFilters({
                            ...filters,
                            types: newTypes.length > 0 ? newTypes : undefined,
                          });
                        }}
                        className="border-2 border-muted-foreground data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                      />
                      <Label
                        htmlFor={`type-${type.value}`}
                        className="text-sm cursor-pointer"
                      >
                        {type.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Moneda
                </label>
                <Select
                  value={selectedCurrency}
                  onValueChange={(value) =>
                    setFilters({
                      ...filters,
                      currency: value,
                      minPrice: undefined,
                      maxPrice: undefined,
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Moneda" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="USD"
                      disabled={!availableCurrencies.includes("USD")}
                    >
                      USD (Dólar){" "}
                      {!availableCurrencies.includes("USD") &&
                        "(No disponible)"}
                    </SelectItem>
                    <SelectItem
                      value="ARS"
                      disabled={!availableCurrencies.includes("ARS")}
                    >
                      ARS (Peso){" "}
                      {!availableCurrencies.includes("ARS") &&
                        "(No disponible)"}
                    </SelectItem>
                    <SelectItem
                      value="EUR"
                      disabled={!availableCurrencies.includes("EUR")}
                    >
                      EUR (Euro){" "}
                      {!availableCurrencies.includes("EUR") &&
                        "(No disponible)"}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Precio Mínimo
                </label>
                <Select
                  value={filters.minPrice ? String(filters.minPrice) : ""}
                  onValueChange={(value) =>
                    setFilters({ ...filters, minPrice: Number(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Precio mín." />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.min.map((price) => (
                      <SelectItem key={price} value={String(price)}>
                        {formatPrice(price, selectedCurrency)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Precio Máximo
                </label>
                <Select
                  value={filters.maxPrice ? String(filters.maxPrice) : ""}
                  onValueChange={(value) =>
                    setFilters({ ...filters, maxPrice: Number(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Precio máx." />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.max.map((price) => (
                      <SelectItem key={price} value={String(price)}>
                        {formatPrice(price, selectedCurrency)}+
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Dormitorios
                </label>
                <Select
                  value={filters.bedrooms ? String(filters.bedrooms) : ""}
                  onValueChange={(value) =>
                    setFilters({ ...filters, bedrooms: Number(value) })
                  }
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
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={handleApplyFilters}
              >
                Aplicar Filtros
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setFilters({ currency: "USD" });
                  // Asegura recarga inmediata con USD como moneda por defecto
                  fetchProperties({ currency: "USD" });
                }}
              >
                Limpiar Filtros
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
