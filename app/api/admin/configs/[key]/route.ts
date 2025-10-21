import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import {
  getConfigValuesByKey,
  replaceSingleConfigValue,
  addListConfigValue,
  deleteListConfigValue,
} from "@/domain/Config";

export async function GET(
  _req: Request,
  { params }: { params: { key: string } }
) {
  try {
    const { key } = await params;
    const rows = await getConfigValuesByKey(key);
    return NextResponse.json(rows, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// For scalar keys: replaces any existing values for the key
export async function PUT(
  req: Request,
  { params }: { params: { key: string } }
) {
  try {
    const { key } = await params;
    const body = await req.json();
    const { value, type } = body as {
      value: any;
      type?: "string" | "int" | "bool" | "json" | "decimal";
    };
    const saved = await replaceSingleConfigValue(
      key,
      value,
      (type as any) ?? "string"
    );

    // Revalidar páginas que usan configuración
    revalidatePath("/admin/configuracion");
    revalidatePath("/");

    return NextResponse.json(saved, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

// For list-like keys: adds another value entry
export async function POST(
  req: Request,
  { params }: { params: { key: string } }
) {
  try {
    const { key } = await params;
    const body = await req.json();
    const { value, type } = body as {
      value: any;
      type?: "string" | "int" | "bool" | "json" | "decimal";
    };
    const added = await addListConfigValue(
      key,
      value,
      (type as any) ?? "string"
    );

    // Revalidar páginas que usan configuración
    revalidatePath("/admin/configuracion");
    revalidatePath("/");

    return NextResponse.json(added, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { key: string } }
) {
  try {
    const { key } = await params;
    let value: any = undefined;
    try {
      const body = await req.json();
      value = body?.value;
    } catch {
      // ignore, allow deleting all values for key if no body
    }
    await deleteListConfigValue(key, value);

    // Revalidar páginas que usan configuración
    revalidatePath("/admin/configuracion");
    revalidatePath("/");

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}
