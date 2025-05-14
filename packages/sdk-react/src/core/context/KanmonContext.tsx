import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';

import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

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

type KanmonFinancedInvoiceSchedule = {
  repaymentDate: string;
  repaymentAmountCents: number;
  repaymentFeeAmountCents: number;
  repaymentPrincipalAmountCents: number;
};

export type KanmonFinancedInvoice = {
  id: string;
  feeAmountCents: number;
  state: string;
  principalAmountCents: number;
  repaymentAmountCents: number;
  invoiceAdvanceAmountCents: number;
  issuedProductId: string;
  platformInvoiceId: string;
  platformInvoiceNumber: string;
  payorType: string;
  payorBusinessName: string;
  payorFirstName?: string;
  payorMiddleName?: string;
  payorLastName?: string;
  payorEmail: string;
  payeeType?: string;
  payeeBusinessName?: string;
  payeeEmail?: string;
  payeeFirstName?: string;
  payeeMiddleName?: string;
  payeeLastName?: string;
  payeeAddress?: string;
  invoiceAmountCents: number;
  repaymentSchedule: {
    schedule: KanmonFinancedInvoiceSchedule[];
  };
  advanceRatePercentage: number;
  amountRequestedForFinancingCents: number;
  transactionFeePercentage: number;
  invoiceIssuedDate: string;
  invoiceDueDate: string;
  payorAddress?: string;
  createdAt: string;
  updatedAt: string;
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
                invoice: KanmonFinancedInvoice;
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

export const KanmonContextProvider = ({ children }: PropsWithChildren) => (
  <MoniteScopedProviders>
    <KanmonContextProviderBase>{children}</KanmonContextProviderBase>
  </MoniteScopedProviders>
);

const KanmonContextProviderBase = ({ children }: PropsWithChildren) => {
  const { i18n } = useLingui();
  const [isKanmonInitialized, setIsKanmonInitialized] = useState(false);
  const [buttonText, setButtonText] = useState(t(i18n)`Apply for financing`);

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
