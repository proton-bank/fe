import { useState } from 'react'
import { useChatContext } from '../../contexts/ChatContext'
import type { ChatPanelView } from '../../types/chat'
import { ConversationList } from './ConversationList'
import { ChatWindow } from './ChatWindow'

export function ChatPanel() {
  const { isOpen, closeChat, panelWidth, setPanelWidth } = useChatContext()
  const [view, setView] = useState<ChatPanelView>('conversation_list')
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    null,
  )

  const handleOpenConversation = (conversationId: string) => {
    setActiveConversationId(conversationId)
    setView('active_chat')
  }

  const handleNewConversation = () => {
    setActiveConversationId(null)
    setView('active_chat')
  }

  const handleBackToList = () => {
    setView('conversation_list')
  }

  const handleResizeStart = (event: React.MouseEvent<HTMLDivElement>) => {
    event.preventDefault()

    const startX = event.clientX
    const startWidth = panelWidth

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = startX - moveEvent.clientX
      const nextWidth = startWidth + deltaX
      setPanelWidth(nextWidth)
    }

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }

    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <>
      {/* Desktop & tablet panel */}
      <aside
        className={`pointer-events-none fixed right-0 top-[56px] z-40 hidden h-[calc(100vh-56px)] transform border-l border-slate-800 bg-slate-950/95 shadow-[rgba(0,0,0,0.45)_-4px_0_24px] transition-transform duration-300 lg:block ${
          isOpen ? 'pointer-events-auto translate-x-0' : 'translate-x-full'
        }`}
        style={{ width: panelWidth }}
      >
        <div
          className="absolute left-0 top-0 hidden h-full w-1 cursor-col-resize lg:block"
          onMouseDown={handleResizeStart}
        />
        <div className="flex h-full flex-col">
          {view === 'conversation_list' ? (
            <ConversationList
              onClose={closeChat}
              onNewConversation={handleNewConversation}
              onOpenConversation={handleOpenConversation}
            />
          ) : (
            <ChatWindow
              activeConversationId={activeConversationId}
              onBack={handleBackToList}
              onClose={closeChat}
              onNewConversation={handleNewConversation}
            />
          )}
        </div>
      </aside>

      {/* Mobile full-screen overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="flex h-full w-full flex-col border-l border-slate-800 bg-slate-950">
            {view === 'conversation_list' ? (
              <ConversationList
                onClose={closeChat}
                onNewConversation={handleNewConversation}
                onOpenConversation={handleOpenConversation}
              />
            ) : (
              <ChatWindow
                activeConversationId={activeConversationId}
                onBack={handleBackToList}
                onClose={closeChat}
                onNewConversation={handleNewConversation}
              />
            )}
          </div>
        </div>
      )}
    </>
  )
}

