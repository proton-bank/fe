import { format } from 'date-fns'
import type { Conversation } from '../../types/chat'

interface ConversationItemProps {
  conversation: Conversation
  isActive: boolean
  onClick: () => void
}

export function ConversationItem({
  conversation,
  isActive,
  onClick,
}: ConversationItemProps) {
  const updatedAt = new Date(conversation.updated_at)

  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full flex-col rounded-lg border border-transparent px-3 py-2 text-left text-sm transition-colors ${
        isActive
          ? 'border-primary/60 bg-slate-900'
          : 'hover:border-slate-700 hover:bg-slate-900/70'
      }`}
    >
      <span className="line-clamp-1 font-medium text-slate-100">
        {conversation.title ?? 'New conversation'}
      </span>
      <span className="mt-0.5 text-xs text-slate-500">
        {format(updatedAt, 'HH:mm - dd/MM')}
      </span>
    </button>
  )
}

