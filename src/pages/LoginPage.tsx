import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'

export default function LoginPage() {
  const { login, isAuthenticated, isHydrated } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [username, setUsername] = useState('')
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<{ username?: string; pin?: string }>({})

  if (isHydrated && isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const nextErrors: typeof errors = {}
    if (!username.trim()) nextErrors.username = 'Username is required'
    if (!pin.trim()) nextErrors.pin = 'PIN is required'
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    try {
      setLoading(true)
      await login(username.trim(), pin.trim())
      showToast('Login successful', 'success')
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      showToast('Invalid credentials or server error', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-50">
      <div className="w-full max-w-md rounded-card border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
        <h1 className="text-xl font-semibold tracking-tight text-slate-50">
          Welcome Back
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Login with username and PIN to access your Proton Bank account.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Username"
            name="username"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            error={errors.username}
          />
          <Input
            label="PIN"
            name="pin"
            type="password"
            autoComplete="current-password"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            error={errors.pin}
          />
          <Button
            type="submit"
            className="w-full"
            isLoading={loading}
          >
            Login
          </Button>
        </form>
        <p className="mt-4 text-center text-xs text-slate-400">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  )
}

