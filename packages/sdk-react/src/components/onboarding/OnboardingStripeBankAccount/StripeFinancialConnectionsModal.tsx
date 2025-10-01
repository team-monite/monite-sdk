import { STRIPE_JS_URL } from './consts';
import { StripeBankAccountDetails } from './types';
import { Dialog, DialogContent } from '@/ui/components/dialog';
import { t } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { useEffect, useRef, useState } from 'react';

interface StripeFinancialConnectionsModalProps {
  open: boolean;
  publishableKey: string;
  clientSecret: string;
  accountId?: string | null;
  /**
   * When false, the component will not automatically invoke Stripe collect flow.
   * Useful when launching Stripe directly in a user gesture handler.
   */
  autoLaunch?: boolean;
  onSuccess: (
    paymentMethodId?: string,
    bankAccountDetails?: StripeBankAccountDetails
  ) => void;
  onError: (error: Error) => void;
  onClose: () => void;
}

declare global {
  interface Window {
    Stripe?: any;
  }
}

export const StripeFinancialConnectionsModal = ({
  open,
  publishableKey,
  clientSecret,
  accountId,
  autoLaunch = true,
  onSuccess,
  onError,
  onClose,
}: StripeFinancialConnectionsModalProps) => {
  const { i18n } = useLingui();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const stripeRef = useRef<any>(null);
  const financialConnectionsSessionRef = useRef<any>(null);

  useEffect(() => {
    if (!open || !publishableKey || !clientSecret || !autoLaunch) return;

    const loadStripe = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (typeof window === 'undefined' || typeof document === 'undefined') {
          throw new Error('Stripe can only be loaded in browser environment');
        }

        if (!window.Stripe) {
          const script = document.createElement('script');
          script.src = STRIPE_JS_URL;
          script.async = true;
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.body.appendChild(script);
          });
        }

        const stripeOptions = accountId ? { stripeAccount: accountId } : {};
        stripeRef.current = window.Stripe(publishableKey, stripeOptions);

        const financialConnectionsSession =
          stripeRef.current.financialConnections();
        financialConnectionsSessionRef.current = financialConnectionsSession;

        const result =
          await financialConnectionsSession.collectBankAccountForSetup({
            clientSecret,
            params: {
              payment_method_type: 'us_bank_account',
              payment_method_data: {
                billing_details: {
                  name: 'auto',
                },
              },
            },
            expand: ['payment_method'],
            on_behalf_of: undefined,
            redirect: 'never',
          });

        if (result.error) {
          throw new Error(result.error.message);
        }

        let bankAccountDetails: StripeBankAccountDetails | undefined;

        if (result.setupIntent?.payment_method) {
          const paymentMethod = result.setupIntent.payment_method;

          if (paymentMethod.us_bank_account) {
            bankAccountDetails = {
              account_holder_name: paymentMethod.billing_details?.name,
              account_holder_type:
                paymentMethod.us_bank_account.account_holder_type,
              bank_name: paymentMethod.us_bank_account.bank_name,
              last4: paymentMethod.us_bank_account.last4,
              routing_number: paymentMethod.us_bank_account.routing_number,
            };
          }

          if (paymentMethod.us_bank_account?.financial_connections_account) {
            bankAccountDetails = {
              ...bankAccountDetails,
              financial_connections_account:
                paymentMethod.us_bank_account.financial_connections_account,
            };
          }
        }

        if (result.setupIntent?.status === 'succeeded') {
          onSuccess(result.setupIntent.payment_method, bankAccountDetails);
        } else if (result.setupIntent?.status === 'requires_payment_method') {
          onClose();
        } else {
          onSuccess(undefined, bankAccountDetails);
        }
      } catch (err) {
        const errorMessage =
          err instanceof Error
            ? err.message
            : t(i18n)`Failed to load Stripe verification`;
        setError(errorMessage);
        onError(err instanceof Error ? err : new Error(errorMessage));
      } finally {
        setIsLoading(false);
      }
    };

    loadStripe();

    return () => {
      financialConnectionsSessionRef.current = null;
    };
  }, [
    open,
    publishableKey,
    clientSecret,
    accountId,
    onSuccess,
    onError,
    onClose,
    i18n,
    autoLaunch,
  ]);

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent className="mtw:sm:max-w-md mtw:min-h-[500px] mtw:p-0">
        {isLoading && (
          <div className="mtw:flex mtw:h-full mtw:w-full mtw:flex-col mtw:items-center mtw:justify-center">
            <div className="mtw:h-6 mtw:w-6 mtw:animate-spin mtw:rounded-full mtw:border-2 mtw:border-gray-300 mtw:border-t-gray-500" />
          </div>
        )}
        {error && !isLoading && (
          <div className="mtw:p-4">
            <p className="mtw:text-sm mtw:text-destructive">{error}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
