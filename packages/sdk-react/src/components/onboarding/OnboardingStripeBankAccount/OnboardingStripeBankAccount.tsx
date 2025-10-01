import { OnboardingFormActions } from '../OnboardingFormActions';
import { OnboardingForm, OnboardingStepContent } from '../OnboardingLayout';
import { useOnboardingRequirementsContext } from '../context';
import { useTreasuryEligibility } from '../hooks';
import { treasuryConfig } from '../services/TreasuryConfig';
import { BankAccountDetailsTable } from './BankAccountDetailsTable';
import { InitialVerificationView } from './InitialVerificationView';
import { StripeFinancialConnectionsModal } from './StripeFinancialConnectionsModal';
import { TreasuryTermsAcceptanceModal } from './TreasuryTermsAcceptanceModal';
import {
  VerificationCanceledCard,
  VerificationErrorCard,
  VerificationInProgressCard,
  VerificationRetryCard,
  VerificationSuccessCard,
} from './VerificationStatusCards';
import { STRIPE_JS_URL } from './consts';
import { getAccountHolderType, getEntityDisplayName } from './helpers';
import { StripeBankAccountDetails } from './types';
import { useStripeBankAccountVerificationQuery } from './useStripeBankAccountVerificationQuery';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useDidMount } from '@/core/hooks';
import { useMyEntity } from '@/core/queries';
import { t } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Trans } from '@lingui/react/macro';
import { useState, useCallback, forwardRef, useImperativeHandle } from 'react';

export interface OnboardingStripeBankAccountRef {
  startVerification: () => void;
}

export interface OnboardingStripeBankAccountProps {
  withFormWrapper?: boolean;
}

export const OnboardingStripeBankAccount = forwardRef<
  OnboardingStripeBankAccountRef,
  OnboardingStripeBankAccountProps
