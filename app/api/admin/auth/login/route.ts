import { NextRequest, NextResponse } from "next/server"
import { getAdminUserByEmail, verifyPassword } from "@/domain/AdminUsers"

const COOKIE_NAME = "admin_session"
const IDLE_MS = 10 * 60 * 1000

function base64url(input: Buffer | string) {
  const b = Buffer.isBuffer(input) ? input : Buffer.from(input)
  return b.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
}

function sign(data: string, secret: string) {
  const crypto = require("crypto") as typeof import("crypto")
  const h = crypto.createHmac("sha256", Buffer.from(secret))
  h.update(data)
  return base64url(h.digest())
}

function createSessionToken(payload: Record<string, any>, secret: string) {
  const body = base64url(Buffer.from(JSON.stringify(payload)))
  const sig = sign(body, secret)
  return `${body}.${sig}`
}

export async function POST(req: NextRequest) {
  try {
    const { email, username, password } = await req.json()
    const loginEmail = (email ?? username ?? "").toString().trim()
    if (!loginEmail || !password) {
      return NextResponse.json({ error: "Email y contraseña requeridos" }, { status: 400 })
    }

    const user = await getAdminUserByEmail(loginEmail)
    console.log('[LOGIN] Email:', loginEmail, 'User found:', !!user)

    if (!user) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    const ok = await verifyPassword(user.password_hash, password)
    console.log('[LOGIN] Password verify result:', ok)

    if (!ok) {
      return NextResponse.json({ error: "Credenciales inválidas" }, { status: 401 })
    }

    const secret = process.env.ADMIN_SESSION_SECRET
    if (!secret) {
      console.error('[LOGIN] Missing ADMIN_SESSION_SECRET')
      return NextResponse.json({ error: "Falta ADMIN_SESSION_SECRET" }, { status: 500 })
    }

    const now = Date.now()
    const token = createSessionToken({ sub: user.id, email: user.email, last: now }, secret)

    const res = NextResponse.json({ ok: true })
    res.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: Math.floor(IDLE_MS / 1000),
    })
    return res
  } catch (e: any) {
    console.error('[LOGIN] Error:', e.message, e.stack)
    return NextResponse.json({ error: "Error de autenticación: " + e.message }, { status: 500 })
  }
}
