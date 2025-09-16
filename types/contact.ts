export interface Contact {
    id: string
    name: string
    email: string
    phone?: string
    message: string
    inquiry_type: string
    property_id?: string
    project_id?: string
    status: string
    created_at: string
    updated_at: string
    service: string
    propertyType: string
    location: string
    budget: string
    newsletter: boolean
}