>(({ withFormWrapper = true }, ref) => {
  const { i18n } = useLingui();

  const { api, queryClient } = useMoniteContext();
  const { isEligible } = useTreasuryEligibility();
  const { data: entity } = useMyEntity();
  const { disableEditMode } = useOnboardingRequirementsContext();

  const [showStripeModal, setShowStripeModal] = useState(false);
  const [showAcceptBankModal, setShowAcceptBankModal] = useState(false);
  const [savedBankDetails, setSavedBankDetails] =
    useState<StripeBankAccountDetails | null>(null);
  const [userCanceled, setUserCanceled] = useState(false);
  const [isLocallyVerified, setIsLocallyVerified] = useState(false);
  const [redirectSetupIntentId, setRedirectSetupIntentId] = useState<
    string | null
  >(null);

  const {
    startVerificationAsync,
    isStarting,
    componentData,
    isCheckingStatus,
    isVerificationComplete: isApiVerificationComplete,
    isVerificationFailed,
    error,
    reset,
  } = useStripeBankAccountVerificationQuery(
    userCanceled,
    redirectSetupIntentId
  );

  const isVerificationComplete = isLocallyVerified || isApiVerificationComplete;

  const beginVerificationFlow = async () => {
    try {
      setUserCanceled(false);

      const result = await startVerificationAsync();
      if (result?.client_secret && result?.publishable_key) {
        setShowStripeModal(true);

        // Launch Stripe within the same user click handler to avoid popup blockers
        await launchStripeCollect(
          result.publishable_key,
          result.client_secret,
          result.account_id || undefined
        );
      } else {
        console.error('Invalid response from verification start:', result);
      }
    } catch (error) {
      console.error('Failed to start Treasury bank verification:', error);
    }
  };

  const handleStartVerification = async () => {
    await beginVerificationFlow();
  };

  // Handle Stripe redirect return - when user comes back from Financial Connections
  useDidMount(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const setupIntent = urlParams.get('setup_intent');
    const setupIntentClientSecret = urlParams.get('setup_intent_client_secret');
    const redirectStatus = urlParams.get('redirect_status');

    if (
      setupIntent &&
      setupIntentClientSecret &&
      redirectStatus === 'succeeded'
    ) {
      // Clean up URL parameters immediately to prevent re-processing
      const newUrl =
        window.location.protocol +
        '//' +
        window.location.host +
        window.location.pathname;
      window.history.replaceState(null, '', newUrl);

      // Store the setup_intent_id to trigger verification polling
      // This handles the case where component state was lost due to redirect
      setRedirectSetupIntentId(setupIntent);
      setIsLocallyVerified(true); // User has completed the Stripe flow
      treasuryConfig.debug('Detected Stripe redirect return', {
        setupIntent,
        redirectStatus,
      });
    }
  });

  useImperativeHandle(ref, () => ({
    startVerification: handleStartVerification,
  }));

  const launchStripeCollect = async (
    publishableKey: string,
    clientSecret: string,
    accountId?: string
  ) => {
    try {
      if (typeof window === 'undefined' || typeof document === 'undefined') {
        throw new Error('Stripe can only be loaded in browser environment');
      }

      if (!window.Stripe) {
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = STRIPE_JS_URL;
          script.async = true;
          script.onload = () => resolve();
          script.onerror = () => reject(new Error('Failed to load Stripe.js'));
          document.body.appendChild(script);
        });
      }

      const stripeOptions = accountId ? { stripeAccount: accountId } : {};
      const stripe = window.Stripe(publishableKey, stripeOptions);

      const fallbackBillingDetails = {
        name: getEntityDisplayName(entity, i18n),
        email: entity?.email || undefined,
      };

      // Step 1: Collect bank account through Financial Connections
      // Use embedded mode to prevent any redirects

      // Add additional Stripe configuration to ensure embedded behavior
      const collectOptions = {
        clientSecret,
        params: {
          payment_method_type: 'us_bank_account',
          payment_method_data: {
            billing_details: fallbackBillingDetails,
          },
        },
        expand: ['payment_method'],
        redirect: 'never',
        return_url: undefined, // Explicitly no return URL
      };

      const collectResult =
        await stripe.collectBankAccountForSetup(collectOptions);

      if (collectResult.error) {
        throw new Error(collectResult.error.message);
      }

      // Step 2: Confirm the Setup Intent with collected payment method
      if (collectResult.setupIntent) {
        const setupIntent = collectResult.setupIntent;
        let bankAccountDetails: StripeBankAccountDetails | undefined;

        if (
          setupIntent.payment_method &&
          typeof setupIntent.payment_method === 'object'
        ) {
          const paymentMethod = setupIntent.payment_method;
          if (paymentMethod.us_bank_account) {
            bankAccountDetails = {
              account_holder_name: paymentMethod.billing_details?.name,
              account_holder_type:
                paymentMethod.us_bank_account.account_holder_type,
              bank_name: paymentMethod.us_bank_account.bank_name,
              last4: paymentMethod.us_bank_account.last4,
              routing_number: paymentMethod.us_bank_account.routing_number,
            };

            if (paymentMethod.us_bank_account.financial_connections_account) {
              bankAccountDetails.financial_connections_account =
                paymentMethod.us_bank_account.financial_connections_account;
            }
          }
        }

        if (setupIntent.status === 'succeeded') {
          await handleStripeSuccess(
            setupIntent.payment_method?.id,
            bankAccountDetails
          );
        } else if (setupIntent.status === 'requires_payment_method') {
          // User exited without completing; close modal and mark as canceled
          setShowStripeModal(false);
          setUserCanceled(true);
        } else if (setupIntent.status === 'requires_confirmation') {
          // Confirm the Setup Intent WITHOUT redirect - use embedded confirmation

          try {
            // Try to confirm without return_url to prevent redirect
            const confirmResult = await stripe.confirmSetup({
              clientSecret,
              // NO confirmParams - this prevents any redirect behavior
            });

            if (confirmResult.error) {
              if (
                confirmResult.error.type === 'validation_error' &&
                confirmResult.error.message?.includes('return_url')
              ) {
                // In this case, the setup intent is likely already confirmed server-side
                // Just proceed with the current bank account details
                await handleStripeSuccess(
                  setupIntent.payment_method?.id,
                  bankAccountDetails
                );
              } else {
                throw new Error(confirmResult.error.message);
              }
            } else if (confirmResult.setupIntent?.status === 'succeeded') {
              await handleStripeSuccess(
                confirmResult.setupIntent.payment_method?.id,
                bankAccountDetails
              );
            } else {
              // For any other status, still try to proceed with what we have

              await handleStripeSuccess(
                setupIntent.payment_method?.id,
                bankAccountDetails
              );
            }
          } catch (_confirmError) {
            // If confirmation fails, still proceed with the bank account details we collected
            await handleStripeSuccess(
              setupIntent.payment_method?.id,
              bankAccountDetails
            );
          }
        } else {
          // For other statuses, still try to handle success with whatever data we have
          await handleStripeSuccess(
            setupIntent.payment_method?.id,
            bankAccountDetails
          );
        }
      } else {
        // No setupIntent in result, this shouldn't happen but handle gracefully
        setShowStripeModal(false);
      }
    } catch (err) {
      setShowStripeModal(false);
      handleStripeError(
        err instanceof Error
          ? err
          : new Error('Failed to launch Treasury Financial Connections')
      );
    }
  };

  const handleStripeSuccess = useCallback(
    async (
      _paymentMethodId?: string,
      bankAccountDetails?: StripeBankAccountDetails
    ) => {
      setShowStripeModal(false);

      // Save the bank details and show accept bank modal
      if (bankAccountDetails) {
        setSavedBankDetails(bankAccountDetails);

        // Show accept bank modal instead of immediately completing
        setShowAcceptBankModal(true);
      } else {
        // Still show accept bank modal with minimal details
        const fallbackDetails: StripeBankAccountDetails = {
          account_holder_name: getEntityDisplayName(entity, i18n),
          bank_name: t(i18n)`Bank Account Connected`,
          last4: '****',
          routing_number: undefined,
          account_holder_type:
            entity?.type === 'individual' ? 'individual' : 'company',
        };
        setSavedBankDetails(fallbackDetails);
        setShowAcceptBankModal(true);
      }
    },
    [entity, i18n]
  );

  const handleAcceptBankAccount = useCallback(async () => {
    setShowAcceptBankModal(false);
    setIsLocallyVerified(true);

    // React Query will automatically start polling for verification status
    // No manual polling needed - it's handled by the query
    // Note: Bank account details are managed entirely by Stripe and the backend
  }, []);

  const handleCancelBankAcceptance = useCallback(() => {
    setShowAcceptBankModal(false);
    setSavedBankDetails(null);
    setIsLocallyVerified(false);
    // Reset verification state
    reset();
  }, [reset]);

  const handleStripeError = useCallback((error: Error) => {
    setShowStripeModal(false);
    console.error('Treasury Financial Connections error:', error);
  }, []);

  const handleRetry = () => {
    reset();
    setUserCanceled(false);
    setSavedBankDetails(null);
    setIsLocallyVerified(false);
  };

  // Don't return null - always render something to prevent parent loading state
  if (!isEligible) {
    const notEligibleContent = (
      <OnboardingStepContent>
        <p className="mtw:text-sm mtw:text-muted-foreground">
          <Trans>
            Treasury bank verification is not available for this entity.
          </Trans>
        </p>
      </OnboardingStepContent>
    );

    if (withFormWrapper) {
      return (
        <OnboardingForm actions={null} onSubmit={(e) => e.preventDefault()}>
          {notEligibleContent}
        </OnboardingForm>
      );
    }

    return notEligibleContent;
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isVerificationComplete) {
      return;
    }

    try {
      await api.onboardingRequirements.getOnboardingRequirements.invalidateQueries(
        queryClient
      );
      await api.frontend.getFrontendOnboardingRequirements.invalidateQueries(
        queryClient
      );

      disableEditMode();
    } catch (error) {
      console.error('Failed to proceed after bank verification:', error);
    }
  };

  const stepContent = (
    <OnboardingStepContent>
      <p className="mtw:text-sm mtw:text-muted-foreground mtw:mb-4">
        <Trans>
          Add a bank to make transfers of funds from your bank account to Stripe
          account and to vendors.
        </Trans>
      </p>

      {error && <VerificationErrorCard error={error} />}

      {/* Initial account data screen - shown before verification starts */}
      {!componentData && !isVerificationComplete && !userCanceled && (
        <InitialVerificationView
          accountHolderName={getEntityDisplayName(entity, i18n)}
          accountHolderType={getAccountHolderType(entity)}
          onStartVerification={handleStartVerification}
          isStarting={isStarting}
          startButtonText={
            isStarting
              ? t(i18n)`Starting verification...`
              : t(i18n)`Verify account`
          }
        />
      )}

      {/* Show retry screen only when user canceled */}
      {!componentData && !isVerificationComplete && userCanceled && (
        <VerificationCanceledCard
          onRetry={handleStartVerification}
          isStarting={isStarting}
          startButtonText={
            isStarting ? t(i18n)`Starting verification...` : t(i18n)`Retry`
          }
        />
      )}

      {componentData && !isVerificationComplete && (
        <VerificationInProgressCard />
      )}

      {isVerificationComplete && (
        <>
          <VerificationSuccessCard />
          {savedBankDetails && (
            <BankAccountDetailsTable
              bankDetails={savedBankDetails}
              isConnected={true}
              showVerificationStatus={true}
            />
          )}
        </>
      )}

      {isVerificationFailed && <VerificationErrorCard />}

      {(error || isVerificationFailed) && componentData && (
        <VerificationRetryCard onRetry={handleRetry} />
      )}
    </OnboardingStepContent>
  );

  const stripeModal = componentData && (
    <StripeFinancialConnectionsModal
      open={showStripeModal}
      onClose={() => setShowStripeModal(false)}
      publishableKey={componentData.publishable_key}
      clientSecret={componentData.client_secret || ''}
      accountId={componentData.account_id}
      onSuccess={handleStripeSuccess}
      onError={handleStripeError}
      autoLaunch={false}
    />
  );

  const acceptBankModal = (
    <TreasuryTermsAcceptanceModal
      open={showAcceptBankModal}
      onAccept={handleAcceptBankAccount}
      onClose={handleCancelBankAcceptance}
      isProcessing={isCheckingStatus}
    />
  );

  if (withFormWrapper) {
    return (
      <>
        <OnboardingForm
          actions={
            <OnboardingFormActions
              isLoading={isStarting || (isCheckingStatus && !isLocallyVerified)}
            />
          }
          onSubmit={handleFormSubmit}
        >
          {stepContent}
        </OnboardingForm>
        {stripeModal}
        {acceptBankModal}
      </>
    );
  }

  return (
    <>
      {stepContent}
      {stripeModal}
      {acceptBankModal}
    </>
  );
});
