import { useState, useCallback } from 'react';

type RequestStatus = 'idle' | 'loading' | 'success' | 'error';

export function useApiRequest<T>() {
  const [data, setData] = useState<T | null>(null);
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [error, setError] = useState<Error | null>(null);

  const request = useCallback(async (fn: () => Promise<T>) => {
    setStatus('loading');
    setError(null);

    try {
      const result = await fn();
      setData(result);
      setStatus('success');
      return result;
    } catch (err) {
      setError(err as Error);
      setStatus('error');
      return null;
    }
  }, []);

  return { data, status, error, request };
}
