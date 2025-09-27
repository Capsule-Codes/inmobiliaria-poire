"use client";

import Image from 'next/image';

type GalleryItem = {
  mediaId: string;
  alt?: string | null;
  width?: number | null;
  height?: number | null;
};

export function Gallery({ propertyId, items }: { propertyId: string; items: GalleryItem[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3 md:gap-4">
      {items.map(({ mediaId, alt }) => (
        <div key={mediaId} className="relative aspect-[4/3]">
          <Image
            src={`/api/properties/${propertyId}/media/${mediaId}`}
            alt={alt ?? 'Foto de la propiedad'}
            fill
            sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          />
        </div>
      ))}
    </div>
  );
}

