import { createClient } from "./supabase"

export type Property = {
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

export type Project = {
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
  created_at: string
  updated_at: string
}

export type Contact = {
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

// Funciones para Propiedades
export async function getProperties(filters?: {
  type?: string
  minPrice?: number
  maxPrice?: number
  location?: string
}) {
  const supabase = createClient()
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

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) throw error
  return data as Property[]
}

export async function getFeaturedProperties() {
  const supabase = createClient()
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
  const supabase = createClient()
  const { data, error } = await supabase.from("properties").select("*").eq("id", id).single()

  if (error) throw error
  return data as Property
}

export async function createProperty(property: Omit<Property, "id" | "created_at" | "updated_at">) {
  const supabase = createClient()
  const { data, error } = await supabase.from("properties").insert(property).select().single()

  if (error) throw error
  return data as Property
}

export async function updateProperty(id: string, updates: Partial<Property>) {
  const supabase = createClient()
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
  const supabase = createClient()
  const { error } = await supabase.from("properties").delete().eq("id", id)

  if (error) throw error
}

// Funciones para Emprendimientos
export async function getProjects(filters?: {
  status?: string
  location?: string
}) {
  const supabase = createClient()
  let query = supabase.from("projects").select("*")

  if (filters?.status) {
    query = query.eq("status", filters.status)
  }
  if (filters?.location) {
    query = query.ilike("location", `%${filters.location}%`)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) throw error
  return data as Project[]
}

export async function getFeaturedProjects() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(6)

  if (error) throw error
  return data as Project[]
}

export async function getProjectById(id: string) {
  const supabase = createClient()
  const { data, error } = await supabase.from("projects").select("*").eq("id", id).single()

  if (error) throw error
  return data as Project
}

export async function createProject(project: Omit<Project, "id" | "created_at" | "updated_at">) {
  const supabase = createClient()
  const { data, error } = await supabase.from("projects").insert(project).select().single()

  if (error) throw error
  return data as Project
}

export async function updateProject(id: string, updates: Partial<Project>) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("projects")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data as Project
}

export async function deleteProject(id: string) {
  const supabase = createClient()
  const { error } = await supabase.from("projects").delete().eq("id", id)

  if (error) throw error
}

// Funciones para Contactos
export async function createContact(contact: Omit<Contact, "id" | "created_at" | "updated_at" | "status">) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from("contacts")
    .insert({ ...contact, status: "new" })
    .select()
    .single()

  if (error) throw error
  return data as Contact
}

export async function getContacts(filters?: {
  status?: string
  inquiry_type?: string
}) {
  const supabase = createClient()
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
  const supabase = createClient()
  const { data, error } = await supabase
    .from("contacts")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single()

  if (error) throw error
  return data as Contact
}

// Funciones de estadísticas para el dashboard
export async function getDashboardStats() {
  const supabase = createClient()

  const [propertiesResult, projectsResult, contactsResult] = await Promise.all([
    supabase.from("properties").select("id, type, status"),
    supabase.from("projects").select("id, status"),
    supabase.from("contacts").select("id, status, created_at"),
  ])

  const properties = propertiesResult.data || []
  const projects = projectsResult.data || []
  const contacts = contactsResult.data || []

  // Calcular estadísticas
  const totalProperties = properties.length
  const availableProperties = properties.filter((p) => p.status === "available").length
  const totalProjects = projects.length
  const activeProjects = projects.filter((p) => p.status === "en-construccion").length
  const totalContacts = contacts.length
  const newContacts = contacts.filter((c) => c.status === "new").length

  // Contactos del último mes
  const lastMonth = new Date()
  lastMonth.setMonth(lastMonth.getMonth() - 1)
  const recentContacts = contacts.filter((c) => new Date(c.created_at) > lastMonth).length

  return {
    totalProperties,
    availableProperties,
    totalProjects,
    activeProjects,
    totalContacts,
    newContacts,
    recentContacts,
  }
}
