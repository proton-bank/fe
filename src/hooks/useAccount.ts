import { useEffect, useState } from 'react'
import { getMyAccount } from '../api/accounts'
import type { AccountResponse } from '../types/account'

interface UseAccountResult {
  account: AccountResponse | null
  loading: boolean
  error: Error | null
  refresh: () => Promise<void>
}

export function useAccount(): UseAccountResult {
  const [account, setAccount] = useState<AccountResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const fetchAccount = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getMyAccount()
      setAccount(data)
    } catch (err) {
      setError(err as Error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void fetchAccount()
  }, [])

  useEffect(() => {
    const handler = () => {
      void fetchAccount()
    }
    window.addEventListener('balance-updated', handler)
    return () => {
      window.removeEventListener('balance-updated', handler)
    }
  }, [])

  return {
    account,
    loading,
    error,
    refresh: fetchAccount,
  }
}

