// Base API configuration and utilities
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export class APIError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'APIError';
  }
}

interface FetchOptions extends RequestInit {
  timeout?: number;
}

export async function fetchAPI<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { timeout = 8000, ...fetchOptions } = options;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...fetchOptions,
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new APIError(response.status, await response.text());
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (error instanceof APIError) {
      throw error;
    }
    if (error.name === 'AbortError') {
      throw new APIError(408, 'Request timeout');
    }
    throw new APIError(500, error.message);
  } finally {
    clearTimeout(timeoutId);
  }
}