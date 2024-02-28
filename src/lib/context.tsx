import { createContext as createReactContext, useContext as useReactContext, useMemo } from "react";

// Create a context seamlessly with a default value and a hook to access the context value
function createContext<ContextValueType extends object | null>(
  providerName: string,
  defaultContext?: ContextValueType,
) {
  const Context = createReactContext<ContextValueType | undefined>(defaultContext);

  function Provider(props: React.PropsWithChildren<ContextValueType>) {
    const { children, ...context } = props;
    const value = useMemo(() => context, Object.values(context)) as ContextValueType;
    return <Context.Provider value={value}>{children}</Context.Provider>;
  }

  function useContext(consumerName: string) {
    const contextValue = useReactContext(Context);
    if (contextValue === undefined) {
      throw new Error(`${consumerName} must be used within a ${providerName}Provider`);
    }
    return contextValue;
  }
  return [useContext, Provider] as const;
}

export { createContext }