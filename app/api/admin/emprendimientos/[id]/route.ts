import 'server-only';
import { NextResponse } from "next/server";
import { getContainerClient } from '@/lib/azure';
import { ALLOWED_IMAGE_MIME, MAX_IMAGES } from '@/lib/constants/media'
import { processAndUploadImages, mergeImagesJson } from '@/lib/server/media'
import { deleteProject, updateProject, getProjectById } from "@/domain/Project";

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

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;

    await deleteProject(id);

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    const status = 500;
    return NextResponse.json(
      { message: err.message, issues: err.issues },
      { status }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params;
    const contentType = req.headers.get('content-type') || '';

    if (contentType.includes('multipart/form-data')) {
      // Update base data first, then handle images
      const form = await req.formData();
      const dataRaw = form.get('data');
      if (typeof dataRaw !== 'string') {
        return NextResponse.json({ message: 'Invalid payload' }, { status: 400 });
      }
      const payload = JSON.parse(dataRaw);

      const desiredImages: any = payload?.images ?? null;
      const { images: _ignored, ...baseUpdates } = payload || {};
      await updateProject(id, baseUpdates);

      // Collect files
      const files: File[] = [];
      for (const [key, value] of form.entries()) {
        if (key === 'images' && value instanceof File) files.push(value);
      }

      for (const f of files) {
        if (!ALLOWED_IMAGE_MIME.has(f.type)) {
          return NextResponse.json({ message: 'Formato de imagen no permitido' }, { status: 400 });
        }
      }

      let existingItems: ImagesJson['items'] = [];
      let coverId: string | null = null;
      if (desiredImages && typeof desiredImages === 'object' && Array.isArray(desiredImages.items)) {
        existingItems = desiredImages.items as ImagesJson['items'];
        coverId = desiredImages.coverId ?? null;
      }
      if (existingItems.length + files.length > MAX_IMAGES) {
        return NextResponse.json({ message: 'Máximo 10 imágenes permitidas' }, { status: 400 });
      }

      if (files.length === 0) {
        if (!desiredImages || (Array.isArray(desiredImages) && desiredImages.length === 0)) {
          const updated = await updateProject(id, { images: [] as any });
          return NextResponse.json(updated, { status: 200 });
        }
        if (desiredImages && typeof desiredImages === 'object' && Array.isArray(desiredImages.items)) {
          const updated = await updateProject(id, { images: desiredImages as any });
          return NextResponse.json(updated, { status: 200 });
        }
        const current = await getProjectById(id);
        return NextResponse.json(current, { status: 200 });
      }

      const newItems = await processAndUploadImages('emprendimientos', id, files, existingItems.length, 'Imagen del emprendimiento');

      const finalImages = mergeImagesJson(existingItems, newItems, coverId ?? null)

      const updated = await updateProject(id, { images: finalImages as any });
      return NextResponse.json(updated, { status: 200 });
    }

    // Backward-compat JSON updates
    const updates = await req.json();
    const updatedProject = await updateProject(id, updates);
    return NextResponse.json(updatedProject, { status: 200 });
  } catch (err: any) {
    const status = 500;
    return NextResponse.json(
      { message: err.message, issues: err.issues },
      { status }
    );
  }
}

