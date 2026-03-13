import apiClient from './client'
import type { ChatMessage, Conversation } from '../types/chat'

export async function getConversations(): Promise<Conversation[]> {
  const response = await apiClient.get<Conversation[]>('/api/chat/conversations')
  return response.data
}

export async function getConversationMessages(
  conversationId: string,
): Promise<ChatMessage[]> {
  const response = await apiClient.get<ChatMessage[]>(
    `/api/chat/conversations/${conversationId}/messages`,
  )
  return response.data
}

