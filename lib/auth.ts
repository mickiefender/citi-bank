"use server"

import { cookies } from "next/headers"

export interface User {
  id: string
  name: string
  email: string
}

const DEMO_USER: User = {
  id: "1",
  name: "James and Ashley",
  email: "james.ashley@citibank.com",
}

export async function login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  // Simple demo authentication
  if (email && password) {
    const cookieStore = await cookies()
    cookieStore.set("auth-token", "demo-token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    })
    return { success: true }
  }
  return { success: false, error: "Invalid credentials" }
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("auth-token")
}

export async function getUser(): Promise<User | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get("auth-token")

  if (token) {
    return DEMO_USER
  }

  return null
}
