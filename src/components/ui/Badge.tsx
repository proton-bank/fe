import type { ReactNode } from 'react'
import clsx from 'clsx'

type BadgeVariant = 'default' | 'success' | 'error' | 'warning' | 'outline'

interface BadgeProps {
  children: ReactNode
  variant?: BadgeVariant
  className?: string
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-slate-800 text-slate-100',
  success: 'bg-success/10 text-success border border-success/40',
  error: 'bg-error/10 text-error border border-error/40',
  warning: 'bg-warning/10 text-warning border border-warning/40',
  outline: 'border border-slate-600 text-slate-200',
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  )
}

