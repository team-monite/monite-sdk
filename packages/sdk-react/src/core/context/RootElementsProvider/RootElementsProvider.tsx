'use client';

import { createContext, ReactNode, useContext, ContextType } from 'react';

const RootElementsContext = createContext<{
  styles: Element | undefined;
  root: Element | undefined;
}>({ styles: undefined, root: undefined });

export const useRootElements = () => {
  return useContext(RootElementsContext);
};

export const RootElementsProvider = ({
  children,
  elements,
}: {
  children: ReactNode;
  elements?: ContextType<typeof RootElementsContext>;
}) => {
  const contextElements = useRootElements();

  return (
    <RootElementsContext.Provider
      value={{
        ...contextElements,
        ...elements,
      }}
    >
      {children}
    </RootElementsContext.Provider>
  );
};
