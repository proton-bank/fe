export interface SignupRequest {
  username: string
  full_name: string
  pin: string
  role: 'user' | 'admin'
}

export interface LoginRequest {
  username: string
  pin: string
}

export interface TokenResponse {
  access_token: string
  token_type: string
}

