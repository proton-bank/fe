export interface ContactAdd {
  contact_username: string
  nickname?: string
}

export interface ContactResponse {
  id: string
  user_id: string
  contact_user_id: string
  nickname: string
  created_at: string
  contact_username: string
  contact_full_name: string
  contact_account_number: string
}

// Lightweight user info used for contact suggestions
export interface ContactUser {
  id: string
  username: string
  full_name: string
  account_number: string
}

