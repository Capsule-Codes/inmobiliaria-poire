import 'server-only';
import { NextResponse } from 'next/server';
import { getContainerClient } from '@/lib/azure';
import { getProjectImages } from '@/domain/Project';

export const runtime = 'nodejs'; // No functions in edge runtime

export async function GET(req: Request, { params }: { params: { projectId: string; mediaId: string } }) {
  try {
    const { projectId, mediaId } = await params;
    const imagesJson = await getProjectImages(projectId);
    if (!imagesJson || !imagesJson.items || !Array.isArray(imagesJson.items)) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    const item = imagesJson.items.find((it: any) => it.mediaId === mediaId);
    if (!item) {
      return NextResponse.json({ message: 'Not found' }, { status: 404 });
    }

    const container = getContainerClient();
    const blobClient = container.getBlockBlobClient(item.blobKey);

    // Blob properties for ETag and Content-Length
    const props = await blobClient.getProperties();
    const etag = props.etag || undefined;
    const length = props.contentLength || undefined;

    // If-None-Match handling
    const ifNoneMatch = req.headers.get('if-none-match');
    if (etag && ifNoneMatch && ifNoneMatch === etag) {
      return new Response(null, { status: 304 });
    }

    const download = await blobClient.download();
    const body = download.readableStreamBody as any;

    const headers = new Headers();
    headers.set('Content-Type', item.mimeType || 'image/webp');
    headers.set('Cache-Control', 'public, max-age=31536000, immutable');
    if (length !== undefined) headers.set('Content-Length', String(length));
    if (etag) headers.set('ETag', etag);

    return new Response(body, { status: 200, headers });
  } catch (_err: any) {
    return NextResponse.json({ message: 'Error fetching image' }, { status: 500 });
  }
}

