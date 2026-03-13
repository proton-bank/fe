import { useToast } from '../../hooks/useToast'
import { Badge } from './Badge'

const variantLabel: Record<string, string> = {
  success: 'Success',
  error: 'Error',
  info: 'Info',
}

const variantBadge: Record<string, 'success' | 'error' | 'warning' | 'default'> =
  {
    success: 'success',
    error: 'error',
    info: 'default',
  }

export function ToastContainer() {
  const { toasts, dismissToast } = useToast()

  if (toasts.length === 0) return null

  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-50 flex justify-center px-4 sm:justify-end">
      <div className="flex max-w-sm flex-col gap-2">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto flex items-start gap-3 rounded-card border border-slate-800 bg-slate-900/95 px-4 py-3 text-sm shadow-lg"
          >
            <Badge variant={variantBadge[toast.variant] ?? 'default'}>
              {variantLabel[toast.variant] ?? 'Info'}
            </Badge>
            <div className="flex-1 text-slate-100">{toast.message}</div>
            <button
              type="button"
              onClick={() => dismissToast(toast.id)}
              className="ml-1 text-xs text-slate-500 hover:text-slate-200"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

