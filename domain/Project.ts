import "server-only";
import { supabase } from "@/lib/supabase";
import type { Images } from "@/lib/media";
import type { Project as ProjectType } from "@/types/project";

type Project = ProjectType & { created_at: string; updated_at: string };

// Funciones para Emprendimientos
export async function getProjects(filters?: {
  status?: string;
  location?: string;
}) {
  let query = supabase.from("projects").select("*");

  if (filters?.status) {
    query = query.eq("status", filters.status);
  }
  if (filters?.location) {
    query = query.ilike("location", `%${filters.location}%`);
  }

  const { data, error } = await query.order("created_at", { ascending: false });

  if (error) throw error;
  return data as Project[];
}

export async function getFeaturedProjects() {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) throw error;
  return data as Project[];
}

export async function getProjectById(id: string) {
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data as Project;
}

export async function createProject(
  project: Omit<Project, "id" | "created_at" | "updated_at">
) {
  const { data, error } = await supabase
    .from("projects")
    .insert(project)
    .select()
    .single();

  if (error) throw error;
  return data as Project;
}

export async function updateProject(id: string, updates: Partial<Project>) {
  const { data, error } = await supabase
    .from("projects")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data as Project;
}

export async function deleteProject(id: string) {
  // First, get project to access images
  let projectImages: Images | null = null;
  try {
    const project = await getProjectById(id);
    projectImages = project.images;
  } catch (err) {
    console.error("Error fetching project for deletion:", err);
  }

  // Delete all contacts associated with this project
  const { error: contactsError } = await supabase
    .from("contacts")
    .delete()
    .eq("project_id", id);

  if (contactsError) {
    console.error("Error deleting associated contacts:", contactsError);
    // Continue anyway to try to delete the project
  }

  // Delete the project from database
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) throw error;

  // Delete images from Azure Storage (best effort, don't fail if this fails)
  if (
    projectImages &&
    typeof projectImages === "object" &&
    "items" in projectImages
  ) {
    try {
      const { getContainerClient } = await import("@/lib/azure");
      const container = getContainerClient();

      for (const item of projectImages.items) {
        try {
          const blobClient = container.getBlobClient(item.blobKey);
          await blobClient.deleteIfExists();
          console.log(`Deleted blob: ${item.blobKey}`);
        } catch (blobError) {
          console.error(`Failed to delete blob ${item.blobKey}:`, blobError);
          // Continue deleting other images
        }
      }
    } catch (azureError) {
      console.error("Error deleting images from Azure:", azureError);
      // Project is already deleted from DB, just log the error
    }
  }
}

export async function getProjectImages(
  projectId: string
): Promise<Images | null> {
  const { data, error } = await supabase
    .from("projects")
    .select("images")
    .eq("id", projectId)
    .single();
  if (error) throw error;
  return data?.images ?? null;
}
