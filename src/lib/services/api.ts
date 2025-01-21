// Base API configuration and utilities
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

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
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  const defaultOptions: FetchOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 5000,
    retries: 3,
    backoff: 300,
    requiresAuth: true,
  };

  const finalOptions = { ...defaultOptions, ...options };
  
  try {
    const response = await fetch(url, finalOptions);
    
    if (!response.ok) {
      throw new APIError(response.status, `API request failed: ${response.statusText}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('API request error:', error);
    throw error;
  }
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