import { useCallback, useEffect, useRef, useState } from 'react';
import { PayableStateEnum } from '@team-monite/sdk-api';
import {
  useApprovePayableById,
  usePayableById,
  usePayPayableById,
  useRejectPayableById,
  useSubmitPayableById,
} from 'core/queries/usePayable';

export type UsePayableDetailsProps = {
  id: string;
  onSubmit?: () => void;
  onSave?: () => void;
  onPay?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
};

export type PayableDetailsPermissions =
  | 'save'
  | 'submit'
  | 'reject'
  | 'approve'
  | 'pay';

export default function usePayableDetails({
  id,
  onSubmit,
  onSave,
  onReject,
  onApprove,
  onPay,
}: UsePayableDetailsProps) {
  const { data: payable, error, isLoading } = usePayableById(id);
  const formRef = useRef<HTMLFormElement>(null);
  const [isEdit, setEdit] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<PayableDetailsPermissions[]>(
    []
  );

  const submitMutation = useSubmitPayableById();
  const approveMutation = useApprovePayableById();
  const rejectMutation = useRejectPayableById();
  const payMutation = usePayPayableById();

  const status = payable?.status;

  useEffect(() => {
    if (!status) return;

    setEdit(false);
    setPermissions([]);

    switch (status) {
      case PayableStateEnum.NEW:
        setPermissions(['save', 'submit']);
        setEdit(true);
        break;
      case PayableStateEnum.APPROVE_IN_PROGRESS:
        setPermissions(['reject', 'approve']);
        break;
      case PayableStateEnum.WAITING_TO_BE_PAID:
        setPermissions(['pay']);
        break;
    }
  }, [status]);

  const saveInvoice = useCallback(() => {
    formRef.current?.dispatchEvent(
      new Event('submit', {
        bubbles: true,
      })
    );
  }, [formRef]);

  const onFormSave = useCallback(() => {
    onSave && onSave();
  }, [onSave]);

  const submitInvoice = useCallback(async () => {
    await submitMutation.mutateAsync(id);
    onSubmit && onSubmit();
  }, [submitMutation, id, onSubmit]);

  const approveInvoice = useCallback(async () => {
    await approveMutation.mutateAsync(id);
    onApprove && onApprove();
  }, [approveMutation, id, onApprove]);

  const rejectInvoice = useCallback(async () => {
    await rejectMutation.mutateAsync(id);
    onReject && onReject();
  }, [rejectMutation, id, onReject]);

  const payInvoice = useCallback(async () => {
    await payMutation.mutateAsync(id);
    onPay && onPay();
  }, [payMutation, id, onPay]);

  return {
    payable,
    formRef,
    isLoading,
    error,
    isEdit,
    permissions,
    actions: {
      onFormSave,
      submitInvoice,
      saveInvoice,
      approveInvoice,
      rejectInvoice,
      payInvoice,
    },
  };
}
