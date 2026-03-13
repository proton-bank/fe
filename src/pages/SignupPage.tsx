import { useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { useAuth } from '../hooks/useAuth'
import { useToast } from '../hooks/useToast'
import type { SignupRequest } from '../types/auth'

export default function SignupPage() {
  const { signup, isAuthenticated, isHydrated } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [form, setForm] = useState<SignupRequest>({
    username: '',
    full_name: '',
    pin: '',
    role: 'user',
  })
  const [confirmPin, setConfirmPin] = useState('')
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Partial<Record<keyof SignupRequest | 'confirmPin', string>>>(
    {},
  )

  if (isHydrated && isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const nextErrors: typeof errors = {}

    if (!form.full_name.trim()) nextErrors.full_name = 'Full name is required'
    if (!form.username.trim()) nextErrors.username = 'Username is required'
    if (form.username.trim().length < 3 || form.username.trim().length > 50) {
      nextErrors.username = '3–50 characters required'
    }
    if (!form.pin.trim()) {
      nextErrors.pin = 'PIN is required'
    } else if (!/^\d{4,12}$/.test(form.pin.trim())) {
      nextErrors.pin = 'PIN must be 4–12 digits'
    }
    if (confirmPin.trim() !== form.pin.trim()) {
      nextErrors.confirmPin = 'PINs do not match'
    }

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    try {
      setLoading(true)
      await signup({
        ...form,
        username: form.username.trim(),
        full_name: form.full_name.trim(),
        pin: form.pin.trim(),
      })
      showToast('Account created successfully', 'success')
      navigate('/dashboard')
    } catch (err) {
      console.error(err)
      showToast('Signup failed. Username may already exist.', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-slate-50">
      <div className="w-full max-w-md rounded-card border border-slate-800 bg-slate-900/80 p-6 shadow-lg">
        <h1 className="text-xl font-semibold tracking-tight text-slate-50">
          Create Your Account
        </h1>
        <p className="mt-1 text-sm text-slate-400">
          Sign up with a username and PIN. You can also choose an admin role for
          testing FAQ management.
        </p>
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <Input
            label="Full Name"
            name="full_name"
            value={form.full_name}
            onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
            error={errors.full_name}
          />
          <Input
            label="Username"
            name="username"
            value={form.username}
            onChange={(e) => setForm((f) => ({ ...f, username: e.target.value }))}
            error={errors.username}
            helperText="3–50 characters, unique"
          />
          <Input
            label="PIN"
            name="pin"
            type="password"
            value={form.pin}
            onChange={(e) => setForm((f) => ({ ...f, pin: e.target.value }))}
            error={errors.pin}
            helperText="4–12 digits"
          />
          <Input
            label="Confirm PIN"
            name="confirmPin"
            type="password"
            value={confirmPin}
            onChange={(e) => setConfirmPin(e.target.value)}
            error={errors.confirmPin}
          />

          <div className="space-y-1.5 text-sm text-slate-200">
            <p className="text-xs font-medium text-slate-300">Role</p>
            <div className="flex gap-4">
              <label className="inline-flex items-center gap-2 text-xs">
                <input
                  type="radio"
                  name="role"
                  value="user"
                  checked={form.role === 'user'}
                  onChange={() => setForm((f) => ({ ...f, role: 'user' }))}
                />
                <span>User</span>
              </label>
              <label className="inline-flex items-center gap-2 text-xs">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={form.role === 'admin'}
                  onChange={() => setForm((f) => ({ ...f, role: 'admin' }))}
                />
                <span>Admin</span>
              </label>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={loading}
          >
            Sign Up
          </Button>
        </form>
        <p className="mt-4 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}

