import React from 'react';
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryKey,
  UseQueryOptions,
  UseMutationOptions,
} from '@tanstack/react-query';
import { User, UserResponse } from '@/features/auth/types';
import { LoginCredentialsDTO, RegisterCredentialsDTO, getMe, loginWithEmailAndPassword, registerWithEmailAndPassword } from '@/features/auth';

const userKey = ['authenticated-user'];

const useUser = (
  options?: Omit<
    UseQueryOptions<User, Error, User, QueryKey>,
    'queryKey' | 'queryFn'
  >
) => useQuery({
  queryKey: userKey,
  queryFn: getMe,
  ...options,
});

const useLogin = (
  options?: Omit<
    UseMutationOptions<UserResponse, Error, LoginCredentialsDTO>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();

  const setUser = React.useCallback(
    (data: User) => queryClient.setQueryData(userKey, data),
    [queryClient]
  );

  return useMutation({
    mutationFn: loginWithEmailAndPassword,
    ...options,
    onSuccess: (response, ...rest) => {
      setUser(response.user);
      options?.onSuccess?.(response, ...rest);
    },
  });
};

const useRegister = (
  options?: Omit<
    UseMutationOptions<UserResponse, Error, RegisterCredentialsDTO>,
    'mutationFn'
  >
) => {
  const queryClient = useQueryClient();

  const setUser = React.useCallback(
    (data: User) => queryClient.setQueryData(userKey, data),
    [queryClient]
  );

  return useMutation({
    mutationFn: registerWithEmailAndPassword,
    ...options,
    onSuccess: (response, ...rest) => {
      setUser(response.user);
      options?.onSuccess?.(response, ...rest);
    },
  });
};

const useLogout = (options?: UseMutationOptions<unknown, Error, unknown>) => {
  const queryClient = useQueryClient();

  const setUser = React.useCallback(
    (data: User | null) => queryClient.setQueryData(userKey, data),
    [queryClient]
  );

  return useMutation({
    mutationFn: () => Promise.resolve(null),
    ...options,
    onSuccess: (...args) => {
      setUser(null);
      options?.onSuccess?.(...args);
    },
  });
};

const useAuthLoader = () => {
  const { isSuccess, isFetched, status, data } = useUser();

  if (isSuccess) {
    if (!data) {
      return {
        state: "unauthenticated",
        error: "User is not authenticated",
      }
    }
    return {
      state: "authenticated",
      user: data,
    }
  }

  if (!isFetched) {
    return {
      state: "loading",
    }
  }

  if (status === 'error') {
    return {
      state: "error",
      error: "An error occurred while loading user data",
    }
  }

  return {
    state: "unknown",
  }
}

export {
  useUser,
  useLogin,
  useRegister,
  useLogout,
  useAuthLoader
};