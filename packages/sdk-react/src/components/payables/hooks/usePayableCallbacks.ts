import { useCallback } from 'react';

import { UsePayableDetailsProps } from '@/components/payables/PayableDetails/usePayableDetails';
import { useComponentSettings } from '@/core/hooks/useComponentSettings';

type PayableCallbackProps = Pick<
  UsePayableDetailsProps,
  | 'onSaved'
  | 'onCanceled'
  | 'onSubmitted'
  | 'onRejected'
  | 'onApproved'
  | 'onReopened'
  | 'onDeleted'
  | 'onPay'
>;

/**
 * Custom hook that creates memoized payable callbacks.
 * Each callback calls both the direct prop callback and the component settings callback.
 *
 * @param props - Direct callback props from component props
 * @returns Object with memoized callback handlers
 */
export const usePayableCallbacks = (props: PayableCallbackProps) => {
  const { payablesCallbacks } = useComponentSettings();

  const {
    onSaved,
    onCanceled,
    onSubmitted,
    onRejected,
    onApproved,
    onReopened,
    onDeleted,
    onPay,
  } = props;

  const handleSaved = useCallback(
    (id: string) => {
      onSaved?.(id);
      payablesCallbacks.onSaved?.(id);
    },
    [onSaved, payablesCallbacks]
  );

  const handleCanceled = useCallback(
    (id: string) => {
      onCanceled?.(id);
      payablesCallbacks.onCanceled?.(id);
    },
    [onCanceled, payablesCallbacks]
  );

  const handleSubmitted = useCallback(
    (id: string) => {
      onSubmitted?.(id);
      payablesCallbacks.onSubmitted?.(id);
    },
    [onSubmitted, payablesCallbacks]
  );

  const handleRejected = useCallback(
    (id: string) => {
      onRejected?.(id);
      payablesCallbacks.onRejected?.(id);
    },
    [onRejected, payablesCallbacks]
  );

  const handleApproved = useCallback(
    (id: string) => {
      onApproved?.(id);
      payablesCallbacks.onApproved?.(id);
    },
    [onApproved, payablesCallbacks]
  );

  const handleReopened = useCallback(
    (id: string) => {
      onReopened?.(id);
      payablesCallbacks.onReopened?.(id);
    },
    [onReopened, payablesCallbacks]
  );

  const handleDeleted = useCallback(
    (id: string) => {
      onDeleted?.(id);
      payablesCallbacks.onDeleted?.(id);
    },
    [onDeleted, payablesCallbacks]
  );

  const handlePay = useCallback(
    (id: string) => {
      onPay?.(id);
      payablesCallbacks.onPay?.(id);
    },
    [onPay, payablesCallbacks]
  );

  return {
    handleSaved,
    handleCanceled,
    handleSubmitted,
    handleRejected,
    handleApproved,
    handleReopened,
    handleDeleted,
    handlePay,
  };
};
