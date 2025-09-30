"use server"

import { cookies } from "next/headers"

export async function getTransactionAttempts(): Promise<number> {
  const cookieStore = await cookies()
  const attempts = cookieStore.get("transaction-attempts")
  return attempts ? Number.parseInt(attempts.value) : 0
}

export async function incrementTransactionAttempts(): Promise<number> {
  const cookieStore = await cookies()
  const currentAttempts = await getTransactionAttempts()
  const newAttempts = currentAttempts + 1

  cookieStore.set("transaction-attempts", newAttempts.toString(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
  })

  return newAttempts
}

export async function isAccountBlocked(): Promise<boolean> {
  const attempts = await getTransactionAttempts()
  return attempts >= 2
}

export async function resetTransactionAttempts(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete("transaction-attempts")
}
