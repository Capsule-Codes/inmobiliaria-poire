import 'server-only';
import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { randomUUID } from 'node:crypto';
import { getContainerClient } from '@/lib/azure';
import { createProject, updateProject } from '@/domain/Project';
import { ALLOWED_IMAGE_MIME } from '@/lib/constants/media';

export const runtime = 'nodejs';


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
      if (!ALLOWED_IMAGE_MIME.has(f.type)) {
        return NextResponse.json({ message: 'Formato de imagen no permitido' }, { status: 400 });
      }
    }

    // Insert project first, without images
    const baseProject = { ...payload, images: [] };
    let created;
    try {
      created = await createProject(baseProject);
    } catch (_err: any) {
      return NextResponse.json({ message: 'Error creando el emprendimiento' }, { status: 500 });
    }

    const projectId: string = created.id;

    // If no files, finish early
    if (files.length === 0) {
      return NextResponse.json({ ok: true, projectId, partialSuccess: false }, { status: 201 });
    }

    const container = getContainerClient();
    const items: ImagesJson['items'] = [];
    let hadFailures = false;
    let sortIndex = 0;

    for (const file of files) {
      try {
        const arrayBuf = await file.arrayBuffer();
        const inputBuffer = Buffer.from(arrayBuf);

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
        const blobKey = `poirepropiedades/emprendimientos/${projectId}/optimized/${fileName}`;

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
          alt: 'Imagen del emprendimiento',
          sortOrder: sortIndex++,
          createdAt: new Date().toISOString(),
        });
      } catch (e: any) {
        console.error('Image processing/upload error (projects POST):', e?.message || e);
        hadFailures = true;
        continue;
      }
    }

    try {
      const currentImages = emptyImagesJson();
      currentImages.items.push(...items);
      await updateProject(projectId, { images: currentImages as any });
    } catch (e) {
      console.error('Failed updating project images JSON:', e);
      hadFailures = true;
    }

    if (hadFailures) {
      return NextResponse.json({
        ok: true,
        projectId,
        partialSuccess: true,
        message:
          'El emprendimiento fue creado con éxito pero ocurrió un error subiendo las imágenes, intente subirlas nuevamente editando el emprendimiento',
      }, { status: 201 });
    }

    return NextResponse.json({ ok: true, projectId, partialSuccess: false }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err?.message || 'Unexpected error' }, { status: 500 });
  }
}
