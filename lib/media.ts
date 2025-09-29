// Shared media types and client-safe helpers

export type MediaItem = {
  mediaId: string
  blobKey: string
  mimeType: string
  width: number
  height: number
  sizeBytes: number
  alt?: string | null
  sortOrder?: number | null
  createdAt?: string | null
}

export type Images =
  | string[]
  | {
      version: 1
      coverId: string | null
      items: MediaItem[]
    }

export function isStructuredImages(v: unknown): v is Extract<Images, { items: MediaItem[] }> {
  return !!v && typeof v === 'object' && Array.isArray((v as any).items)
}

export function compareMediaItems(a: MediaItem, b: MediaItem, coverId?: string | null) {
  const aIsCover = coverId && a.mediaId === coverId ? -1 : 0
  const bIsCover = coverId && b.mediaId === coverId ? -1 : 0
  if (aIsCover !== bIsCover) return aIsCover - bIsCover
  const ao = (a.sortOrder ?? 0) as number
  const bo = (b.sortOrder ?? 0) as number
  if (ao !== bo) return ao - bo
  const ad = new Date(a.createdAt || 0).getTime()
  const bd = new Date(b.createdAt || 0).getTime()
  return ad - bd
}

export function getCoverSrc(
  resource: 'propiedades' | 'emprendimientos',
  id: string,
  images: Images | null | undefined
): string {
  if (!images) return '/placeholder.svg'
  if (Array.isArray(images)) {
    return images.length > 0 ? images[0] : '/placeholder.svg'
  }
  if (isStructuredImages(images)) {
    const items = images.items
    if (items.length === 0) return '/placeholder.svg'
    const main = items.find((it) => typeof it?.sortOrder === 'number' && it.sortOrder === 0)
    const chosen = main ?? items[0]
    if (chosen?.mediaId) {
      return `/api/${resource}/${id}/media/${chosen.mediaId}`
    }
  }
  return '/placeholder.svg'
}

export function normalizeImages(
  resource: 'propiedades' | 'emprendimientos',
  id: string,
  images: Images | null | undefined
): Array<{ key: string; src: string; alt?: string | null }> {
  const out: Array<{ key: string; src: string; alt?: string | null }> = []
  if (!images) return out
  if (Array.isArray(images)) {
    for (const url of images) {
      if (typeof url === 'string' && url) {
        const key = url
        out.push({ key, src: url })
      }
    }
    return out
  }
  if (isStructuredImages(images)) {
    const coverId = images.coverId ?? null
    const items = [...images.items]
    items.sort((a, b) => compareMediaItems(a, b, coverId))
    for (const it of items) {
      if (!it?.mediaId) continue
      out.push({ key: it.mediaId, src: `/api/${resource}/${id}/media/${it.mediaId}`, alt: it.alt ?? null })
    }
  }
  return out
}

