export interface AccountResponse {
  id: string
  user_id: string
  account_number: string
  balance: number
  currency: string
  created_at: string
}

export interface AccountPublicInfo {
  account_number: string
  full_name: string
  username: string
}

