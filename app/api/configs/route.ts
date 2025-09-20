import { NextResponse } from "next/server";
import { getAdminConfig } from "@/domain/Config";

export async function GET() {
  try {
    const cfg = await getAdminConfig();
    return NextResponse.json(cfg, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ message: err.message }, { status: 500 });
  }
}

