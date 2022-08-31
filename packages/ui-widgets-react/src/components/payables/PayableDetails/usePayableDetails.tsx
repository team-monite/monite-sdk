import { useCallback, useEffect, useRef, useState } from 'react';
import { PayableStateEnum } from '@monite/sdk-api';
import {
  useApprovePayableById,
  usePayableById,
  usePayPayableById,
  useRejectPayableById,
  useSubmitPayableById,
} from 'core/queries/usePayable';

export type UsePayableDetailsProps = {
  id: string;
  debug?: boolean;
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
  debug,
  onSubmit,
  onSave,
  onReject,
  onApprove,
  onPay,
}: UsePayableDetailsProps) {
  const { data: payable, error, isLoading } = usePayableById(id, debug);

  const formRef = useRef<HTMLFormElement>(null);

  const [isEdit, setEdit] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<PayableDetailsPermissions[]>(
    []
  );

  const submitMutation = useSubmitPayableById();
  const approveMutation = useApprovePayableById();
  const rejectMutation = useRejectPayableById();
  const payMutation = usePayPayableById();

  const status = payable?.status || '';

  useEffect(() => {
    if (!status) return;

    setEdit(false);
    setPermissions([]);

    switch (status) {
      case PayableStateEnum.NEW:
        // TODO uncomment later
        // setPermissions(['save', 'submit']);
        setPermissions(['reject', 'approve']);
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

  const submitForm = useCallback(() => {
    formRef.current?.dispatchEvent(
      new Event('submit', {
        bubbles: true,
      })
    );
  }, [formRef]);

  const saveInvoice = useCallback(() => {
    submitForm();
  }, [submitForm]);

  const submitInvoice = useCallback(async () => {
    if (!payable?.id) return;
    await submitMutation.mutate(payable.id);
    onSubmit && onSubmit();
  }, [submitForm]);

  const approveInvoice = useCallback(async () => {
    if (!payable?.id) return;
    await approveMutation.mutate(payable.id);
    onApprove && onApprove();
  }, []);

  const rejectInvoice = useCallback(async () => {
    if (!payable?.id) return;
    await rejectMutation.mutate(payable.id);
    onReject && onReject();
  }, []);

  const payInvoice = useCallback(async () => {
    if (!payable?.id) return;
    await payMutation.mutate(payable.id);
    onPay && onPay();
  }, []);

  const onFormSubmit = useCallback(() => {
    onSave && onSave();
  }, []);

  return {
    payable,
    formRef,
    isLoading,
    error,
    isEdit,
    permissions,
    actions: {
      onFormSubmit,
      submitInvoice,
      saveInvoice,
      approveInvoice,
      rejectInvoice,
      payInvoice,
    },
  };
}
