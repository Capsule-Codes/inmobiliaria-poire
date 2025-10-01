import "server-only"
import { supabase } from "@/lib/supabase"

export type RecentActivityItem = {
    id: string
    action: string
    item: string
    time: string
}

export type DashboardStats = {
    totalProperties: number
    featuredProperties: number
    totalProjects: number
    activeProjects: number
    totalViews: number
    monthlyGrowth: number
    recentActivity: RecentActivityItem[]
}

const relativeTimeFormatter = new Intl.RelativeTimeFormat("es", { numeric: "auto" })

const TIME_DIVISIONS: { amount: number; unit: Intl.RelativeTimeFormatUnit }[] = [
    { amount: 60, unit: "second" },
    { amount: 60, unit: "minute" },
    { amount: 24, unit: "hour" },
    { amount: 7, unit: "day" },
    { amount: 4.34524, unit: "week" },
    { amount: 12, unit: "month" },
    { amount: Number.POSITIVE_INFINITY, unit: "year" },
]

function formatRelativeTimeFromNow(dateInput: string | Date | null | undefined) {
    if (!dateInput) {
        return "Hace instantes"
    }

    const date = typeof dateInput === "string" || typeof dateInput === "number" ? new Date(dateInput) : dateInput

    if (Number.isNaN(date.getTime())) {
        return "Hace instantes"
    }

    let duration = (date.getTime() - Date.now()) / 1000

    if (duration > 0) {
        duration = -duration
    }

    for (const division of TIME_DIVISIONS) {
        if (Math.abs(duration) < division.amount) {
            return relativeTimeFormatter.format(Math.round(duration), division.unit)
        }

        duration /= division.amount
    }

    return relativeTimeFormatter.format(Math.round(duration), "year")
}

type ActivityCandidate = {
    id: string
    action: string
    item: string
    occurredAt: string | null
}

const MAX_ACTIVITY_ITEMS = 5

export async function getDashboardStats(): Promise<DashboardStats> {
    const [propertiesResult, projectsResult, contactsResult] = await Promise.all([
        supabase
            .from("properties")
            .select("id, type, status, is_featured, title, location, created_at, updated_at"),
        supabase
            .from("projects")
            .select("id, status, name, location, created_at, updated_at"),
        supabase
            .from("contacts")
            .select("id, name, email, status, created_at")
            .eq("status", "Pendiente"),
    ])

    const properties = propertiesResult.data || []
    const projects = projectsResult.data || []
    const contacts = contactsResult.data || []

    const totalProperties = properties.length
    const featuredProperties = properties.filter((p: { is_featured?: boolean }) => p.is_featured).length
    const totalProjects = projects.length
    const activeProjects = projects.filter((p: { status?: string }) => p.status === "en-construccion").length
    const totalViews = Math.round(Math.random() * 1000)

    const activities: ActivityCandidate[] = []

    for (const property of properties as Array<{
        id: string
        title?: string | null
        location?: string | null
        created_at?: string | null
        updated_at?: string | null
    }>) {
        const createdAt = property.created_at ?? null
        const updatedAt = property.updated_at ?? null
        const created = createdAt ? new Date(createdAt) : null
        const updated = updatedAt ? new Date(updatedAt) : null
        const hasUpdate = created && updated ? updated.getTime() > created.getTime() : false
        const occurredAt = hasUpdate ? updatedAt : createdAt

        activities.push({
            id: `property-${property.id}`,
            action: hasUpdate ? "Propiedad actualizada" : "Nueva propiedad agregada",
            item: property.title || property.location || "Propiedad sin titulo",
            occurredAt: occurredAt,
        })
    }

    for (const project of projects as Array<{
        id: string
        name?: string | null
        location?: string | null
        created_at?: string | null
        updated_at?: string | null
    }>) {
        const createdAt = project.created_at ?? null
        const updatedAt = project.updated_at ?? null
        const created = createdAt ? new Date(createdAt) : null
        const updated = updatedAt ? new Date(updatedAt) : null
        const hasUpdate = created && updated ? updated.getTime() > created.getTime() : false
        const occurredAt = hasUpdate ? updatedAt : createdAt

        activities.push({
            id: `project-${project.id}`,
            action: hasUpdate ? "Emprendimiento actualizado" : "Nuevo emprendimiento creado",
            item: project.name || project.location || "Emprendimiento sin nombre",
            occurredAt: occurredAt,
        })
    }

    for (const contact of contacts as Array<{
        id: string
        name?: string | null
        email?: string | null
        created_at?: string | null
    }>) {
        activities.push({
            id: `contact-${contact.id}`,
            action: "Contacto nuevo",
            item: contact.name || contact.email || "Contacto sin nombre",
            occurredAt: contact.created_at ?? null,
        })
    }

    const recentActivity = activities
        .filter(
            (activity) =>
                activity.occurredAt && !Number.isNaN(new Date(activity.occurredAt).getTime()),
        )
        .sort((a, b) => {
            const aTime = a.occurredAt ? new Date(a.occurredAt).getTime() : 0
            const bTime = b.occurredAt ? new Date(b.occurredAt).getTime() : 0
            return bTime - aTime
        })
        .slice(0, MAX_ACTIVITY_ITEMS)
        .map(({ occurredAt, ...activity }) => ({
            ...activity,
            time: formatRelativeTimeFromNow(occurredAt),
        }))

    return {
        totalProperties,
        featuredProperties,
        totalProjects,
        activeProjects,
        totalViews,
        monthlyGrowth: 0,
        recentActivity,
    }
}
