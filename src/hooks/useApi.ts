import { useCallback, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const API_BASE = 'http://localhost:8000/api';

export function useApi() {
  const { token, logout } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback(
    async <T,>(
    endpoint: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
    body?: any)
    : Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const headers: HeadersInit = { 'Content-Type': 'application/json' };
        if (token) headers['Authorization'] = `Bearer ${token}`;

        const response = await fetch(`${API_BASE}${endpoint}`, {
          method,
          headers,
          body: body ? JSON.stringify(body) : undefined
        });

        if (response.status === 401) {
          logout();
          throw new Error('Session expired. Please login again.');
        }

        if (!response.ok) {
          const errData = await response.json().catch(() => ({}));
          throw new Error(
            errData.detail ||
            errData.message ||
            `Error: ${response.statusText}`
          );
        }

        return (await response.json()) as T;
      } catch (err: any) {
        setError(err.message || 'An unexpected error occurred');
        return null;
      } finally {
        setLoading(false);
      }
    },
    [token, logout]
  );

  const get = useCallback(
    <T,>(endpoint: string) => request<T>(endpoint, 'GET'),
    [request]
  );
  const post = useCallback(
    <T,>(endpoint: string, body: any) => request<T>(endpoint, 'POST', body),
    [request]
  );

  return { get, post, loading, error };
}