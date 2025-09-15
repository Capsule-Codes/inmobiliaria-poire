import { NextResponse } from "next/server";

import { createProject } from "@/domain/Project";

export async function POST(req: Request) {
  try {
    const newProject = await req.json();

    const data = await createProject(newProject);

    return NextResponse.json(data, { status: 201 });
  } catch (err: any) {
    const status = 500;
    return NextResponse.json(
      { message: err.message, issues: err.issues },
      { status }
    );
  }
}
