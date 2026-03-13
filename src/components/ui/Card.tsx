import type { ReactNode } from 'react'
import clsx from 'clsx'

interface CardProps {
  title?: ReactNode
  description?: ReactNode
  children: ReactNode
  className?: string
  headerRight?: ReactNode
}

export function Card({
  title,
  description,
  children,
  className,
  headerRight,
}: CardProps) {
  return (
    <section
      className={clsx(
        'rounded-card border border-slate-800 bg-slate-900/60 p-5 shadow-sm',
        className,
      )}
    >
      {(title || description || headerRight) && (
        <header className="mb-4 flex items-start justify-between gap-4">
          <div>
            {title && (
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-1 text-sm text-slate-400">{description}</p>
            )}
          </div>
          {headerRight}
        </header>
      )}
      <div>{children}</div>
    </section>
  )
}

