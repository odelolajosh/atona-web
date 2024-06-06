import { useCallback, useEffect } from 'react';
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
import { useLocalStorage } from './hooks/use-local-storage';
import { axios } from './axios';
import { AxiosError } from 'axios';

const userKey = ['authenticated-user'];

const LOCAL_JWT_KEY = 'atona-jwt_key';

export const useToken = () => {
  const [jwt, setJwt] = useLocalStorage(LOCAL_JWT_KEY, '');

  const authenticateClient = useCallback(
    (token: string) => {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setJwt(token);
    },
    [setJwt]
  );

  useEffect(() => {
    if (jwt && !axios.defaults.headers.common['Authorization']) {
      authenticateClient(jwt);
    }
  }, [jwt, authenticateClient]);

  const authenticate = useCallback(
    (response: UserResponse) => {
      authenticateClient(response.authToken);
    },
    [authenticateClient]
  );

  const logout = useCallback(() => {
    axios.defaults.headers.common['Authorization'] = '';
    setJwt('');
  }, [setJwt]);

  return {
    token: jwt,
    authenticate,
    logout,
  };
};

const useUser = (
  options?: Omit<
    UseQueryOptions<User, Error, User, QueryKey>,
    'queryKey' | 'queryFn'
  >
) => {
  useToken();
  return useQuery({
    queryKey: userKey,
    queryFn: () => getMe(),
    ...options,
  });
}

const useLogin = (
  options?: Omit<
    UseMutationOptions<UserResponse, Error, LoginCredentialsDTO>,
    'mutationFn'
  >
) => {
  const { authenticate } = useToken();
  const queryClient = useQueryClient();

  const setUser = useCallback(
    (data: User) => queryClient.setQueryData(userKey, data),
    [queryClient]
  );

  return useMutation({
    mutationFn: loginWithEmailAndPassword,
    ...options,
    onSuccess: (response, ...rest) => {
      setUser(response.user);
      authenticate(response);
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
  const { authenticate } = useToken();
  const queryClient = useQueryClient();

  const setUser = useCallback(
    (data: User) => queryClient.setQueryData(userKey, data),
    [queryClient]
  );

  return useMutation({
    mutationFn: registerWithEmailAndPassword,
    ...options,
    onSuccess: (response, ...rest) => {
      setUser(response.user);
      authenticate(response);
      options?.onSuccess?.(response, ...rest);
    },
  });
};

const useLogout = (options?: UseMutationOptions<unknown, Error, unknown>) => {
  const queryClient = useQueryClient();

  const setUser = useCallback(
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
  const { isSuccess, isFetched, status, data, error } = useUser();

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

  const errorCode = (error as AxiosError)?.response?.status ?? 400;

  if (status === 'error' && errorCode !== 401) {
    return {
      state: "error",
      error: "An error occurred while loading user data",
    }
  }

  return {
    state: "unauthenticated",
  }
}

export {
  useUser,
  useLogin,
  useRegister,
  useLogout,
  useAuthLoader
};