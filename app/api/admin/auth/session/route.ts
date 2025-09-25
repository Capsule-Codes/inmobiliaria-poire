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

async function refreshToken(body: string, secret: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(body))
  return `${body}.${base64url(Buffer.from(new Uint8Array(sig)))}`
}

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get(COOKIE_NAME)?.value
  if (!cookie) return NextResponse.json({ authenticated: false }, { status: 200 })

  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) return NextResponse.json({ authenticated: false }, { status: 200 })

  const [body, sig] = cookie.split(".")
  if (!body || !sig) return NextResponse.json({ authenticated: false }, { status: 200 })

  const valid = await verifySign(body, sig, secret)
  if (!valid) return NextResponse.json({ authenticated: false }, { status: 200 })

  try {
    const payload = JSON.parse(fromBase64Url(body).toString("utf8")) as { last: number; email: string }
    const now = Date.now()
    if (!payload.last || now - payload.last > IDLE_MS) {
      return NextResponse.json({ authenticated: false }, { status: 200 })
    }
    return NextResponse.json({ authenticated: true, email: payload.email }, { status: 200 })
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 200 })
  }
}

