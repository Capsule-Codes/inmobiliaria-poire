import 'server-only';
import { supabase } from "@/lib/supabase";

type Property = {
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

// Funciones para Propiedades
export async function getProperties(filters?: {
    type?: string
    minPrice?: number
    maxPrice?: number
    location?: string
    bedrooms?: number
}) {    

    let query = supabase.from("properties").select("*").eq("status", "available")

    if (filters?.type) {
        query = query.eq("type", filters.type)
    }
    if (filters?.minPrice) {
        query = query.gte("price", filters.minPrice)
    }
    if (filters?.maxPrice) {
        query = query.lte("price", filters.maxPrice)
    }
    if (filters?.location) {
        query = query.ilike("location", `%${filters.location}%`)
    }
    if (filters?.bedrooms) {
        query = query.eq("bedrooms", filters.bedrooms)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error
    return data as Property[]
}

export async function getFeaturedProperties() {

    const { data, error } = await supabase
        .from("properties")
        .select("*")
        .eq("is_featured", true)
        .eq("status", "available")
        .order("created_at", { ascending: false })
        .limit(9)

    if (error) throw error
    return data as Property[]
}

export async function getPropertyById(id: string) {

    const { data, error } = await supabase.from("properties").select("*").eq("id", id).single()

    if (error) throw error
    return data as Property
}

export async function createProperty(property: Omit<Property, "id" | "created_at" | "updated_at">) {

    const { data, error } = await supabase.from("properties").insert(property).select().single()

    if (error) throw error
    return data as Property
}

export async function updateProperty(id: string, updates: Partial<Property>) {

    const { data, error } = await supabase
        .from("properties")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

    if (error) throw error
    return data as Property
}

export async function deleteProperty(id: string) {

    const { error } = await supabase.from("properties").delete().eq("id", id)

    if (error) throw error
}