import 'server-only';
import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { randomUUID } from 'node:crypto';
import { getContainerClient } from '@/lib/azure';
import { createProperty, updateProperty } from '@/domain/Property';

export const runtime = 'nodejs';

const ALLOWED_MIME = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/avif',
  'image/heic',
  'image/heif',
]);

type ImagesJson = {
  version: number;
  coverId: string | null;
  items: Array<{
    mediaId: string;
    blobKey: string;
    mimeType: string;
    width: number;
    height: number;
    sizeBytes: number;
    alt: string;
    sortOrder: number;
    createdAt: string;
  }>;
};

function emptyImagesJson(): ImagesJson {
  return { version: 1, coverId: null, items: [] };
}

export async function POST(req: Request) {
  try {
    const form = await req.formData();

    const dataRaw = form.get('data');
    if (typeof dataRaw !== 'string') {
      return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
    }

    const payload = JSON.parse(dataRaw);

    // Collect files
    const files: File[] = [];
    for (const [key, value] of form.entries()) {
      if (key === 'images' && value instanceof File) files.push(value);
    }

    if (files.length > 5) {
      return NextResponse.json({ message: 'Máximo 5 imágenes permitidas' }, { status: 400 });
    }

    for (const f of files) {
      if (!ALLOWED_MIME.has(f.type)) {
        return NextResponse.json({ message: 'Formato de imagen no permitido' }, { status: 400 });
      }
    }

    // Insert property first, without images
    const baseProperty = { ...payload, images: [] };
    let created;
    try {
      created = await createProperty(baseProperty);
    } catch (err: any) {
      return NextResponse.json({ message: 'Error creando la propiedad' }, { status: 500 });
    }

    const propertyId: string = created.id;

    // If no files, finish early as ok with partialSuccess false
    if (files.length === 0) {
      return NextResponse.json({ ok: true, propertyId, partialSuccess: false }, { status: 201 });
    }

    const container = getContainerClient();
    const items: ImagesJson['items'] = [];
    let hadFailures = false;

    // Process files one by one, never fail the whole process
    let sortIndex = 0;
    for (const file of files) {
      try {
        const arrayBuf = await file.arrayBuffer();
        const inputBuffer = Buffer.from(arrayBuf);

        // Convert to webp, max width 1600, quality ~80
        const optimized = await sharp(inputBuffer)
          .rotate()
          .resize({ width: 1600, withoutEnlargement: true })
          .webp({ quality: 80 })
          .toBuffer();

        const meta = await sharp(optimized).metadata();
        const width = meta.width ?? 0;
        const height = meta.height ?? 0;

        const assetId = randomUUID();
        const mediaId = randomUUID();
        const fileName = `${assetId}_1600.webp`;
        const blobKey = `poirepropiedades/propiedades/${propertyId}/optimized/${fileName}`;

        const blobClient = container.getBlockBlobClient(blobKey);
        await blobClient.uploadData(optimized, {
          blobHTTPHeaders: {
            blobContentType: 'image/webp',
            blobCacheControl: 'public, max-age=31536000, immutable',
          },
        });

        items.push({
          mediaId,
          blobKey,
          mimeType: 'image/webp',
          width,
          height,
          sizeBytes: optimized.length,
          alt: 'Foto de la propiedad',
          sortOrder: sortIndex++,
          createdAt: new Date().toISOString(),
        });
      } catch (e: any) {
        // Log sharp/Azure errors and mark partial failure
        console.error('Image processing/upload error:', e?.message || e);
        hadFailures = true;
        continue;
      }
    }

    // Update images JSONB, even if empty (still ok with partialSuccess if files failed)
    try {
      const currentImages = emptyImagesJson();
      currentImages.items.push(...items);
      await updateProperty(propertyId, { images: currentImages as any });
    } catch (e) {
      // If updating images fails, still return ok with partialSuccess
      console.error('Failed updating property images JSON:', e);
      hadFailures = true;
    }

    if (hadFailures) {
      return NextResponse.json({
        ok: true,
        propertyId,
        partialSuccess: true,
        message:
          'La propiedad fue creada con exito pero ocurrio un error subiendo las imagenes, intente subirlas nuevamente editando la propiedad',
      }, { status: 201 });
    }

    return NextResponse.json({ ok: true, propertyId, partialSuccess: false }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || 'Unexpected error' }, { status: 500 });
  }
}
