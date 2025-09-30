import 'server-only';
import { NextResponse } from 'next/server';
import { getProjectImages } from '@/domain/Project';
import { getMediaResponse } from '@/lib/server/media'

export const runtime = 'nodejs'; // No functions in edge runtime

export async function GET(req: Request, { params }: { params: { projectId: string; mediaId: string } }) {
  try {
    const { projectId, mediaId } = await params;
    const imagesJson = await getProjectImages(projectId);
    return await getMediaResponse('emprendimientos', projectId, imagesJson as any, mediaId, req)
  } catch (_err: any) {
    return NextResponse.json({ message: 'Error fetching image' }, { status: 500 });
  }
}
