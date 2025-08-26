export interface FeaturedProperty {
  id: number
  title: string
  location: string
  price: string
  bedrooms: number
  bathrooms: number
  area: number
  image: string
  featured: boolean
}

export interface FeaturedProject {
  id: number
  title: string
  location: string
  priceFrom: string
  status: string
  progress: number
  deliveryDate: string
  totalUnits: number
  availableUnits: number
  image: string
  featured: boolean
}

// Store centralizado para propiedades destacadas
export const featuredPropertiesStore = {
  properties: [
    {
      id: 1,
      title: "Casa Moderna en Palermo",
      location: "Palermo, Buenos Aires",
      price: "USD 850.000",
      bedrooms: 4,
      bathrooms: 3,
      area: 280,
      image: "/modern-house-exterior.png",
      featured: true,
    },
    {
      id: 2,
      title: "Penthouse con Vista al Río",
      location: "Puerto Madero, Buenos Aires",
      price: "USD 1.200.000",
      bedrooms: 3,
      bathrooms: 2,
      area: 180,
      image: "/luxury-penthouse-interior.png",
      featured: true,
    },
    {
      id: 3,
      title: "Villa de Lujo en Nordelta",
      location: "Nordelta, Buenos Aires",
      price: "USD 950.000",
      bedrooms: 5,
      bathrooms: 4,
      area: 350,
      image: "/luxury-villa-pool-garden.png",
      featured: true,
    },
    {
      id: 4,
      title: "Departamento Premium en Recoleta",
      location: "Recoleta, Buenos Aires",
      price: "USD 720.000",
      bedrooms: 3,
      bathrooms: 2,
      area: 150,
      image: "/elegant-apartment-living.png",
      featured: true,
    },
    {
      id: 5,
      title: "Loft Industrial en San Telmo",
      location: "San Telmo, Buenos Aires",
      price: "USD 480.000",
      bedrooms: 2,
      bathrooms: 1,
      area: 120,
      image: "/industrial-loft-design.png",
      featured: true,
    },
    {
      id: 6,
      title: "Casa Familiar en Belgrano",
      location: "Belgrano, Buenos Aires",
      price: "USD 680.000",
      bedrooms: 4,
      bathrooms: 3,
      area: 220,
      image: "/family-house-garden.png",
      featured: true,
    },
    {
      id: 7,
      title: "Duplex con Terraza en Núñez",
      location: "Núñez, Buenos Aires",
      price: "USD 590.000",
      bedrooms: 3,
      bathrooms: 2,
      area: 160,
      image: "/duplex-penthouse-terrace.png",
      featured: true,
    },
    {
      id: 8,
      title: "Apartamento Moderno en Barracas",
      location: "Barracas, Buenos Aires",
      price: "USD 420.000",
      bedrooms: 2,
      bathrooms: 2,
      area: 95,
      image: "/modern-apartment-kitchen.png",
      featured: true,
    },
    {
      id: 9,
      title: "Casa Colonial en San Isidro",
      location: "San Isidro, Buenos Aires",
      price: "USD 780.000",
      bedrooms: 4,
      bathrooms: 3,
      area: 300,
      image: "/colonial-house-patio.png",
      featured: true,
    },
  ] as FeaturedProperty[],

  getFeaturedProperties: () => {
    return featuredPropertiesStore.properties.filter((p) => p.featured)
  },

  toggleFeatured: (id: number) => {
    const property = featuredPropertiesStore.properties.find((p) => p.id === id)
    if (property) {
      property.featured = !property.featured
    }
  },
}
