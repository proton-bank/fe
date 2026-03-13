export interface DecodedJWT {
  sub: string
  username: string
  role: string
  exp: number
  [key: string]: unknown
}

export function decodeJWT(token: string): DecodedJWT | null {
  try {
    const payload = token.split('.')[1]
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    return JSON.parse(decoded) as DecodedJWT
  } catch {
    return null
  }
}

export function isTokenExpired(token: string): boolean {
  const decoded = decodeJWT(token)
  if (!decoded?.exp) return true
  const nowInSeconds = Math.floor(Date.now() / 1000)
  return decoded.exp < nowInSeconds
}

export interface AuthUser {
  id: string
  username: string
  role: string
}

export function getUserFromToken(token: string): AuthUser | null {
  const decoded = decodeJWT(token)
  if (!decoded) return null
  return {
    id: String(decoded.sub),
    username: String(decoded.username),
    role: String(decoded.role),
  }
}

