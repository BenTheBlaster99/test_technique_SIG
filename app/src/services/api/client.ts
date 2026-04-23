const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

export function buildUrl(path: string, params?: Record<string, string | number | undefined>) {
  const url = new URL(path, API_BASE_URL)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        return
      }

      url.searchParams.set(key, String(value))
    })
  }

  return url
}

export async function request<T>(input: URL | string, init?: RequestInit) {
  const response = await fetch(input, {
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
    ...init,
  })

  if (!response.ok) {
    let message = 'The request failed.'

    try {
      const data = (await response.json()) as { message?: string }
      if (data.message) {
        message = data.message
      }
    } catch {
      message = response.statusText || message
    }

    throw new ApiError(message, response.status)
  }

  if (response.status === 204) {
    return {
      data: null as T,
      headers: response.headers,
    }
  }

  return {
    data: (await response.json()) as T,
    headers: response.headers,
  }
}
