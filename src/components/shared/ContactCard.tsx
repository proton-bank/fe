import { Button } from '../ui/Button'

interface ContactCardProps {
  fullName: string
  username: string
  accountNumber: string
  nickname?: string
  onTransfer: () => void
  onDelete: () => void
}

export function ContactCard({
  fullName,
  username,
  accountNumber,
  nickname,
  onTransfer,
  onDelete,
}: ContactCardProps) {
  const initials = fullName
    .split(' ')
    .filter(Boolean)
    .slice(-2)
    .map((part) => part[0]?.toUpperCase())
    .join('')

  return (
    <div
      className="flex items-center justify-between gap-4 rounded-card border border-slate-800 bg-slate-900 px-4 py-3"
      draggable
      onDragStart={(event) => {
        if (!accountNumber) return
        event.dataTransfer.setData('text/plain', `<account_number:${accountNumber}>`)
      }}
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
          {initials || '?'}
        </div>
        <div>
          <p className="text-sm font-medium text-slate-100">
            {fullName}
            {nickname && (
              <span className="ml-2 text-xs text-slate-500">({nickname})</span>
            )}
          </p>
          <p className="text-xs text-slate-500">
            @{username} • {accountNumber}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button size="sm" variant="primary" onClick={onTransfer}>
          Transfer
        </Button>
        <Button size="sm" variant="ghost" onClick={onDelete}>
          Delete
        </Button>
      </div>
    </div>
  )
}

