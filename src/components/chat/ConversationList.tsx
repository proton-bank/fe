import { PlusIcon } from '@heroicons/react/24/outline'
import { useConversations } from '../../hooks/useConversations'
import { ConversationItem } from './ConversationItem'

interface ConversationListProps {
  onClose: () => void
  onNewConversation: () => void
  onOpenConversation: (conversationId: string) => void
}

export function ConversationList({
  onClose,
  onNewConversation,
  onOpenConversation,
}: ConversationListProps) {
  const { conversations, loading, refresh } = useConversations()

  return (
    <div className="flex h-full flex-col">
      <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Proton AI
          </p>
          <p className="text-sm font-medium text-slate-100">
            Hội thoại gần đây
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={refresh}
            className="rounded-full px-2 py-1 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          >
            Refresh
          </button>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-2 py-1 text-xs text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          >
            Đóng
          </button>
        </div>
      </header>

      <div className="border-b border-slate-800 px-4 py-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onNewConversation}
            className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-primary/90"
          >
            <PlusIcon className="h-3.5 w-3.5" />
            Cuộc chat mới
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2 text-sm">
        {loading && (
          <p className="px-2 py-2 text-xs text-slate-500">Đang tải hội thoại…</p>
        )}
        {!loading && conversations.length === 0 && (
          <p className="px-2 py-2 text-xs text-slate-500">
            Chưa có hội thoại nào. Bắt đầu cuộc chat mới với Proton AI.
          </p>
        )}
        <div className="space-y-1">
          {conversations.map((conv) => (
            <ConversationItem
              key={conv.id}
              conversation={conv}
              isActive={false}
              onClick={() => onOpenConversation(conv.id)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

