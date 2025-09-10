export interface Property {
    id: string
    title: string
    description: string
    price: number
    location: string
    type: string
    bedrooms: number
    bathrooms: number
    area: number
    features: string[]
    images: string[]
    is_featured: boolean
    status: string
    created_at: string
    updated_at: string
}