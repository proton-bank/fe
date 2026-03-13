import { SparklesIcon } from '@heroicons/react/24/outline'
import { useChatContext } from '../../contexts/ChatContext'

export function ChatToggleButton() {
  const { isOpen, toggleChat } = useChatContext()

  // Khi panel đang mở thì ẩn nút nổi để không che UI chat
  if (isOpen) return null

  return (
    <button
      type="button"
      onClick={toggleChat}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-medium text-white shadow-lg shadow-primary/40 transition-transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/60 focus:ring-offset-2 focus:ring-offset-slate-900"
      aria-label="Open AI chat"
    >
      <span className="relative flex h-7 w-7 items-center justify-center overflow-hidden rounded-full bg-slate-950/80">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
        <SparklesIcon className="relative h-4 w-4" />
      </span>
      <span className="hidden sm:inline">Hỏi Proton AI</span>
    </button>
  )
}

