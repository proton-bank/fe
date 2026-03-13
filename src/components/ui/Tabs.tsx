import type { ReactNode } from 'react'
import clsx from 'clsx'

export interface TabOption {
  id: string
  label: string
}

interface TabsProps {
  tabs: TabOption[]
  activeId: string
  onChange: (id: string) => void
  className?: string
}

export function Tabs({ tabs, activeId, onChange, className }: TabsProps) {
  return (
    <div
      className={clsx(
        'inline-flex rounded-full border border-slate-800 bg-slate-900 p-1 text-sm',
        className,
      )}
      role="tablist"
      aria-label="Tabs"
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeId
        return (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={clsx(
              'rounded-full px-4 py-1.5 transition-colors',
              isActive
                ? 'bg-primary text-white'
                : 'text-slate-300 hover:bg-slate-800',
            )}
            onClick={() => onChange(tab.id)}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}

interface TabsContentProps {
  whenActive: string
  activeId: string
  children: ReactNode
}

export function TabsContent({
  whenActive,
  activeId,
  children,
}: TabsContentProps) {
  if (whenActive !== activeId) return null
  return <div className="mt-4">{children}</div>
}

