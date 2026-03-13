import { useCallback, useRef } from 'react'
import type { SSEEvent, SSEEventType } from '../types/chat'

interface UseSSEOptions {
  onEvent: (event: SSEEvent) => void
  onError: (error: Error) => void
  onComplete: () => void
}

export function useSSE({ onEvent, onError, onComplete }: UseSSEOptions) {
  const abortRef = useRef<AbortController | null>(null)

  const send = useCallback(
    async (conversationId: string | null, message: string) => {
      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller

      const token = localStorage.getItem('token')

      try {
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify({
            conversation_id: conversationId,
            message,
          }),
          signal: controller.signal,
        })

        if (!response.ok || !response.body) {
          throw new Error(`HTTP ${response.status}`)
        }

        const reader = response.body.getReader()
        const decoder = new TextDecoder()
        let buffer = ''

        while (true) {
          // eslint-disable-next-line no-await-in-loop
          const { done, value } = await reader.read()
          if (done) break

          buffer += decoder.decode(value, { stream: true })
          const lines = buffer.split('\n')
          buffer = lines.pop() || ''

          let currentEvent = ''
          let currentData = ''

          for (const line of lines) {
            if (line.startsWith('event: ')) {
              currentEvent = line.slice(7).trim()
            } else if (line.startsWith('data: ')) {
              currentData = line.slice(6).trim()
            } else if (line === '' && currentEvent && currentData) {
              try {
                const parsed: SSEEvent = {
                  event: currentEvent as SSEEventType,
                  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                  data: JSON.parse(currentData),
                }
                onEvent(parsed)
              } catch (error) {
                // eslint-disable-next-line no-console
                console.error('SSE parse error:', error)
              }
              currentEvent = ''
              currentData = ''
            }
          }
        }

        onComplete()
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          onError(error as Error)
        }
      }
    },
    [onComplete, onError, onEvent],
  )

  const abort = useCallback(() => {
    abortRef.current?.abort()
  }, [])

  return { send, abort }
}

