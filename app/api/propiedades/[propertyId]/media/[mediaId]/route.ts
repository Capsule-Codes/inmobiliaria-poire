import 'server-only';
import { NextResponse } from 'next/server';
import { getPropertyImages } from '@/domain/Property';
import { getMediaResponse } from '@/lib/server/media'

export const runtime = 'nodejs'; // No functions in edge runtime

export async function GET(req: Request, { params }: { params: { propertyId: string; mediaId: string } }) {
  try {
    const { propertyId, mediaId } = await params;    
    const imagesJson = await getPropertyImages(propertyId);
    return await getMediaResponse('propiedades', propertyId, imagesJson as any, mediaId, req)
  } catch (err: any) {
    return NextResponse.json({ message: 'Error fetching image' }, { status: 500 });
  }
}

