import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { flushSync } from 'react-dom'
import { login as loginApi, signup as signupApi } from '../api/auth'
import type { SignupRequest } from '../types/auth'
import { getUserFromToken, isTokenExpired, type AuthUser } from '../utils/jwt'

interface AuthState {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  /** False until we've read token from localStorage (avoids redirect on refresh before hydrate) */
  isHydrated: boolean
}

interface AuthContextValue extends AuthState {
  login: (username: string, pin: string) => Promise<void>
  signup: (data: SignupRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isHydrated, setIsHydrated] = useState(false)

  // Initialize from localStorage (must run before we decide to redirect to login)
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    if (storedToken && !isTokenExpired(storedToken)) {
      const parsedUser = getUserFromToken(storedToken)
      if (parsedUser) {
        setToken(storedToken)
        setUser(parsedUser)
      } else {
        localStorage.removeItem('token')
      }
    } else if (storedToken) {
      localStorage.removeItem('token')
    }
    setIsHydrated(true)
  }, [])

  const handleAuthSuccess = useCallback((newToken: string) => {
    localStorage.setItem('token', newToken)
    const parsedUser = getUserFromToken(newToken)
    flushSync(() => {
      setToken(newToken)
      setUser(parsedUser)
    })
  }, [])

  const login = useCallback(
    async (username: string, pin: string) => {
      const result = await loginApi({ username, pin })
      handleAuthSuccess(result.access_token)
    },
    [handleAuthSuccess],
  )

  const signup = useCallback(
    async (data: SignupRequest) => {
      const result = await signupApi(data)
      handleAuthSuccess(result.access_token)
    },
    [handleAuthSuccess],
  )

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setToken(null)
    setUser(null)
  }, [])

  const value: AuthContextValue = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      isHydrated,
      login,
      signup,
      logout,
    }),
    [isHydrated, login, logout, signup, token, user],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthContext

