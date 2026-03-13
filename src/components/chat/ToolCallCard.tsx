import type { UIMessage } from '../../types/chat'

const TOOL_DISPLAY_MAP: Record<
  string,
  { label: string; icon: string; colorClass: string }
> = {
  get_account_balance: {
    label: 'Kiểm tra số dư',
    icon: '💰',
    colorClass: 'border-blue-400',
  },
  lookup_account: {
    label: 'Tra cứu tài khoản',
    icon: '🔍',
    colorClass: 'border-purple-400',
  },
  transfer_money: {
    label: 'Chuyển tiền',
    icon: '💸',
    colorClass: 'border-green-400',
  },
  get_transaction_history: {
    label: 'Lịch sử giao dịch',
    icon: '📋',
    colorClass: 'border-orange-400',
  },
  search_faq: {
    label: 'Tìm kiếm FAQ',
    icon: '❓',
    colorClass: 'border-teal-400',
  },
  list_contacts: {
    label: 'Danh bạ',
    icon: '👥',
    colorClass: 'border-indigo-400',
  },
  add_contact: {
    label: 'Thêm liên hệ',
    icon: '➕',
    colorClass: 'border-cyan-400',
  },
}

interface ToolCallCardProps {
  message: UIMessage
}

export function ToolCallCard({ message }: ToolCallCardProps) {
  if (message.type !== 'tool_call') return null

  const config =
    TOOL_DISPLAY_MAP[message.toolName] ??
    ({ label: message.toolName, icon: '🔧', colorClass: 'border-slate-400' } as const)

  return (
    <div
      className={`w-full max-w-md rounded-lg border-l-4 bg-slate-900/80 p-3 text-xs text-slate-100 ${config.colorClass}`}
    >
      <div className="flex items-center gap-2">
        <span className="text-base">{config.icon}</span>
        <div>
          <p className="font-semibold">{config.label}</p>
          <p className="text-[11px] text-slate-400">{message.toolName}</p>
        </div>
      </div>
      {message.toolArguments && (
        <pre className="mt-2 max-h-40 overflow-auto rounded bg-slate-950/60 px-2 py-1 text-[11px] text-slate-300">
          {JSON.stringify(message.toolArguments, null, 2)}
        </pre>
      )}
    </div>
  )
}

