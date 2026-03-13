import { Button } from '../ui/Button'
import { useAuth } from '../../hooks/useAuth'

interface TopNavProps {
  onToggleSidebar: () => void
}

export function TopNav({ onToggleSidebar }: TopNavProps) {
  const { user, logout } = useAuth()

  return (
    <header className="flex items-center justify-between border-b border-slate-800 bg-slate-950/90 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-3">
        <button
          type="button"
          className="mr-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-800 text-slate-300 hover:bg-slate-900 lg:hidden"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
        >
          ☰
        </button>
        <span className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          Proton Bank
        </span>
      </div>
      <div className="flex items-center gap-3">
        {user && (
          <div className="hidden text-right text-xs text-slate-400 sm:block">
            <div className="font-medium text-slate-100">{user.username}</div>
            <div className="uppercase tracking-wide text-[10px] text-primary">
              {user.role}
            </div>
          </div>
        )}
        <Button size="sm" variant="ghost" onClick={logout}>
          Logout
        </Button>
      </div>
    </header>
  )
}

