/**
 * Azure Static Web Apps Authentication
 * Uses built-in authentication from Azure SWA
 */

export interface User {
  id: string
  name: string
  email: string
  provider: string
}

export interface AuthResult {
  user: User | null
  isAuthenticated: boolean
}

/**
 * Get the current authenticated user from Azure Static Web Apps
 * Azure SWA provides user info at /.auth/me endpoint
 */
export async function getUser(): Promise<AuthResult> {
  try {
    const response = await fetch('/.auth/me')
    const data = await response.json()
    
    if (data.clientPrincipal) {
      return {
        user: {
          id: data.clientPrincipal.userId,
          name: data.clientPrincipal.userDetails,
          email: data.clientPrincipal.userDetails,
          provider: data.clientPrincipal.identityProvider,
        },
        isAuthenticated: true,
      }
    }
    
    return {
      user: null,
      isAuthenticated: false,
    }
  } catch (error) {
    console.error('Error fetching user:', error)
    return {
      user: null,
      isAuthenticated: false,
    }
  }
}

/**
 * Login redirect - redirects to Azure SWA login
 * @param provider - 'github', 'google', 'twitter', 'aad' (Azure AD)
 */
export function login(provider: string = 'github') {
  if (typeof window !== 'undefined') {
    window.location.href = `/.auth/login/${provider}`
  }
}

/**
 * Logout - redirects to Azure SWA logout
 */
export function logout() {
  if (typeof window !== 'undefined') {
    window.location.href = '/.auth/logout'
  }
}

/**
 * Get user on the server side (for Server Components)
 */
export async function getUserServer(): Promise<AuthResult> {
  // In production, Azure SWA injects user info via headers
  // For development, we'll use a mock user
  if (process.env.NODE_ENV === 'development') {
    return {
      user: {
        id: 'dev-user-1',
        name: 'Dev User',
        email: 'dev@example.com',
        provider: 'dev',
      },
      isAuthenticated: true,
    }
  }
  
  // In production, parse from request headers
  // This is a placeholder - actual implementation depends on deployment
  return {
    user: null,
    isAuthenticated: false,
  }
}
