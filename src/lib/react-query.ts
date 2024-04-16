import { DefaultOptions, QueryClient, UseMutationOptions, UseQueryOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';

const defaultOptions: DefaultOptions = {
  queries: {
    throwOnError: (error) => ((error as AxiosError)?.response?.status ?? 400) >= 500,
    retry: false,
    refetchOnWindowFocus: false
  }
};

export const queryClient = new QueryClient({ defaultOptions });

type Any = object[];
type PromiseValue<T> = T extends Promise<infer U> ? U : T;

export type ExtractFnReturnType<FnType extends (...args: Any) => Any> = PromiseValue<ReturnType<FnType>>;

export type QueryConfig<QueryFnType extends (...args: Any) => Any> = Omit<
  UseQueryOptions<ExtractFnReturnType<QueryFnType>>,
  'queryKey' | 'queryFn'
>;

export type MutationConfig<MutationFnType extends (...args: Any) => Any> = UseMutationOptions<
  ExtractFnReturnType<MutationFnType>,
  AxiosError,
  Parameters<MutationFnType>[0]
>;