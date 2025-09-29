import type { Images } from '@/lib/media'

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
    images: Images
    is_featured: boolean
}
