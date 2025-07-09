import { useMemo } from 'react';

import { useMoniteContext } from '../context/MoniteContext';

export const useComponentSettings = () => {
  const { componentSettings } = useMoniteContext();

  const receivablesCallbacks = useMemo(
    () => ({
      onUpdate: componentSettings?.receivables?.onUpdate,
      onDelete: componentSettings?.receivables?.onDelete,
      onCreate: componentSettings?.receivables?.onCreate,
      onInvoiceSent: componentSettings?.receivables?.onInvoiceSent,
    }),
    [componentSettings?.receivables]
  );

  const onboardingCallbacks = useMemo(
    () => ({
      onWorkingCapitalOnboardingComplete:
        componentSettings?.onboarding?.onWorkingCapitalOnboardingComplete,
      onPaymentsOnboardingComplete:
        componentSettings?.onboarding?.onPaymentsOnboardingComplete,
      onComplete: componentSettings?.onboarding?.onComplete,
      onContinue: componentSettings?.onboarding?.onContinue,
    }),
    [componentSettings?.onboarding]
  );

  const payablesCallbacks = useMemo(
    () => ({
      onSaved: componentSettings?.payables?.onSaved,
      onCanceled: componentSettings?.payables?.onCanceled,
      onSubmitted: componentSettings?.payables?.onSubmitted,
      onRejected: componentSettings?.payables?.onRejected,
      onApproved: componentSettings?.payables?.onApproved,
      onReopened: componentSettings?.payables?.onReopened,
      onDeleted: componentSettings?.payables?.onDeleted,
      onPay: componentSettings?.payables?.onPay,
    }),
    [componentSettings?.payables]
  );

  return {
    componentSettings,
    receivablesCallbacks,
    onboardingCallbacks,
    payablesCallbacks,
  };
};
