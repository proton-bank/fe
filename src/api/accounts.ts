import apiClient from './client'
import type {
  AccountPublicInfo,
  AccountResponse,
} from '../types/account'

export async function getMyAccount(): Promise<AccountResponse> {
  const response = await apiClient.get<AccountResponse>('/api/accounts/me')
  return response.data
}

export async function lookupAccount(
  accountNumber: string,
): Promise<AccountPublicInfo> {
  const response = await apiClient.get<AccountPublicInfo>(
    `/api/accounts/${encodeURIComponent(accountNumber)}`,
  )
  return response.data
}

export async function getSystemBalance(): Promise<{ system_balance: number }> {
  const response = await apiClient.get<{ system_balance: number }>(
    '/api/accounts/system-balance',
  )
  return response.data
}

