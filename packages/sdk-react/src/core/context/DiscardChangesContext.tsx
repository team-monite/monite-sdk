import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from 'react';

import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';

export interface DiscardChangesContextValue {
  shouldShowChangesModal: boolean;
  handleShowModal: (state: boolean) => void;
}

/**
 * @internal
 */
export const DiscardChangesContext =
  createContext<DiscardChangesContextValue | null>(null);

export function useDiscardChangesContext() {
  const discardChangesContext = useContext(DiscardChangesContext);

  if (!discardChangesContext) {
    throw new Error(
      'Could not find DiscardChangesContext. Make sure that you are using "DiscardChangesContext" component before calling this hook.'
    );
  }

  return discardChangesContext;
}

export const DiscardChangesContextProvider = ({
  children,
}: PropsWithChildren) => (
  <MoniteScopedProviders>
    <DiscardChangesContextProviderBase>
      {children}
    </DiscardChangesContextProviderBase>
  </MoniteScopedProviders>
);

const DiscardChangesContextProviderBase = ({ children }: PropsWithChildren) => {
  const [shouldShowChangesModal, setShouldShowChangesModal] = useState(false);

  const handleShowModal = useCallback((state: boolean) => {
    setShouldShowChangesModal(state);
  }, []);

  return (
    <DiscardChangesContext.Provider
      value={{
        handleShowModal,
        shouldShowChangesModal,
      }}
    >
      {children}
    </DiscardChangesContext.Provider>
  );
};
