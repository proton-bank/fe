import type { ReactNode } from 'react'
import clsx from 'clsx'

interface AccordionItemProps {
  title: ReactNode
  children: ReactNode
  isOpen: boolean
  onToggle: () => void
}

export function AccordionItem({
  title,
  children,
  isOpen,
  onToggle,
}: AccordionItemProps) {
  return (
    <div className="border-b border-slate-800">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 px-4 py-3 text-left text-sm text-slate-100 hover:bg-slate-900"
        onClick={onToggle}
      >
        <span>{title}</span>
        <span
          className={clsx(
            'text-slate-500 transition-transform',
            isOpen ? 'rotate-90' : '',
          )}
          aria-hidden="true"
        >
          ▶
        </span>
      </button>
      {isOpen && (
        <div className="px-4 pb-4 text-sm text-slate-300">{children}</div>
      )}
    </div>
  )
}

