import { NextRequest, NextResponse } from 'next/server';
import { getProperties } from '@/domain/Property';
import { type SearchPropertyFilters } from '@/contexts/search-property-context';

export async function GET(req: NextRequest) {

    try {
        var searchParams = req.nextUrl.searchParams;

        var location = searchParams.get('location');
        var type = searchParams.get('type');
        var minPrice = Number(searchParams.get('minPrice')) || undefined;
        var maxPrice = Number(searchParams.get('maxPrice')) || undefined;
        var bedrooms = Number(searchParams.get('bedrooms')) || undefined;

        var filters = {
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
