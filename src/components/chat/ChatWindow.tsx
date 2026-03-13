import { useMemo } from 'react'
import { useChat } from '../../hooks/useChat'
import type { ChatStatus } from '../../types/chat'
import { ChatHeader } from './ChatHeader'
import { MessageList } from './MessageList'
import { ChatInput } from './ChatInput'

interface ChatWindowProps {
  activeConversationId: string | null
  onBack: () => void
  onClose: () => void
  onNewConversation: () => void
}

export function ChatWindow({
  activeConversationId,
  onBack,
  onClose,
  onNewConversation,
}: ChatWindowProps) {
  const { messages, status, conversationId, title, sendMessage, loadConversation, newConversation, lastUserMessage } =
    useChat()

  const isExistingConversation = useMemo(
    () => Boolean(activeConversationId),
    [activeConversationId],
  )

  if (activeConversationId && activeConversationId !== conversationId) {
    void loadConversation(activeConversationId)
  }

  const handleRetry = () => {
    if (lastUserMessage) {
      sendMessage(lastUserMessage)
    }
  }

  const handleNewConversation = () => {
    newConversation()
    onNewConversation()
  }

  const showRetry = status === 'error' && Boolean(lastUserMessage)

  return (
    <div className="flex h-full flex-col">
      <ChatHeader
        title={title}
        showBack={isExistingConversation}
        onBack={onBack}
        onNewConversation={handleNewConversation}
        onClose={onClose}
      />
      <MessageList messages={messages} status={status} />
      <div className="border-t border-slate-800 px-3 py-2">
        {showRetry && (
          <div className="mb-2 rounded-md border border-red-500/40 bg-red-950/40 px-3 py-2 text-xs text-red-200">
            <div className="flex items-center justify-between gap-2">
              <span>Đã xảy ra lỗi trong lần trả lời trước.</span>
              <button
                type="button"
                onClick={handleRetry}
                className="rounded-full bg-red-500 px-2 py-0.5 text-[11px] font-medium text-white hover:bg-red-400"
              >
                Thử lại
              </button>
            </div>
          </div>
        )}
        <ChatInput onSend={sendMessage} status={status as ChatStatus} />
      </div>
    </div>
  )
}

