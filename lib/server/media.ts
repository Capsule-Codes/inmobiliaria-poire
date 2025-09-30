import 'server-only'
import sharp from 'sharp'
import { randomUUID } from 'node:crypto'
import { getContainerClient } from '@/lib/azure'
import type { Images, MediaItem } from '@/lib/media'
import { ALLOWED_IMAGE_MIME, MAX_IMAGES } from '@/lib/constants/media'

export type ImagesJson = {
  version: 1
  coverId: string | null
  items: MediaItem[]
}

export function emptyImagesJson(): ImagesJson {
  return { version: 1, coverId: null, items: [] }
}

export function validateFiles(files: File[]) {
  for (const f of files) {
    if (!ALLOWED_IMAGE_MIME.has(f.type)) {
      throw new Error('Formato de imagen no permitido')
    }
  }
}

export async function processAndUploadImages(
  baseFolder: 'propiedades' | 'emprendimientos',
  ownerId: string,
  files: File[],
  startIndex: number,
  altDefault: string
): Promise<MediaItem[]> {
  const container = getContainerClient()
  const newItems: MediaItem[] = []
  let sortIndex = startIndex

  for (const file of files) {
    try {
      const arrayBuf = await file.arrayBuffer()
      const inputBuffer = Buffer.from(arrayBuf)

      const optimized = await sharp(inputBuffer)
        .rotate()
        .resize({ width: 1600, withoutEnlargement: true })
        .webp({ quality: 80 })
        .toBuffer()

      const meta = await sharp(optimized).metadata()
      const width = meta.width ?? 0
      const height = meta.height ?? 0

      const assetId = randomUUID()
      const mediaId = randomUUID()
      const fileName = `${assetId}_1600.webp`
      const blobKey = `poirepropiedades/${baseFolder}/${ownerId}/optimized/${fileName}`

      const blobClient = container.getBlockBlobClient(blobKey)
      await blobClient.uploadData(optimized, {
        blobHTTPHeaders: {
          blobContentType: 'image/webp',
          blobCacheControl: 'public, max-age=31536000, immutable',
        },
      })

      newItems.push({
        mediaId,
        blobKey,
        mimeType: 'image/webp',
        width,
        height,
        sizeBytes: optimized.length,
        alt: altDefault,
        sortOrder: sortIndex++,
        createdAt: new Date().toISOString(),
      })
    } catch (e) {
      // Continue on errors; caller can decide how to report
      console.error('Image processing/upload error:', (e as any)?.message || e)
    }
  }

  return newItems
}

export function mergeImagesJson(
  existingItems: MediaItem[],
  newItems: MediaItem[],
  coverId?: string | null
): ImagesJson {
  const finalImages: ImagesJson = emptyImagesJson()
  if (existingItems.length > 0) finalImages.items.push(...existingItems)
  if (newItems.length > 0) finalImages.items.push(...newItems)
  const fallbackCover = finalImages.items[0]?.mediaId ?? null
  finalImages.coverId = coverId && finalImages.items.find((it) => it.mediaId === coverId) ? coverId : fallbackCover
  return finalImages
}

export async function getMediaResponse(
  resource: 'propiedades' | 'emprendimientos',
  ownerId: string,
  images: Images | null | undefined,
  mediaId: string,
  req: Request
): Promise<Response> {
  if (!images || typeof images !== 'object' || !Array.isArray((images as any).items)) {
    return new Response(JSON.stringify({ message: 'Not found' }), { status: 404 })
  }
  const items = (images as any).items as MediaItem[]
  const item = items.find((it) => it.mediaId === mediaId)
  if (!item) {
    return new Response(JSON.stringify({ message: 'Not found' }), { status: 404 })
  }

  const container = getContainerClient()
  const blobClient = container.getBlockBlobClient(item.blobKey)

  const props = await blobClient.getProperties()
  const etag = props.etag || undefined
  const length = props.contentLength || undefined

  const ifNoneMatch = req.headers.get('if-none-match')
  if (etag && ifNoneMatch && ifNoneMatch === etag) {
    return new Response(null, { status: 304 })
  }

  const download = await blobClient.download()
  const body = download.readableStreamBody as any

  const headers = new Headers()
  headers.set('Content-Type', item.mimeType || 'image/webp')
  headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  if (length !== undefined) headers.set('Content-Length', String(length))
  if (etag) headers.set('ETag', etag)

  return new Response(body, { status: 200, headers })
}

