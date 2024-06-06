import { useState } from 'react';

type Options = {
  loading: boolean;
};

type Status = 'idle' | 'pending' | 'success' | 'error';

type Any = object;

type UsePromiseHook<T, Args extends Any[], E> = {
  run: (...args: Args) => Promise<T | undefined>;
  isLoading: boolean;
  data: T | null;
  error: E | null;
  status: Status;
}

export const usePromise = <T = Any, Args extends Any[] = Any[], E = Error>(
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

  const isLoading = status === 'pending';
  
  return { run, isLoading, data, error, status };
};
