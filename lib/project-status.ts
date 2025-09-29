export type ProjectStatus = 'En Construcción' | 'En Venta' | 'Próximamente'

export const statusColors: Record<ProjectStatus, string> = {
  'En Construcción': 'bg-yellow-500',
  'En Venta': 'bg-green-500',
  'Próximamente': 'bg-blue-500',
}

