import 'server-only';
import { supabase } from "@/lib/supabase";

type Contact = {
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
}

// Funciones para Contactos
export async function createContact(contact: Omit<Contact, "id" | "created_at" | "updated_at" | "status">) {

    const { data, error } = await supabase
        .from("contacts")
        .insert({ ...contact, status: "Pendiente" })
        .select()
        .single()

    if (error) {
        console.error('Error creating contact:', error);
        throw error
    }

    console.log('Contact created:', data);

    return data as Contact
}

export async function getContacts(filters?: {
    status?: string
    inquiry_type?: string
}) {

    let query = supabase.from("contacts").select("*")

    if (filters?.status) {
        query = query.eq("status", filters.status)
    }
    if (filters?.inquiry_type) {
        query = query.eq("inquiry_type", filters.inquiry_type)
    }

    const { data, error } = await query.order("created_at", { ascending: false })

    if (error) throw error
    return data as Contact[]
}

export async function updateContactStatus(id: string, status: string) {

    const { data, error } = await supabase
        .from("contacts")
        .update({ status, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

    if (error) throw error
    return data as Contact
}