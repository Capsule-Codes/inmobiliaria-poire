import { NextResponse } from "next/server";
import { deleteProperty, updateProperty } from "@/domain/property";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {

    try {

        const { id } = await params;

        await deleteProperty(id);

        return NextResponse.json({ ok: true }, { status: 200 });

    } catch (err: any) {
        const status = 500;
        return NextResponse.json({ message: err.message, issues: err.issues }, { status });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        const updates = await req.json();

        const updatedProperty = await updateProperty(id, updates);

        return NextResponse.json(updatedProperty, { status: 200 });
    } catch (err: any) {
        const status = 500;
        return NextResponse.json({ message: err.message, issues: err.issues }, { status });
    }
}