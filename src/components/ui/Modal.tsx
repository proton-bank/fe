import type { ReactNode } from 'react'
import clsx from 'clsx'
import { Button } from './Button'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: ReactNode
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses: Record<NonNullable<ModalProps['size']>, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 px-4">
      <div
        className={clsx(
          'w-full rounded-card border border-slate-700 bg-slate-900 shadow-lg',
          sizeClasses[size],
        )}
        role="dialog"
        aria-modal="true"
      >
        <header className="flex items-center justify-between border-b border-slate-800 px-5 py-3">
          {title && (
            <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-300">
              {title}
            </h2>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close dialog"
          >
            ✕
          </Button>
        </header>
        <div className="px-5 py-4 text-sm text-slate-100">{children}</div>
        {footer && (
          <footer className="flex items-center justify-end gap-3 border-t border-slate-800 px-5 py-3">
            {footer}
          </footer>
        )}
      </div>
    </div>
  )
}

