import { LoginCredentialsDTO, RegisterCredentialsDTO, getMe, loginWithEmailAndPassword, registerWithEmailAndPassword } from '@/features/auth';
import { User } from '@/features/auth/types';
import { configureAuth } from 'react-query-auth';

const userFn = async () => {
  try {
    const response = await getMe();
    return response ?? {};
  } catch (err) {
    console.log(err);
    return null;
  }
};

const loginFn = async (data: LoginCredentialsDTO) => {
  const response = await loginWithEmailAndPassword(data);
  const { user } = response;
  return user;
};

const registerFn = async (data: RegisterCredentialsDTO) => {
  const response = await registerWithEmailAndPassword(data);
  const { user } = response;
  return user;
};

const logoutFn = async () => {
  new Promise((resolve) => {
    setTimeout(resolve, 1000);
  });
}

const config = {
  userFn,
  loginFn,
  registerFn,
  logoutFn
};

// eslint-disable-next-line react-refresh/only-export-components
export const { useUser, useLogin, useRegister, useLogout, AuthLoader } = configureAuth<
  User | null,
  unknown,
  LoginCredentialsDTO,
  RegisterCredentialsDTO
>(config);
