import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

export interface KanmonContextValue {
  isKanmonInitialized: boolean;
  buttonText: string;
  handleButtonText: (value: string) => void;
  toggleKanmon: (state: boolean) => void;
  startFinanceSession: (options?: StartFinanceSessionOptions) => void;
}

type StartFinanceSessionOptions = {
  sessionToken?: string;
  component?: string;
};

declare global {
  interface Window {
    KANMON_CONNECT:
      | {
          start: (options: {
            connectToken: string;
            onEvent: (event: {
              eventType: string;
              data: {
                actionMessage: string;
                actionRequired: boolean;
                section: string;
                userState: string;
              };
            }) => void;
          }) => void;
          show: (options?: StartFinanceSessionOptions) => void;
          stop: () => void;
        }
      | undefined;
  }
}

/**
 * @internal
 */
export const KanmonContext = createContext<KanmonContextValue | null>(null);

export function useKanmonContext() {
  const kanmonContext = useContext(KanmonContext);

  if (!kanmonContext) {
    throw new Error(
      'Could not find KanmonContext. Make sure that you are using "MoniteProvider" component before calling this hook.'
    );
  }

  return kanmonContext;
}

const stopFinanceSession = () => {
  window?.KANMON_CONNECT?.stop();
};

export const KanmonContextProvider = ({ children }: PropsWithChildren) => {
  const [isKanmonInitialized, setIsKanmonInitialized] = useState(false);
  const [buttonText, setButtonText] = useState('');

  const handleButtonText = useCallback((value: string) => {
    setButtonText(value);
  }, []);

  const toggleKanmon = useCallback((state: boolean) => {
    setIsKanmonInitialized(state);
  }, []);

  const startFinanceSession = useCallback(
    ({ sessionToken, component }: StartFinanceSessionOptions = {}) => {
      window?.KANMON_CONNECT?.show({ sessionToken, component });
    },
    []
  );

  useEffect(() => {
    return () => stopFinanceSession();
  }, []);

  return (
    <KanmonContext.Provider
      value={{
        isKanmonInitialized,
        buttonText,
        toggleKanmon,
        startFinanceSession,
        handleButtonText,
      }}
    >
      {children}
    </KanmonContext.Provider>
  );
};
