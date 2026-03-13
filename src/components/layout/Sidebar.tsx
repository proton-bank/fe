import { NavLink } from 'react-router-dom'
import clsx from 'clsx'
import { useChatContext } from '../../contexts/ChatContext'

interface SidebarProps {
  isOpenMobile: boolean
  onCloseMobile: () => void
}

const baseLinkClasses =
  'flex items-center gap-2 rounded-full px-3 py-2 text-sm transition-colors'

export function Sidebar({ isOpenMobile, onCloseMobile }: SidebarProps) {
  const { openChat } = useChatContext()
  const navItems = [
    { to: '/dashboard', label: 'Dashboard' },
    { to: '/transfer', label: 'Transactions' },
    { to: '/history', label: 'History' },
    { to: '/users', label: 'Users' },
    { to: '/faq', label: 'FAQ' },
  ]

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden w-60 flex-shrink-0 border-r border-slate-800 bg-slate-950/80 px-3 py-4 lg:block">
        <nav className="space-y-6 text-sm text-slate-300">
          <div>
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Banking
            </p>
            <div className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    clsx(
                      baseLinkClasses,
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-slate-300 hover:bg-slate-900',
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
          <div className="pt-4">
            <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
              Assistants
            </p>
            <div className="space-y-1">
              <button
                type="button"
                onClick={openChat}
                className="flex w-full items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/20"
              >
                <span className="text-sm">✦</span>
                <span>Proton AI Chat</span>
              </button>
            </div>
          </div>
        </nav>
      </aside>

      {/* Mobile sidebar overlay */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="w-64 border-r border-slate-800 bg-slate-950 px-3 py-4">
            <nav className="space-y-6 text-sm text-slate-300">
              <div>
                <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
                  Banking
                </p>
                <div className="space-y-1">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      onClick={onCloseMobile}
                      className={({ isActive }) =>
                        clsx(
                          baseLinkClasses,
                          isActive
                            ? 'bg-primary text-white'
                            : 'text-slate-300 hover:bg-slate-900',
                        )
                      }
                    >
                      {item.label}
                    </NavLink>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      openChat()
                      onCloseMobile()
                    }}
                    className="mt-4 flex w-full items-center gap-2 rounded-full bg-primary/10 px-3 py-2 text-xs font-medium text-primary hover:bg-primary/20"
                  >
                    <span className="text-sm">✦</span>
                    <span>Proton AI Chat</span>
                  </button>
                </div>
              </div>
            </nav>
          </div>
          <button
            type="button"
            className="flex-1 bg-black/50"
            aria-label="Close navigation"
            onClick={onCloseMobile}
          />
        </div>
      )}
    </>
  )
}

