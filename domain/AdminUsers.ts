import { supabase } from "@/lib/supabase"
import crypto from "crypto"

export interface AdminUser {
  id: string
  email: string
  password_hash: string
}

// Hash format: pbkdf2$sha256$${iters}$${saltB64}$${hashB64}
function parsePbkdf2Hash(hash: string) {
  const parts = hash.split("$")
  if (parts.length !== 5 || parts[0] !== "pbkdf2" || parts[1] !== "sha256") {
    throw new Error("Invalid hash format")
  }
  const iterations = parseInt(parts[2], 10)
  const saltB64 = parts[3]
  const hashB64 = parts[4]
  return { iterations, saltB64, hashB64 }
}

export function verifyPassword(storedHash: string, password: string): boolean {
  const { iterations, saltB64, hashB64 } = parsePbkdf2Hash(storedHash)
  const salt = Buffer.from(saltB64, "base64")
  const expected = Buffer.from(hashB64, "base64")
  const derived = crypto.pbkdf2Sync(password, salt, iterations, expected.length, "sha256")
  // Constant-time comparison
  return crypto.timingSafeEqual(derived, expected)
}

export async function getAdminUserByEmail(email: string): Promise<AdminUser | null> {
  const { data, error } = await supabase
    .from("admin_users")
    .select("id,email,password_hash")
    .eq("email", email)
    .maybeSingle()

  if (error) throw error
  return (data as AdminUser) ?? null
}

