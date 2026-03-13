export function ThinkingIndicator() {
  return (
    <div className="inline-flex items-center gap-2 rounded-full bg-slate-800/80 px-3 py-1 text-xs text-slate-200">
      <span className="text-primary">✦</span>
      <span className="flex items-center gap-1">
        <span className="flex h-1.5 w-6 items-center justify-between">
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-300" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
          <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-500 [animation-delay:-0.3s]" />
        </span>
        <span>AI đang suy nghĩ…</span>
      </span>
    </div>
  )
}

