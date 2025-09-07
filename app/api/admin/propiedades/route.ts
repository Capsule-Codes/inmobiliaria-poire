import { NextResponse } from "next/server";

import { createProperty } from "@/domain/Property";

export async function POST(req: Request) {

    try {
        var nuevaPropiedad = await req.json();
        console.log("Creando nueva propiedad desde el server:", nuevaPropiedad);

        const data = await createProperty(nuevaPropiedad);

        return NextResponse.json(data, { status: 201 });
    }
    catch (err: any) {
        const status = 500;
        return NextResponse.json({ message: err.message, issues: err.issues }, { status });
    }
}