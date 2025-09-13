export interface Project {
    id: string
    name: string
    description: string
    location: string
    status: string
    progress: number
    total_units: number
    available_units: number
    price_from: number
    price_to: number
    delivery_date: string
    amenities: string[]
    images: string[]
    is_featured: boolean
}