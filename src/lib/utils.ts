import * as React from 'react';
import clsx, { ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...args: ClassValue[]) => {
  return twMerge(clsx(...args))
}

// named imports for React.lazy: https://github.com/facebook/react/issues/14603#issuecomment-726551598
// const { Home } = lazyNamedImport(() => import("./Home"), "Home");
export function lazyNamedImport<T extends React.ComponentType<any>, I extends { [K2 in K]: T }, K extends keyof I>(
  factory: () => Promise<I>,
  name: K
): I {
  return Object.create({
    [name]: React.lazy(() => factory().then((module) => ({ default: module[name] })))
  });
}

export function lazyImport<T extends React.ComponentType<any>>(
  factory: () => Promise<{ default: T }>
): T {
  return React.lazy(() => factory().then((module) => ({ default: module.default }))) as unknown as T;
}