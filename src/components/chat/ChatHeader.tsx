import {
  ArrowLeftIcon,
  PlusIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline'

interface ChatHeaderProps {
  title: string | null
  showBack: boolean
  onBack: () => void
  onNewConversation: () => void
  onClose: () => void
}

export function ChatHeader({
  title,
  showBack,
  onBack,
  onNewConversation,
  onClose,
}: ChatHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-slate-800 px-4 py-3">
      <div className="flex items-center gap-2">
        {showBack && (
          <button
            type="button"
            onClick={onBack}
            className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100 lg:hidden"
            aria-label="Quay lại danh sách"
          >
            <ArrowLeftIcon className="h-4 w-4" />
          </button>
        )}
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Proton AI Assistant
          </p>
          <p className="text-sm font-medium text-slate-100">
            {title ?? 'Cuộc hội thoại mới'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={onNewConversation}
          className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium text-slate-200 hover:bg-slate-800"
        >
          <PlusIcon className="h-3.5 w-3.5" />
          New
        </button>
        <button
          type="button"
          onClick={onClose}
          className="rounded-full p-1 text-slate-400 hover:bg-slate-800 hover:text-slate-100"
          aria-label="Đóng chat"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}

