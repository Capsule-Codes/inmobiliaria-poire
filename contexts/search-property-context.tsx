"use client"

import { Property } from "@/types/Property"
import { ReactNode, createContext, useContext, useState, useEffect } from "react"

export type SearchPropertyFilters = {
  search?: string
  type?: string | undefined
  location?: string | undefined
  minPrice?: number | undefined
  maxPrice?: number | undefined
  bedrooms?: number | undefined
}

interface SearchPropertyContextType {
  filters: SearchPropertyFilters
  setFilters: React.Dispatch<React.SetStateAction<SearchPropertyFilters>>
  properties: Property[]
  currentPage: number
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>
  totalPages: number
  currentProperties: {
    data: any[]
    startIndex: number
    perPage: number
  }
  fetchProperties: () => Promise<void>
}

const SearchPropertyContext = createContext<SearchPropertyContextType | null>(null)

export function SearchPropertyProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState({})
  const [properties, setProperties] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const propertiesPerPage = 6

  const searchProperties = async () => {
    try {
      const queryParams = new URLSearchParams(filters).toString()
      const response = await fetch(`/api/propiedades?${queryParams}`)

      if (response.status !== 200) {
        setProperties([]);
        return;
      }

      const data = await response.json()
      setProperties(data)
    } catch (error) {
      console.error("Failed to fetch properties:", error);
      setProperties([]);
    }
  }

  useEffect(() => {
    searchProperties()
  }, [])

  const totalPages = Math.ceil(properties.length / propertiesPerPage)
  const startIndex = (currentPage - 1) * propertiesPerPage
  const currentProperties = {
    data: properties.slice(startIndex, startIndex + propertiesPerPage),
    startIndex,
    perPage: propertiesPerPage,
  }

  return (
    <SearchPropertyContext.Provider
      value={{
        filters,
        setFilters,
        properties,
        currentPage,
        setCurrentPage,
        totalPages,
        currentProperties,
        fetchProperties: searchProperties,
      }}
    >
      {children}
    </SearchPropertyContext.Provider>
  )
}


export function useSearchPropertyContext() {
  const context = useContext(SearchPropertyContext)
  if (!context) {
    throw new Error("usePropertyContext debe estar dentro de un <SearchPropertyProvider/>")
  }
  return context
}