import { useEffect, useState } from 'react'
import { getConversations } from '../api/chat'
import type { Conversation } from '../types/chat'

interface UseConversationsResult {
  conversations: Conversation[]
  loading: boolean
  error: Error | null
  refresh: () => Promise<void>
}

export function useConversations(): UseConversationsResult {
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchConversations = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getConversations()
      setConversations(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchConversations()
  }, [])

  return {
    conversations,
    loading,
    error,
    refresh: fetchConversations,
  }
}

