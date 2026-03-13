import apiClient from './client'
import type { LoginRequest, SignupRequest, TokenResponse } from '../types/auth'

function getAccessToken(data: unknown): string {
  if (data && typeof data === 'object') {
    const d = data as Record<string, unknown>
    const token =
      (d.access_token as string) ?? (d.accessToken as string) ?? (d.token as string)
    if (typeof token === 'string' && token) return token
  }
  throw new Error('Invalid auth response: missing token')
}

export async function signup(data: SignupRequest): Promise<TokenResponse> {
  const response = await apiClient.post<unknown>('/api/auth/signup', data, {
    headers: { 'Content-Type': 'application/json' },
  })
  const token = getAccessToken(response.data)
  return { access_token: token, token_type: 'bearer' }
}

export async function login(data: LoginRequest): Promise<TokenResponse> {
  const response = await apiClient.post<unknown>('/api/auth/login', data, {
    headers: { 'Content-Type': 'application/json' },
  })
  const token = getAccessToken(response.data)
  return { access_token: token, token_type: 'bearer' }
}

