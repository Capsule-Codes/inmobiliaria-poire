import "server-only";
import { supabase } from "@/lib/supabase";
import type { Images } from "@/lib/media";
import type { Property as PropertyType } from "@/types/Property";

type Property = PropertyType & { created_at: string; updated_at: string };

// Funciones para Propiedades

// For admin panel - gets ALL properties regardless of status
export async function getAllProperties() {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Property[];
}

// For public view - only gets available properties
export async function getProperties(filters?: {
  type?: string;
  minPrice?: number;
  maxPrice?: number;
  location?: string;
  bedrooms?: number;
  search?: string;
}) {
  let query = supabase
    .from("properties")
    .select("*")
    .eq("status", "Disponible");

  if (filters?.type) {
    query = query.eq("type", filters.type);
  }
  if (filters?.minPrice) {
    query = query.gte("price", filters.minPrice);
  }
  if (filters?.maxPrice) {
    query = query.lte("price", filters.maxPrice);
  }
  if (filters?.location) {
    query = query.ilike("location", `%${filters.location}%`);
  }
  if (filters?.bedrooms) {
    query = query.eq("bedrooms", filters.bedrooms);
  }
  if (filters?.search) {
    const safeSearch = String(filters.search).replace(/"/g, '\\"');
    query = query.or(
      `type.ilike."%${safeSearch}%",location.ilike."%${safeSearch}%"`
    );
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw error;
  return data as Property[];
}

export async function getFeaturedProperties() {
  const { data: featuredData, error: featuredError } = await supabase
    .from("properties")
    .select("*")
    .eq("is_featured", true)
    .eq("status", "Disponible")
    .order("created_at", { ascending: false })
    .limit(9);

  if (featuredError) throw featuredError;

  if (featuredData && featuredData.length > 0) {
    return featuredData as Property[];
  }

  const { data: latestData, error: latestError } = await supabase
    .from("properties")
    .select("*")
    .eq("status", "Disponible")
    .order("created_at", { ascending: false })
    .limit(3);

  if (latestError) throw latestError;
  return latestData as Property[];
}

export async function getPropertyById(id: string) {
  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Property;
}

export async function createProperty(
  property: Omit<Property, "id" | "created_at" | "updated_at">
) {
  const { data, error } = await supabase
    .from("properties")
    .insert(property)
    .select()
    .single();

  if (error) throw error;
  return data as Property;
}

export async function updateProperty(id: string, updates: Partial<Property>) {
  const { data, error } = await supabase
    .from("properties")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Property;
}

export async function deleteProperty(id: string) {
  // First, delete all contacts associated with this property
  const { error: contactsError } = await supabase
    .from("contacts")
    .delete()
    .eq("property_id", id);

  if (contactsError) {
    console.error("Error deleting associated contacts:", contactsError);
    // Continue anyway to try to delete the property
  }

  // Then delete the property
  const { error } = await supabase.from("properties").delete().eq("id", id);

  if (error) throw error;
}

export async function getRelatedProperties(id: string) {
  const currentProperty = await getPropertyById(id);

  if (!currentProperty) {
    throw new Error("Propiedad no encontrada");
  }

  const safeLocation = String(currentProperty.location).replace(/"/g, '\\"');

  const { data, error } = await supabase
    .from("properties")
    .select("*")
    .neq("id", id)
    .or(`bedrooms.eq.${currentProperty.bedrooms},location.eq."${safeLocation}"`)
    .limit(3);

  if (error) throw error;

  return data as Property[];
}

export async function getPropertyImages(
  propertyId: string
): Promise<Images | null> {
  const { data, error } = await supabase
    .from("properties")
    .select("images")
    .eq("id", propertyId)
    .single();
  if (error) throw error;
  return data?.images ?? null;
}
