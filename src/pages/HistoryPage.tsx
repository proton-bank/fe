import { useEffect, useState } from 'react'
import { Card } from '../components/ui/Card'
import { Table } from '../components/ui/Table'
import { Button } from '../components/ui/Button'
import { TransactionRow } from '../components/shared/TransactionRow'
import { getHistory } from '../api/transactions'
import type { TransactionResponse } from '../types/transaction'

export default function HistoryPage() {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([])
  const [limit, setLimit] = useState(20)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true)
        const data = await getHistory(limit)
        setTransactions(data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    void fetchHistory()
  }, [limit])

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight text-slate-50">
          Transaction History
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Review your recent deposits, withdrawals, and transfers.
        </p>
      </header>

      <section>
        <Card title={`Showing ${transactions.length} of ${limit} transactions`}>
          {transactions.length === 0 && !loading ? (
            <p className="text-sm text-slate-400">No transactions yet.</p>
          ) : (
            <>
              <Table>
                <thead className="border-b border-slate-800 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-3 py-2 text-left">Type</th>
                    <th className="px-3 py-2 text-left">Amount</th>
                    <th className="px-3 py-2 text-left">Counterpart</th>
                    <th className="px-3 py-2 text-left">Description</th>
                    <th className="px-3 py-2 text-left">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <TransactionRow
                      key={tx.id}
                      transaction={tx}
                      counterpartLabel={tx.to_account_id}
                    />
                  ))}
                </tbody>
              </Table>
              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <span>
                  Showing {transactions.length} of {limit} transactions
                </span>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={limit <= 20 || loading}
                    onClick={() => setLimit((prev) => Math.max(20, prev - 30))}
                  >
                    Show Less
                  </Button>
                  <Button
                    size="sm"
                    variant="secondary"
                    disabled={loading}
                    onClick={() => setLimit((prev) => prev + 30)}
                  >
                    Load More
                  </Button>
                </div>
              </div>
            </>
          )}
        </Card>
      </section>
    </div>
  )
}

