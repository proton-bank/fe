import { useCallback, useMemo, useState } from 'react'
import type {
  ChatMessage,
  ChatStatus,
  SSEEvent,
  UIMessage,
  UIMessageType,
} from '../types/chat'
import { getConversationMessages } from '../api/chat'
import { useSSE } from './useSSE'

interface UseChatReturn {
  messages: UIMessage[]
  status: ChatStatus
  conversationId: string | null
  title: string | null
  sendMessage: (text: string) => void
  loadConversation: (convId: string) => Promise<void>
  newConversation: () => void
  lastUserMessage: string | null
}

export function useChat(): UseChatReturn {
  const [messages, setMessages] = useState<UIMessage[]>([])
  const [status, setStatus] = useState<ChatStatus>('idle')
  const [conversationId, setConversationId] = useState<string | null>(null)
  const [title, setTitle] = useState<string | null>(null)
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null)

  const appendMessage = useCallback((msg: UIMessage) => {
    setMessages((prev) => [...prev, msg])
  }, [])

  const replaceThinking = useCallback(
    (next: UIMessage | null) => {
      setMessages((prev) => {
        const withoutThinking = prev.filter((m) => m.type !== 'thinking')
        if (!next) return withoutThinking
        return [...withoutThinking, next]
      })
    },
    [],
  )

  const handleEvent = useCallback(
    (event: SSEEvent) => {
      switch (event.event) {
        case 'conversation_created':
          setConversationId(event.data.conversation_id as string)
          break

        case 'title_generated':
          setTitle(event.data.title as string)
          break

        case 'status':
          if (event.data.status === 'thinking') {
            setStatus('thinking')
            replaceThinking({
              id: `thinking-${Date.now()}`,
              type: 'thinking',
              timestamp: new Date(),
            })
          }
          break

        case 'tool_call':
          replaceThinking(null)
          appendMessage({
            id: `tool-call-${event.data.call_id as string}`,
            type: 'tool_call',
            toolName: event.data.name as string,
            toolCallId: event.data.call_id as string,
            toolArguments: event.data.arguments,
            timestamp: new Date(),
          })
          break

        case 'tool_result':
          appendMessage({
            id: `tool-result-${event.data.call_id as string}`,
            type: 'tool_result',
            toolName: event.data.name as string,
            toolCallId: event.data.call_id as string,
            toolOutput: event.data.output,
            timestamp: new Date(),
          })

          if (
            event.data.name === 'transfer_money' &&
            event.data.output?.status === 'success'
          ) {
            window.dispatchEvent(new CustomEvent('balance-updated'))
          }
          break

        case 'message':
          replaceThinking({
            id: `assistant-${Date.now()}`,
            type: 'assistant',
            content: event.data.content as string,
            timestamp: new Date(),
          } as UIMessage)
          setStatus('idle')
          break

        case 'done':
          setStatus('idle')
          break

        case 'error':
          replaceThinking({
            id: `error-${Date.now()}`,
            type: 'error',
            content: (event.data.message as string) ?? 'An error occurred.',
            timestamp: new Date(),
          } as UIMessage)
          setStatus('error')
          break

        default:
          break
      }
    },
    [appendMessage, replaceThinking],
  )

  const { send, abort } = useSSE({
    onEvent: handleEvent,
    onError: (err) => {
      appendMessage({
        id: `error-${Date.now()}`,
        type: 'error',
        content: err.message,
        timestamp: new Date(),
      } as UIMessage)
      setStatus('error')
    },
    onComplete: () => {
      if (status !== 'error') {
        setStatus('idle')
      }
    },
  })

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed) return

      const userMsg: UIMessage = {
        id: `user-${Date.now()}`,
        type: 'user',
        content: trimmed,
        timestamp: new Date(),
      } as UIMessage

      appendMessage(userMsg)
      setLastUserMessage(trimmed)
      setStatus('sending')
      void send(conversationId, trimmed)
    },
    [appendMessage, conversationId, send],
  )

  const loadConversation = useCallback(async (convId: string) => {
    setConversationId(convId)
    setStatus('idle')

    const data: ChatMessage[] = await getConversationMessages(convId)

    const uiMessages: UIMessage[] = data
      .filter(
        (m) =>
          m.type === 'message' && (m.role === 'user' || m.role === 'assistant'),
      )
      .map((m) => ({
        id: m.id,
        type: m.role as UIMessageType,
        content: m.content ?? '',
        timestamp: new Date(m.created_at),
      }))

    setMessages(uiMessages)
  }, [])

  const newConversation = useCallback(() => {
    abort()
    setConversationId(null)
    setTitle(null)
    setMessages([])
    setStatus('idle')
    setLastUserMessage(null)
  }, [abort])

  const value: UseChatReturn = useMemo(
    () => ({
      messages,
      status,
      conversationId,
      title,
      sendMessage,
      loadConversation,
      newConversation,
      lastUserMessage,
    }),
    [
      conversationId,
      lastUserMessage,
      loadConversation,
      messages,
      newConversation,
      sendMessage,
      status,
      title,
    ],
  )

  return value
}

