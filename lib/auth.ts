import { supabase } from "@/lib/supabase"

export async function signIn(email: string, password: string) {

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signOut() {


  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error) throw error
  return user
}

export async function checkAdminUser(email: string) {

  const { data, error } = await supabase.from("admin_users").select("*").eq("email", email).single()

  if (error) throw error
  return data
}
