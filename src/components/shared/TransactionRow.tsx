import type { TransactionResponse } from '../../types/transaction'
import { formatCurrency } from '../../utils/formatCurrency'
import { formatRelativeDate } from '../../utils/formatDate'

interface TransactionRowProps {
  transaction: TransactionResponse
  counterpartLabel: string
}

export function TransactionRow({
  transaction,
  counterpartLabel,
}: TransactionRowProps) {
  const isIncoming =
    transaction.type === 'deposit' ||
    (transaction.type === 'transfer' && transaction.amount > 0)

  const sign = isIncoming ? '+' : '-'
  const amountClass = isIncoming ? 'text-success' : 'text-error'
  const icon = transaction.type === 'deposit' ? '↙' : '↗'

  return (
    <tr className="border-b border-slate-800/60 text-sm">
      <td className="px-3 py-2 text-slate-300">
        <span className="mr-1">{icon}</span>
        <span className="capitalize">{transaction.type}</span>
      </td>
      <td className={`px-3 py-2 font-medium ${amountClass}`}>
        {sign}
        {formatCurrency(Math.abs(transaction.amount))}
      </td>
      <td className="px-3 py-2 text-slate-300">{counterpartLabel}</td>
      <td className="px-3 py-2 text-slate-400">{transaction.description}</td>
      <td className="px-3 py-2 text-slate-500">
        {formatRelativeDate(transaction.created_at)}
      </td>
    </tr>
  )
}

