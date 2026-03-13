import type { ReactNode, TableHTMLAttributes } from 'react'
import clsx from 'clsx'

interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  children: ReactNode
}

export function Table({ children, className, ...props }: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table
        className={clsx(
          'min-w-full border-collapse text-sm text-slate-100',
          className,
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  )
}

