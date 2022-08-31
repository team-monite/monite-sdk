import { useCallback, useEffect, useRef, useState } from 'react';
import { PayableStateEnum } from '@monite/sdk-api';
import {
  useApprovePayableById,
  usePayableById,
  usePayPayableById,
  useRejectPayableById,
} from 'core/queries/usePayable';
import { toast } from 'react-hot-toast';

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

  // const submitMutation = useSubmitPayableById();
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

  const submitForm = useCallback(() => {
    formRef.current?.dispatchEvent(
      new Event('submit', {
        bubbles: true,
      })
    );
  }, [formRef]);

  const saveInvoice = useCallback(submitForm, [submitForm]);

  const submitInvoice = useCallback(async () => {
    if (!payable?.id) return;
    // TODO uncomment later
    // await submitMutation.mutate(payable.id);
    await approveMutation.mutate(payable.id);
    toast.success('Submitted');
    onSubmit && onSubmit();
  }, [submitForm, payable]);

  const approveInvoice = useCallback(async () => {
    if (!payable?.id) return;
    await approveMutation.mutate(payable.id);
    toast.success('Approved');
    onApprove && onApprove();
  }, [approveMutation, payable]);

  const rejectInvoice = useCallback(async () => {
    if (!payable?.id) return;
    await rejectMutation.mutate(payable.id);
    toast.success('Rejected');
    onReject && onReject();
  }, [rejectMutation, payable]);

  const payInvoice = useCallback(async () => {
    if (!payable?.id) return;
    await payMutation.mutate(payable.id);
    toast.success('Payed');
    onPay && onPay();
  }, [payMutation, payable]);

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
