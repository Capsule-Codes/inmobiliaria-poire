"use client";

import { Property } from "@/types/Property";
import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

export type SearchPropertyFilters = {
  search?: string | undefined;
  type?: string | undefined;
  types?: string[] | undefined;
  operationType?: string | undefined;
  location?: string | undefined;
  currency?: string | undefined;
  minPrice?: number | undefined;
  maxPrice?: number | undefined;
  bedrooms?: number | undefined;
};

interface SearchPropertyContextType {
  filters: SearchPropertyFilters;
  setFilters: React.Dispatch<React.SetStateAction<SearchPropertyFilters>>;
  properties: Property[];
  isLoading: boolean;
  currentPage: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  totalPages: number;
  currentProperties: {
    data: Property[];
    startIndex: number;
    perPage: number;
  };
  fetchProperties: (override?: SearchPropertyFilters) => Promise<void>;
}

const SearchPropertyContext = createContext<SearchPropertyContextType | null>(
  null
);

export function SearchPropertyProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<SearchPropertyFilters>({
    currency: "USD",
  });
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const propertiesPerPage = 6;

  const searchProperties = async (override?: SearchPropertyFilters) => {
    try {
      setIsLoading(true);
      const activeFilters = override ?? filters;
      const queryParams = new URLSearchParams(
        Object.entries(activeFilters)
          .filter(([_, v]) => v !== undefined && v !== null && v !== "")
          .reduce<Record<string, string>>((acc, [key, value]) => {
            acc[key] = String(value);
            return acc;
          }, {})
      ).toString();
      const response = await fetch(`/api/propiedades?${queryParams}`);

      if (response.status !== 200) {
        setProperties([]);
        return;
      }

      const data = await response.json();
      setProperties(data);
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      setProperties([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    searchProperties();
  }, []);

  const totalPages = Math.ceil(properties.length / propertiesPerPage);
  const startIndex = (currentPage - 1) * propertiesPerPage;
  const currentProperties = {
    data: properties.slice(startIndex, startIndex + propertiesPerPage),
    startIndex,
    perPage: propertiesPerPage,
  };

  return (
    <SearchPropertyContext.Provider
      value={{
        filters,
        setFilters,
        properties,
        isLoading,
        currentPage,
        setCurrentPage,
        totalPages,
        currentProperties,
        fetchProperties: searchProperties,
      }}
    >
      {children}
    </SearchPropertyContext.Provider>
  );
}

export function useSearchPropertyContext() {
  const context = useContext(SearchPropertyContext);
  if (!context) {
    throw new Error(
      "usePropertyContext debe estar dentro de un <SearchPropertyProvider/>"
    );
  }
  return context;
}
