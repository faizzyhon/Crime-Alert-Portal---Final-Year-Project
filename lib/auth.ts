import { supabase } from "./supabase"
import type { SignUpData, LoginData } from "./types"

async function sha256(text: string) {
  const data = new TextEncoder().encode(text)
  const hashBuffer = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(hashBuffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export async function signUp(data: SignUpData) {
  try {
    const passwordHash = await sha256(data.password)

    const { data: user, error } = await supabase
      .from("users")
      .insert({
        name: data.name,
        cnic: data.cnic,
        phone: data.phone,
        email: data.email,
        password_hash: passwordHash,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)

    return { user, error: null }
  } catch (error) {
    return { user: null, error: error instanceof Error ? error.message : "Sign up failed" }
  }
}

export async function login(data: LoginData) {
  try {
    const { data: user, error } = await supabase.from("users").select("*").eq("cnic", data.cnic).single()

    if (error || !user) throw new Error("Invalid credentials")

    const incoming = await sha256(data.password)
    if (incoming !== user.password_hash) throw new Error("Invalid credentials")

    const { id, name, cnic, phone, email, created_at } = user
    return { user: { id, name, cnic, phone, email, created_at }, error: null }
  } catch (error) {
    return { user: null, error: error instanceof Error ? error.message : "Login failed" }
  }
}
