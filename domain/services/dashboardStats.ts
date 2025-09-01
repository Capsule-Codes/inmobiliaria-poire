import 'server-only';
import { supabase } from "@/lib/supabase"

export type DashboardStats = {
    totalProperties: number
    featuredProperties: number
    totalProjects: number
    activeProjects: number
    totalViews: number
    monthlyGrowth: number
}

// Funciones de estadísticas para el dashboard
export async function getDashboardStats() {
    
    //TODO: En lugar de hacer un select y luego filtrar, se podira hacer el select count(*) group by
    
    const [propertiesResult, projectsResult] = await Promise.all([
        supabase.from("properties").select("id, type, status"),
        supabase.from("projects").select("id, status")
        //TODO: agregar consulta para las vistas        
    ])

    const properties = propertiesResult.data || []
    const projects = projectsResult.data || []

    // Calcular estadísticas
    const totalProperties = properties.length
    const featuredProperties = Math.round(totalProperties * 0.10) //TODO: Agregar lógica para obtener propiedades destacadas
    const totalProjects = projects.length
    const activeProjects = projects.filter((p) => p.status === "en-construccion").length
    const totalViews = Math.round(Math.random() * 1000) //TODO: Agregar lógica para obtener vistas reales


    return {
        totalProperties,
        featuredProperties,
        totalProjects,
        activeProjects,
        totalViews,
        monthlyGrowth: 0,
    } as DashboardStats
}
