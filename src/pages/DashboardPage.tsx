import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AccountCard } from '../components/shared/AccountCard'
import { Card } from '../components/ui/Card'
import { Table } from '../components/ui/Table'
import { TransactionRow } from '../components/shared/TransactionRow'
import { useAccount } from '../hooks/useAccount'
import { useAuth } from '../hooks/useAuth'
import { useChatContext } from '../contexts/ChatContext'
import { getHistory } from '../api/transactions'
import { getSystemBalance } from '../api/accounts'
import type { TransactionResponse } from '../types/transaction'
import { formatCurrency } from '../utils/formatCurrency'

export default function DashboardPage() {
  const { user } = useAuth()
  const { account, loading: accountLoading } = useAccount()
  const [recentTransactions, setRecentTransactions] = useState<TransactionResponse[]>([])
  const [systemBalance, setSystemBalance] = useState<number | null>(null)

  useEffect(() => {
    const fetchRecent = async () => {
      try {
        const data = await getHistory(5)
        setRecentTransactions(data)
      } catch (err) {
        console.error(err)
      }
    }
    void fetchRecent()
  }, [])

  useEffect(() => {
    const fetchSystemBalance = async () => {
      try {
        const { system_balance } = await getSystemBalance()
        setSystemBalance(system_balance)
      } catch (err) {
        console.error(err)
      }
    }
    void fetchSystemBalance()
  }, [])

  const greetingName = user?.username ?? 'there'
  const { openChat } = useChatContext()

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight text-slate-50">
          Good morning, {greetingName}!
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Overview of your Proton Bank account.
        </p>
      </header>

      <section className="space-y-4">
        {account && !accountLoading ? (
          <AccountCard
            balance={account.balance}
            currency={account.currency}
            accountNumber={account.account_number}
          />
        ) : (
          <Card title="Account Balance">
            <div className="h-16 animate-pulse rounded-md bg-slate-800/70" />
          </Card>
        )}

        <Card
          title="Total bank balance"
          description="Sum of all accounts (demo: deposit/withdraw/transfer are zero-sum)"
        >
          {systemBalance !== null ? (
            <p className="text-2xl font-semibold text-emerald-400">
              {formatCurrency(systemBalance, account?.currency ?? 'VND')}
            </p>
          ) : (
            <div className="h-8 w-32 animate-pulse rounded-md bg-slate-800/70" />
          )}
        </Card>
      </section>

      <section>
        <Card title="Quick actions">
          <div className="flex flex-wrap gap-3">
            <Link
              to="/transfer"
              className="inline-flex items-center rounded-full border border-slate-700 px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-primary hover:text-primary"
            >
              Chuyển tiền nhanh
            </Link>
            <button
              type="button"
              onClick={openChat}
              className="inline-flex items-center gap-1 rounded-full bg-primary px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-primary/90"
            >
              <span className="text-sm">✦</span>
              <span>Hỏi Proton AI</span>
            </button>
          </div>
        </Card>
      </section>

      <section>
        <Card title="Recent Transactions" description="5 most recent">
          {recentTransactions.length === 0 ? (
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
                  {recentTransactions.map((tx) => (
                    <TransactionRow
                      key={tx.id}
                      transaction={tx}
                      counterpartLabel={tx.to_account_id}
                    />
                  ))}
                </tbody>
              </Table>
              <div className="mt-3 text-right">
                <Link
                  to="/history"
                  className="text-xs font-medium text-primary hover:underline"
                >
                  View All →
                </Link>
              </div>
            </>
          )}
        </Card>
      </section>
    </div>
  )
}

