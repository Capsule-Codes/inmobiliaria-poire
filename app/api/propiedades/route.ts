import { NextRequest, NextResponse } from 'next/server';
import { getProperties } from '@/domain/property';
import { type SearchPropertyFilters } from '@/contexts/search-property-context';

export async function GET(req: NextRequest) {

    try {
        const searchParams = req.nextUrl.searchParams;

        const location = searchParams.get('location');
        const type = searchParams.get('type');
        const minPrice = Number(searchParams.get('minPrice')) || undefined;
        const maxPrice = Number(searchParams.get('maxPrice')) || undefined;
        const bedrooms = Number(searchParams.get('bedrooms')) || undefined;

        const filters = {
            type,
            minPrice,
            maxPrice,
            location,
            bedrooms
        } as SearchPropertyFilters;

        const properties = await getProperties(filters);

        return NextResponse.json(properties, { status: 200 });

    } catch (err: any) {
        const status = 500;
        return NextResponse.json({ message: err.message, issues: err.issues }, { status });
    }
}
