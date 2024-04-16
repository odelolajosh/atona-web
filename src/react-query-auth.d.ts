declare module 'react-query-auth' {
  export interface ReactQueryAuthConfig<
    User,
    LoginCredentials,
    RegisterCredentials
  > {
    userFn: QueryFunction<User, QueryKey>;
    loginFn: MutationFunction<User, LoginCredentials>;
    registerFn: MutationFunction<User, RegisterCredentials>;
    logoutFn: MutationFunction<unknown, unknown>;
    userKey?: QueryKey;
  }

  export function configureAuth<
    User,
    Error,
    LoginCredentials,
    RegisterCredentials
  >(config: ReactQueryAuthConfig<User, LoginCredentials, RegisterCredentials>): {
    useUser: UseQueryResult<User, Error>;
    useLogin: UseMutationResult<User, Error, LoginCredentials, unknown>;
    useRegister: UseMutationResult<User, Error, RegisterCredentials, unknown>;
    useLogout: UseMutationResult<unknown, unknown, unknown, unknown>;
    AuthLoader: React.FC<{
      renderLoading: () => React.ReactNode;
      renderUnauthenticated: () => React.ReactNode;
      children: React.ReactNode;
    }>
  }
}