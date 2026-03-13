import type { UIMessage } from '../../types/chat'

interface ToolResultCardProps {
  message: UIMessage
}

export function ToolResultCard({ message }: ToolResultCardProps) {
  if (message.type !== 'tool_result') return null

  const isError =
    typeof message.toolOutput?.status === 'string' &&
    message.toolOutput.status !== 'success'

  const borderClass = isError ? 'border-red-400' : 'border-green-400'
  const icon = isError ? '❌' : '✅'

  return (
    <div
      className={`w-full max-w-md rounded-lg border-l-4 bg-slate-900/80 p-3 text-xs text-slate-100 ${borderClass}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-base">{icon}</span>
        <div>
          <p className="font-semibold">{message.toolName}</p>
          <p className="text-[11px] text-slate-400">
            {isError ? 'Kết quả (lỗi)' : 'Kết quả'}
          </p>
        </div>
      </div>
      {message.toolOutput && (
        <pre className="mt-2 max-h-40 overflow-auto rounded bg-slate-950/60 px-2 py-1 text-[11px] text-slate-300">
          {JSON.stringify(message.toolOutput, null, 2)}
        </pre>
      )}
    </div>
  )
}

