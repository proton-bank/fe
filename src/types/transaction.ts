export interface TransferRequest {
  to_account_number: string
  amount: number
  description?: string
}

export interface DepositRequest {
  amount: number
  description?: string
}

export interface WithdrawRequest {
  amount: number
  description?: string
}

export type TransactionType = 'transfer' | 'deposit' | 'withdrawal'

export type TransactionStatus = 'pending' | 'success' | 'failed'

export interface TransactionResponse {
  id: string
  type: TransactionType
  from_account_id: string
  to_account_id: string
  amount: number
  description: string
  status: TransactionStatus
  created_at: string
}

