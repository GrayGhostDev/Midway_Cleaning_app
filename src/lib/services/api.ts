// Base API configuration and utilities
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

interface FetchOptions extends RequestInit {
  timeout?: number;
  retries?: number;
  backoff?: number;
  requiresAuth?: boolean;
}

async function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Get auth token from cookies or localStorage
async function getAuthToken(): Promise<string | null> {
  if (typeof window === 'undefined') {
    return null;
  }

  // Try to get token from cookie first
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('auth-token='));
  if (tokenCookie) {
    return tokenCookie.split('=')[1].trim();
  }

  // Fallback to localStorage
  return localStorage.getItem('auth-token');
}

// Helper function to handle rate limiting
async function handleRateLimit(
  response: Response,
  attempt: number,
  retries: number,
  backoff: number
): Promise<boolean> {
  if (response.status === 429 && attempt < retries - 1) {
    const retryAfter = parseInt(response.headers.get('Retry-After') || '1', 10);
    await sleep(retryAfter * 1000 || backoff * Math.pow(2, attempt));
    return true;
  }
  return false;
}

export async function fetchAPI<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    timeout = 8000,
    retries = 3,
    backoff = 1000,
    requiresAuth = true,
    headers = {},
    ...fetchOptions
  } = options;

  let attempt = 0;
  while (attempt < retries) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      let requestHeaders = new Headers(headers);

      if (requiresAuth) {
        const token = await getAuthToken();
        if (!token) {
          if (typeof window !== 'undefined') {
            window.location.href = '/login';
          }
          throw new APIError(401, 'Authentication required');
        }
        requestHeaders.set('Authorization', `Bearer ${token}`);
      }

      requestHeaders.set('Content-Type', 'application/json');

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...fetchOptions,
        headers: requestHeaders,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status === 401) {
          if (typeof window !== 'undefined') {
            // Clear invalid token
            document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            localStorage.removeItem('auth-token');
            window.location.href = '/login';
          }
          throw new APIError(401, 'Authentication required');
        }

        const errorData = await response.json().catch(() => ({}));
        throw new APIError(
          response.status,
          errorData.error || 'An error occurred while processing your request'
        );
      }

      // Handle rate limiting
      if (await handleRateLimit(response, attempt, retries, backoff)) {
        attempt++;
        continue;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);

      if (error instanceof APIError) {
        throw error;
      }

      if (error.name === 'AbortError') {
        throw new APIError(408, 'Request timeout');
      }

      if (attempt < retries - 1) {
        await sleep(backoff * Math.pow(2, attempt));
        attempt++;
        continue;
      }

      throw new APIError(500, error.message || 'Internal server error');
    }
  }

  throw new APIError(500, 'Maximum retries exceeded');
}

// Auth helper functions
export const auth = {
  login: async (email: string, password: string) => {
    const response = await fetchAPI('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
      requiresAuth: false,
    });
    if (response.token) {
      document.cookie = `auth-token=${response.token}; path=/;`;
      localStorage.setItem('auth-token', response.token);
    }
    return response;
  },

  signup: async ({ name, email, password }: { name: string; email: string; password: string }) => {
    const response = await fetchAPI('/api/auth/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, email, password }),
      requiresAuth: false,
    });
    
    if (response.token) {
      document.cookie = `auth-token=${response.token}; path=/; max-age=86400; samesite=lax`;
      localStorage.setItem('auth-token', response.token);
    }
    return response;
  },

  logout: () => {
    document.cookie = 'auth-token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    localStorage.removeItem('auth-token');
    window.location.href = '/login';
  },

  isAuthenticated: async () => {
    const token = await getAuthToken();
    return !!token;
  }
};