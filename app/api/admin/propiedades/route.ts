import { NextResponse } from "next/server";

import { createProperty } from "@/domain/property";

export async function POST(req: Request) {

    try {
        const newProperty = await req.json();
        
        const data = await createProperty(newProperty);

        return NextResponse.json(data, { status: 201 });
        
    } catch (err: any) {
        const status = 500;
        return NextResponse.json({ message: err.message, issues: err.issues }, { status });
    }
}