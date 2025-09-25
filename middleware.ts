import { NextRequest, NextResponse } from "next/server"

const COOKIE_NAME = "admin_session"
const IDLE_MS = 10 * 60 * 1000

function fromBase64Url(s: string) {
  s = s.replace(/-/g, "+").replace(/_/g, "/")
  const pad = s.length % 4
  if (pad) s += "=".repeat(4 - pad)
  return Buffer.from(s, "base64")
}

function base64url(input: Buffer | string) {
  const b = Buffer.isBuffer(input) ? input : Buffer.from(input)
  return b.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_")
}

async function verifySign(data: string, signature: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"]
  )
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    fromBase64Url(signature),
    new TextEncoder().encode(data)
  )
  return valid
}

async function signData(data: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(data))
  return base64url(Buffer.from(new Uint8Array(sig)))
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // Only guard API admin routes (except auth endpoints)
  if (pathname.startsWith("/api/admin") && !pathname.startsWith("/api/admin/auth")) {
    const cookie = req.cookies.get(COOKIE_NAME)?.value
    const secret = process.env.ADMIN_SESSION_SECRET
    if (!cookie || !secret) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const [body, sig] = cookie.split(".")
    if (!body || !sig) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const valid = await verifySign(body, sig, secret)
    if (!valid) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    let payload: { last: number; email?: string; sub?: string }
    try {
      payload = JSON.parse(fromBase64Url(body).toString("utf8"))
    } catch {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const now = Date.now()
    if (!payload.last || now - payload.last > IDLE_MS) {
      return NextResponse.json({ error: "Session expired" }, { status: 401 })
    }

    // Refresh idle timeout (sliding expiration)
    payload.last = now
    const newBody = base64url(Buffer.from(JSON.stringify(payload)))
    const newSig = await signData(newBody, secret)
    const res = NextResponse.next()
    res.cookies.set({
      name: COOKIE_NAME,
      value: `${newBody}.${newSig}`,
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: Math.floor(IDLE_MS / 1000),
    })
    return res
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*"],
}

