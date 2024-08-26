import * as React from "react";
import { localStorage, sessionStorage } from "../storage";

type SetStateFn<T> = (prevState?: T) => T;

export const useLocalStorage = <T>(
  key: string,
  initialValue: T
) => {
  const [state, setState] = React.useState<T>(() => {
    return localStorage.get(key, initialValue);
  });

  const set: React.Dispatch<React.SetStateAction<T>> = React.useCallback(
    (nextValue) => {
      const setter = nextValue as SetStateFn<T>;
      const value = typeof nextValue === 'function' ? setter(state) : nextValue;
      setState(value);
      if (value) {
        localStorage.set(key, value);
      } else {
        localStorage.remove(key);
      }
    },
    [key, state]
  );

  return [state, set] as const;
}

export const useSessionStorage = <T>(
  key: string,
  initialValue: T
) => {
  const [state, setState] = React.useState<T>(() => {
    return sessionStorage.get(key, initialValue);
  });

  const set: React.Dispatch<React.SetStateAction<T>> = React.useCallback(
    (nextValue) => {
      const setter = nextValue as SetStateFn<T>;
      const value = typeof nextValue === 'function' ? setter(state) : nextValue;
      setState(value);
      if (value) {
        sessionStorage.set(key, value);
      } else {
        sessionStorage.remove(key);
      }
    },
    [key, state]
  );

  return [state, set] as const;
}