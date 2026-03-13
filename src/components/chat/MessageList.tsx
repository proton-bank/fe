import { useEffect, useRef } from 'react'
import type { ChatStatus, UIMessage } from '../../types/chat'
import { ChatMessage } from './ChatMessage'
import { ToolCallCard } from './ToolCallCard'
import { ToolResultCard } from './ToolResultCard'
import { ThinkingIndicator } from './ThinkingIndicator'

interface MessageListProps {
  messages: UIMessage[]
  status: ChatStatus
}

export function MessageList({ messages }: MessageListProps) {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const isNearBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight < 100

    if (isNearBottom) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <div
      ref={containerRef}
      className="flex-1 overflow-y-auto px-4 py-3 text-sm text-slate-100"
    >
      <div className="flex flex-col gap-2">
        {messages.map((m) => {
          if (m.type === 'tool_call') {
            return <ToolCallCard key={m.id} message={m} />
          }
          if (m.type === 'tool_result') {
            return <ToolResultCard key={m.id} message={m} />
          }
          if (m.type === 'thinking') {
            return (
              <div key={m.id} className="flex justify-start">
                <ThinkingIndicator />
              </div>
            )
          }
          return <ChatMessage key={m.id} message={m} />
        })}
      </div>
      <div ref={endRef} />
    </div>
  )
}

