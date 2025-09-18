import { NextResponse } from "next/server";
import { deleteContact, updateContactStatus } from "@/domain/Contact";

export async function DELETE(req: Request, { params }: { params: { id: string } }) {

    try {

        const { id } = await params;
        await deleteContact(id);
        return NextResponse.json({ ok: true }, { status: 200 });
    } catch (err: any) {
        const status = 500;
        return NextResponse.json(
            { message: err.message, issues: err.issues },
            { status }
        );
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {

    try {
        const { id } = await params;
        const { status } = await req.json();
        const updatedContact = await updateContactStatus(id, status);
        return NextResponse.json(updatedContact, { status: 200 });
    } catch (err: any) {
        const status = 500;
        return NextResponse.json(
            { message: err.message, issues: err.issues },
            { status }
        );
    }
}