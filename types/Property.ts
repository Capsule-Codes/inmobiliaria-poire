import type { Images } from '@/lib/media'

export interface Property {
    id: string
    title: string
    description: string
    price: number
    currency: string
    location: string
    address: string
    type: string
    operation_type: string
    bedrooms: number
    bathrooms: number
    area: number
    features: string[]
    images: Images
    is_featured: boolean
    status: string
}
