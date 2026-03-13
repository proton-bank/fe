import { useEffect, useState, type FormEvent } from 'react'
import { Card } from '../components/ui/Card'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Tabs, TabsContent } from '../components/ui/Tabs'
import { useAccount } from '../hooks/useAccount'
import { useToast } from '../hooks/useToast'
import { getContacts } from '../api/contacts'
import { deposit, getHistory, transfer, withdraw } from '../api/transactions'
import type {
  DepositRequest,
  TransferRequest,
  WithdrawRequest,
} from '../types/transaction'
import type { ContactResponse } from '../types/contact'
import { formatCurrency } from '../utils/formatCurrency'

type ActiveTab = 'transfer' | 'deposit' | 'withdraw'

export default function TransferPage() {
  const { account } = useAccount()
  const { showToast } = useToast()

  const [activeTab, setActiveTab] = useState<ActiveTab>('transfer')
  const [contacts, setContacts] = useState<ContactResponse[]>([])

  // Transfer form state
  const [recipientAccount, setRecipientAccount] = useState('')
  const [selectedContactId, setSelectedContactId] = useState<string | ''>('')
  const [amount, setAmount] = useState('')
  const [description, setDescription] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Deposit / Withdraw
  const [dwAmount, setDwAmount] = useState('')
  const [dwDescription, setDwDescription] = useState('')

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await getContacts()
        setContacts(data)
      } catch (err) {
        console.error(err)
      }
    }
    void fetchContacts()
  }, [])

  const handleSelectContact = (contactId: string) => {
    setSelectedContactId(contactId)
    const contact = contacts.find((c) => c.id === contactId)
    if (contact) {
      setRecipientAccount(contact.contact_account_number)
    }
  }

  const handleTransferSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!recipientAccount || !amount) {
      showToast('Please fill recipient and amount', 'error')
      return
    }
    const value = Number(amount)
    if (Number.isNaN(value) || value <= 0) {
      showToast('Amount must be a positive number', 'error')
      return
    }

    const payload: TransferRequest = {
      to_account_number: recipientAccount,
      amount: value,
      description: description || undefined,
    }

    try {
      setSubmitting(true)
      await transfer(payload)
      showToast('Transfer successful', 'success')
      setDescription('')
      setAmount('')
      setSelectedContactId('')
      await getHistory(5) // fire-and-forget to warm cache
    } catch (err) {
      console.error(err)
      showToast('Transfer failed', 'error')
    } finally {
      setSubmitting(false)
    }
  }

  const handleDepositWithdraw = async (
    e: FormEvent,
    type: 'deposit' | 'withdraw',
  ) => {
    e.preventDefault()
    if (!dwAmount) {
      showToast('Amount is required', 'error')
      return
    }
    const value = Number(dwAmount)
    if (Number.isNaN(value) || value <= 0) {
      showToast('Amount must be a positive number', 'error')
      return
    }

    const payload: DepositRequest | WithdrawRequest = {
      amount: value,
      description: dwDescription || undefined,
    }

    try {
      setSubmitting(true)
      if (type === 'deposit') {
        await deposit(payload)
        showToast('Deposit successful', 'success')
      } else {
        await withdraw(payload)
        showToast('Withdraw successful', 'success')
      }
      setDwAmount('')
      setDwDescription('')
      await getHistory(5)
    } catch (err) {
      console.error(err)
      showToast(
        type === 'deposit' ? 'Deposit failed' : 'Withdraw failed',
        'error',
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-1">
        <h1 className="text-xl font-semibold tracking-tight text-slate-50">
          Transfer Money
        </h1>
        <p className="text-sm text-slate-400">
          Transfer, deposit, or withdraw from your Proton Bank account.
        </p>
      </header>

      <section className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <Tabs
            tabs={[
              { id: 'transfer', label: 'Transfer' },
              { id: 'deposit', label: 'Deposit' },
              { id: 'withdraw', label: 'Withdraw' },
            ]}
            activeId={activeTab}
            onChange={(id) => setActiveTab(id as ActiveTab)}
          />
          {account && (
            <p className="text-xs text-slate-400">
              Your balance:{' '}
              <span className="font-medium text-slate-100">
                {formatCurrency(account.balance, account.currency)}
              </span>
            </p>
          )}
        </div>

        <TabsContent whenActive="transfer" activeId={activeTab}>
          <Card title="Step 1: Recipient">
            <div className="space-y-4">
              <Input
                label="To Account Number"
                value={recipientAccount}
                onChange={(e) => setRecipientAccount(e.target.value)}
                helperText="Paste or select from your contacts"
              />
              <div className="space-y-2">
                <p className="text-xs font-medium text-slate-400">
                  Or select from contacts
                </p>
                <select
                  className="w-full rounded-input border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-100"
                  value={selectedContactId}
                  onChange={(e) => handleSelectContact(e.target.value)}
                >
                  <option value="">Select contact...</option>
                  {contacts.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.contact_full_name} ({c.contact_account_number})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          <form className="mt-4 space-y-4" onSubmit={handleTransferSubmit}>
            <Card title="Step 2: Amount & Description">
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Amount (VND)"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
                <Input
                  label="Description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  helperText="Optional"
                />
              </div>
            </Card>

            <Card title="Step 3: Confirm">
              <div className="space-y-3 text-sm text-slate-300">
                <p>
                  From:{' '}
                  <span className="font-mono text-xs">
                    {account?.account_number ?? '...'}
                  </span>
                </p>
                <p>
                  To:{' '}
                  <span className="font-mono text-xs">
                    {recipientAccount || 'Not set'}
                  </span>
                </p>
                <p>
                  Amount:{' '}
                  <span className="font-medium">
                    {amount ? `${amount} VND` : '0 VND'}
                  </span>
                </p>
                {description && (
                  <p>
                    Description:{' '}
                    <span className="font-medium">{description}</span>
                  </p>
                )}
              </div>
              <div className="mt-4 flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setRecipientAccount('')
                    setDescription('')
                    setAmount('')
                    setSelectedContactId('')
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" isLoading={submitting}>
                  Confirm Transfer
                </Button>
              </div>
            </Card>
          </form>
        </TabsContent>

        <TabsContent whenActive="deposit" activeId={activeTab}>
          <form
            className="space-y-4"
            onSubmit={(e) => handleDepositWithdraw(e, 'deposit')}
          >
            <Card title="Deposit">
              <div className="space-y-4">
                <Input
                  label="Amount (VND)"
                  value={dwAmount}
                  onChange={(e) => setDwAmount(e.target.value)}
                />
                <Input
                  label="Description"
                  value={dwDescription}
                  onChange={(e) => setDwDescription(e.target.value)}
                  helperText="Optional"
                />
                {account && (
                  <p className="text-xs text-slate-400">
                    Current balance:{' '}
                    <span className="font-medium text-slate-100">
                      {formatCurrency(account.balance, account.currency)}
                    </span>
                  </p>
                )}
              </div>
            </Card>
            <Button type="submit" isLoading={submitting}>
              Confirm Deposit
            </Button>
          </form>
        </TabsContent>

        <TabsContent whenActive="withdraw" activeId={activeTab}>
          <form
            className="space-y-4"
            onSubmit={(e) => handleDepositWithdraw(e, 'withdraw')}
          >
            <Card title="Withdraw">
              <div className="space-y-4">
                <Input
                  label="Amount (VND)"
                  value={dwAmount}
                  onChange={(e) => setDwAmount(e.target.value)}
                />
                <Input
                  label="Description"
                  value={dwDescription}
                  onChange={(e) => setDwDescription(e.target.value)}
                  helperText="Optional"
                />
                {account && (
                  <p className="text-xs text-slate-400">
                    Current balance:{' '}
                    <span className="font-medium text-slate-100">
                      {formatCurrency(account.balance, account.currency)}
                    </span>
                  </p>
                )}
              </div>
            </Card>
            <Button type="submit" isLoading={submitting}>
              Confirm Withdraw
            </Button>
          </form>
        </TabsContent>
      </section>
    </div>
  )
}

