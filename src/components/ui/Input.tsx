import type { InputHTMLAttributes, ReactNode } from 'react'
import clsx from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}: InputProps) {
  const inputId = id ?? props.name
  const describedById = error ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined

  return (
    <div className="space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-slate-200"
        >
          {label}
        </label>
      )}
      <div
        className={clsx(
          'flex items-center rounded-input border bg-slate-900 px-3 py-2 text-sm',
          error ? 'border-error' : 'border-slate-700 focus-within:border-primary',
        )}
      >
        {leftIcon && (
          <span className="mr-2 text-slate-500" aria-hidden="true">
            {leftIcon}
          </span>
        )}
        <input
          id={inputId}
          className={clsx(
            'flex-1 bg-transparent text-slate-100 outline-none placeholder:text-slate-600',
            className,
          )}
          aria-invalid={!!error}
          aria-describedby={describedById}
          {...props}
        />
        {rightIcon && (
          <span className="ml-2 text-slate-500" aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </div>
      {error ? (
        <p id={describedById} className="text-xs text-error">
          {error}
        </p>
      ) : helperText ? (
        <p id={describedById} className="text-xs text-slate-400">
          {helperText}
        </p>
      ) : null}
    </div>
  )
}

