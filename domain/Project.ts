import 'server-only';
import { supabase } from "@/lib/supabase";
import type { Images } from '@/lib/media'
import type { Project as ProjectType } from '@/types/project'

type Project = ProjectType & { created_at: string; updated_at: string }

// Funciones para Emprendimientos
export async function getProjects(filters?: {
    status?: string
    location?: string
}) {

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

    const { data, error } = await supabase.from("projects").select("*").eq("id", id).single()

    if (error) throw error
    return data as Project
}

export async function createProject(project: Omit<Project, "id" | "created_at" | "updated_at">) {

    const { data, error } = await supabase.from("projects").insert(project).select().single()

    if (error) throw error
    return data as Project
}

export async function updateProject(id: string, updates: Partial<Project>) {

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
    // First, delete all contacts associated with this project
    const { error: contactsError } = await supabase
        .from("contacts")
        .delete()
        .eq("project_id", id)

    if (contactsError) {
        console.error("Error deleting associated contacts:", contactsError)
        // Continue anyway to try to delete the project
    }

    // Then delete the project
    const { error } = await supabase.from("projects").delete().eq("id", id)

    if (error) throw error
}

export async function getProjectImages(projectId: string): Promise<Images | null> {
  const { data, error } = await supabase
    .from('projects')
    .select('images')
    .eq('id', projectId)
    .single();
  if (error) throw error;
  return data?.images ?? null;
}
