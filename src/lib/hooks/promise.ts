import { useState } from 'react';

type Options = {
  loading: boolean;
};

type Status = 'idle' | 'pending' | 'success' | 'error';

type UsePromiseHook<T, Args extends any[], E> = [
  (...args: Args) => Promise<T | undefined>,
  boolean,
  T | null,
  E | null,
  Status
];

export const usePromise = <T = any, Args extends any[] = any, E = Error>(
  fn: (...args: Args) => Promise<T>,
  options?: Options,
): UsePromiseHook<T, Args, E> => {
  const [status, setStatus] = useState<Status>(options?.loading ? 'pending' : 'idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<E | null>(null);

  const run = async (...args: Args) => {
    try {
      setError(null);
      setStatus('pending');
      const response = await fn(...args);
      setData(response);
      setStatus('success');
      return response;
    } catch (error) {
      setStatus('error');
      setError(error as E);
    }
  };

  const loading = status === 'pending';
  return [run, loading, data, error, status];
};
