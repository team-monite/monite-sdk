import { useCallback } from 'react';

import { UsePayableDetailsProps } from '@/components/payables/PayableDetails/usePayableDetails';
import type { PayActionHandlers } from '@/core/componentSettings';
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
 * Returns undefined for callbacks when neither the direct prop nor component settings callback is defined.
 *
 * @param props - Direct callback props from component props
 * @returns Object with memoized callback handlers (or undefined when no callbacks are defined)
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

  const savedCallback = useCallback(
    (id: string) => {
      onSaved?.(id);
      payablesCallbacks.onSaved?.(id);
    },
    [onSaved, payablesCallbacks]
  );
  const handleSaved =
    onSaved || payablesCallbacks.onSaved ? savedCallback : undefined;

  const canceledCallback = useCallback(
    (id: string) => {
      onCanceled?.(id);
      payablesCallbacks.onCanceled?.(id);
    },
    [onCanceled, payablesCallbacks]
  );
  const handleCanceled =
    onCanceled || payablesCallbacks.onCanceled ? canceledCallback : undefined;

  const submittedCallback = useCallback(
    (id: string) => {
      onSubmitted?.(id);
      payablesCallbacks.onSubmitted?.(id);
    },
    [onSubmitted, payablesCallbacks]
  );
  const handleSubmitted =
    onSubmitted || payablesCallbacks.onSubmitted
      ? submittedCallback
      : undefined;

  const rejectedCallback = useCallback(
    (id: string) => {
      onRejected?.(id);
      payablesCallbacks.onRejected?.(id);
    },
    [onRejected, payablesCallbacks]
  );
  const handleRejected =
    onRejected || payablesCallbacks.onRejected ? rejectedCallback : undefined;

  const approvedCallback = useCallback(
    (id: string) => {
      onApproved?.(id);
      payablesCallbacks.onApproved?.(id);
    },
    [onApproved, payablesCallbacks]
  );
  const handleApproved =
    onApproved || payablesCallbacks.onApproved ? approvedCallback : undefined;

  const reopenedCallback = useCallback(
    (id: string) => {
      onReopened?.(id);
      payablesCallbacks.onReopened?.(id);
    },
    [onReopened, payablesCallbacks]
  );
  const handleReopened =
    onReopened || payablesCallbacks.onReopened ? reopenedCallback : undefined;

  const deletedCallback = useCallback(
    (id: string) => {
      onDeleted?.(id);
      payablesCallbacks.onDeleted?.(id);
    },
    [onDeleted, payablesCallbacks]
  );
  const handleDeleted =
    onDeleted || payablesCallbacks.onDeleted ? deletedCallback : undefined;

  const payCallback = useCallback(
    (id: string, data?: unknown, actions?: PayActionHandlers) => {
      onPay?.(id, data, actions);
      payablesCallbacks.onPay?.(id, data, actions);
    },
    [onPay, payablesCallbacks]
  );
  const handlePay = onPay || payablesCallbacks.onPay ? payCallback : undefined;

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
