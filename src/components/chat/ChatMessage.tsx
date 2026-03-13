import type { UIMessage } from '../../types/chat'
import { MarkdownRenderer } from './MarkdownRenderer'

interface ChatMessageProps {
  message: UIMessage
}

export function ChatMessage({ message }: ChatMessageProps) {
  if (message.type !== 'user' && message.type !== 'assistant' && message.type !== 'error') {
    return null
  }

  const isUser = message.type === 'user'
  const isError = message.type === 'error'

  const bubbleBase =
    'max-w-[80%] rounded-2xl px-3 py-2 text-sm shadow-sm border border-slate-800'

  const bubbleClass = isUser
    ? 'ml-auto bg-primary text-white'
    : isError
      ? 'bg-red-950/60 text-red-100 border-red-500/40'
      : 'mr-auto bg-slate-900 text-slate-50'

  return (
    <div className={`flex w-full ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={bubbleBase.concat(' ', bubbleClass)}>
        {isUser ? (
          <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>
        ) : isError ? (
          <p className="whitespace-pre-wrap break-words text-sm">{message.content}</p>
        ) : (
          <MarkdownRenderer content={message.content ?? ''} />
        )}
      </div>
    </div>
  )
}

