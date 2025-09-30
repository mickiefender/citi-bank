export interface Account {
  id: string
  name: string
  type: string
  balance: number
  accountNumber?: string
  limit?: number
}

export const ACCOUNTS: Account[] = [
  {
    id: "1",
    name: "Checking Balance",
    type: "checking",
    balance: 163840.93,
    accountNumber: "****2589",
  },
  {
    id: "2",
    name: "Saving Plus Account",
    type: "savings",
    balance: 88143.54,
    accountNumber: "****7821",
  },
  {
    id: "3",
    name: "Citi Master Card",
    type: "credit",
    balance: 74.87,
    accountNumber: "****4532",
    limit: 12704.89,
  },
  {
    id: "4",
    name: "Certificate of Deposit",
    type: "cd",
    balance: 218298.92,
    accountNumber: "****9104",
  },
]

export function getTotalBalance(): number {
  return ACCOUNTS.reduce((sum, account) => {
    if (account.type === "credit") {
      return sum - account.balance
    }
    return sum + account.balance
  }, 0)
}

export function getAccountById(id: string): Account | undefined {
  return ACCOUNTS.find((account) => account.id === id)
}
