import { useEffect, useRef, useState, type DragEventHandler } from 'react'
import type { ChatStatus } from '../../types/chat'

interface ChatInputProps {
  onSend: (text: string) => void
  status: ChatStatus
}

export function ChatInput({ onSend, status }: ChatInputProps) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const disabled = status !== 'idle'

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = '0px'
    const next = Math.min(el.scrollHeight, 4 * 24)
    el.style.height = `${next}px`
  }, [value])

  const handleSend = () => {
    if (!value.trim()) return
    onSend(value)
    setValue('')
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      if (!disabled) {
        handleSend()
      }
    }
  }

  const handleDrop: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
    if (disabled) return
    const dropped = event.dataTransfer.getData('text/plain')
    if (!dropped) return
    setValue((prev) => (prev ? `${prev} ${dropped}` : dropped))
    textareaRef.current?.focus()
  }

  const handleDragOver: DragEventHandler<HTMLDivElement> = (event) => {
    event.preventDefault()
  }

  return (
    <div className="flex items-end gap-2">
      <div
        className="flex-1 rounded-xl border border-slate-800 bg-slate-950/60 px-2 py-1"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <textarea
          ref={textareaRef}
          rows={1}
          className="max-h-28 w-full resize-none bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-500"
          placeholder="Nhập tin nhắn cho Proton AI…"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
        />
      </div>
      <button
        type="button"
        onClick={handleSend}
        disabled={disabled || !value.trim()}
        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-white shadow-sm transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-slate-700"
        aria-label="Gửi tin nhắn"
      >
        ➤
      </button>
    </div>
  )
}

