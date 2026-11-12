const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000'


export async function apiClient<T>(
    path: string,
    options?: RequestInit
): Promise<T> {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null

    const response = await fetch(`${API_URL}${path}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options?.headers
        }
    })

    if (response.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem("accessToken");

      if (window.location.pathname !== "/login") {
        window.location.replace("/login");
      }

      throw new Error("Unauthorized");
    }

    if(!response.ok) {
        throw new Error(`API request failed: ${response.status}`)
    }

    return response.json() as Promise<T>
}