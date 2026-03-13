import { Card } from '../ui/Card'
import { formatCurrency } from '../../utils/formatCurrency'

interface AccountCardProps {
  balance: number
  currency: string
  accountNumber: string
}

export function AccountCard({
  balance,
  currency,
  accountNumber,
}: AccountCardProps) {
  return (
    <Card title="Account Balance">
      <p className="text-3xl font-semibold text-slate-50">
        {formatCurrency(balance, currency)}
      </p>
      <p className="mt-2 text-sm text-slate-400">Account: {accountNumber}</p>
      <p className="mt-1 text-xs text-slate-500">Currency: {currency}</p>
    </Card>
  )
}

