import apiClient from './client'
import type { ContactAdd, ContactResponse, ContactUser } from '../types/contact'

export async function getContacts(): Promise<ContactResponse[]> {
  const response = await apiClient.get<ContactResponse[]>('/api/contacts')
  return response.data
}

export async function addContact(
  payload: ContactAdd,
): Promise<ContactResponse> {
  const response = await apiClient.post<ContactResponse>(
    '/api/contacts',
    payload,
  )
  return response.data
}

export async function deleteContact(contactId: string): Promise<{ status: string }> {
  const response = await apiClient.delete<{ status: string }>(
    `/api/contacts/${encodeURIComponent(contactId)}`,
  )
  return response.data
}

export async function getUsers(): Promise<ContactUser[]> {
  const response = await apiClient.get<ContactUser[]>('/api/contacts/users')
  return response.data
}

