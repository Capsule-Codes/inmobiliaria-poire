import { NextResponse } from "next/server";
import { deleteProject, updateProject } from "@/domain/project";

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {

    try {

        const { id } = await params;

        await deleteProject(id);

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

        const updatedProject = await updateProject(id, updates);

        return NextResponse.json(updatedProject, { status: 200 });
    } catch (err: any) {
        const status = 500;
        return NextResponse.json({ message: err.message, issues: err.issues }, { status });
    }
}