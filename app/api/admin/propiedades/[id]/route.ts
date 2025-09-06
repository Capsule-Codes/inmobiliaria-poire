import { NextResponse } from "next/server";
import { deleteProperty } from "@/domain/Property";

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