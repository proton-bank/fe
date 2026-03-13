import apiClient from './client'
import type {
  DepositRequest,
  TransactionResponse,
  TransferRequest,
  WithdrawRequest,
} from '../types/transaction'

export async function transfer(
  payload: TransferRequest,
): Promise<TransactionResponse> {
  const response = await apiClient.post<TransactionResponse>(
    '/api/transactions/transfer',
    payload,
  )
  return response.data
}

export async function deposit(
  payload: DepositRequest,
): Promise<TransactionResponse> {
  const response = await apiClient.post<TransactionResponse>(
    '/api/transactions/deposit',
    payload,
  )
  return response.data
}

export async function withdraw(
  payload: WithdrawRequest,
): Promise<TransactionResponse> {
  const response = await apiClient.post<TransactionResponse>(
    '/api/transactions/withdraw',
    payload,
  )
  return response.data
}

export async function getHistory(
  limit = 20,
): Promise<TransactionResponse[]> {
  const response = await apiClient.get<TransactionResponse[]>(
    `/api/transactions/history?limit=${limit}`,
  )
  return response.data
}

