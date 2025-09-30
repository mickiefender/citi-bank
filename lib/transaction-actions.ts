"use server"

import { incrementTransactionAttempts, isAccountBlocked } from "./transaction-store"

interface TransactionData {
  fromAccountId: string
  amount: number
  recipientName: string
  recipientBank: string
  recipientAccount: string
}

interface TransactionResult {
  success: boolean
  error?: string
  blocked?: boolean
}

export async function checkAccountStatus(): Promise<{ blocked: boolean }> {
  const blocked = await isAccountBlocked()
  return { blocked }
}

export async function processTransaction(data: TransactionData): Promise<TransactionResult> {
  // Check if account is already blocked
  const { blocked } = await checkAccountStatus()
  if (blocked) {
    return { success: false, blocked: true }
  }

  // Increment transaction attempts
  const attempts = await incrementTransactionAttempts()

  // First attempt - show generic error
  if (attempts === 1) {
    return {
      success: false,
      error:
        "Transaction failed. Unable to process your request at this time. Please verify your details and try again.",
    }
  }

  // Second attempt - block account
  if (attempts >= 2) {
    return {
      success: false,
      blocked: true,
    }
  }

  // This should never be reached, but just in case
  return {
    success: false,
    error: "An unexpected error occurred. Please try again later.",
  }
}
