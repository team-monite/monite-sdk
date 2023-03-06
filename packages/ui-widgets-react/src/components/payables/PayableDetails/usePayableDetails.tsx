import { useCallback, useEffect, useRef, useState } from 'react';
import { PayableStateEnum, PayableUpdateSchema } from '@team-monite/sdk-api';
import {
  useApprovePayableById,
  usePayableById,
  usePayPayableById,
  useRejectPayableById,
  useCancelPayableById,
  useSubmitPayableById,
  useUpdatePayableById,
} from 'core/queries/usePayable';

export type UsePayableDetailsProps = {
  id: string;
  onSubmit?: () => void;
  onSave?: () => void;
  onPay?: () => void;
  onApprove?: () => void;
  onCancel?: () => void;
  onReject?: () => void;
};

export type PayableDetailsPermissions =
  | 'save'
  | 'submit'
  | 'reject'
  | 'approve'
  | 'cancel'
  | 'pay';

export default function usePayableDetails({
  id,
  onSubmit,
  onSave,
  onReject,
  onApprove,
  onCancel,
  onPay,
}: UsePayableDetailsProps) {
  const { data: payable, error, isLoading } = usePayableById(id);
  const formRef = useRef<HTMLFormElement>(null);
  const [isEdit, setEdit] = useState<boolean>(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const [permissions, setPermissions] = useState<PayableDetailsPermissions[]>(
    []
  );

  const saveMutation = useUpdatePayableById(id);
  const submitMutation = useSubmitPayableById();
  const approveMutation = useApprovePayableById();
  const rejectMutation = useRejectPayableById();
  const cancelMutation = useCancelPayableById();
  const payMutation = usePayPayableById();

  const status = payable?.status;

  useEffect(() => {
    if (!status) return;

    setEdit(false);
    setPermissions([]);

    switch (status) {
      case PayableStateEnum.DRAFT:
        setPermissions(['cancel', 'save']);
        setEdit(true);
        break;
      case PayableStateEnum.NEW:
        setPermissions(['cancel', 'save', 'submit']);
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

  useEffect(() => {
    setIsFormLoading(saveMutation.isLoading || submitMutation.isLoading);
  }, [saveMutation.isLoading, submitMutation.isLoading]);

  useEffect(() => {
    setIsButtonLoading(
      saveMutation.isLoading ||
        submitMutation.isLoading ||
        approveMutation.isLoading ||
        rejectMutation.isLoading ||
        cancelMutation.isLoading ||
        payMutation.isLoading
    );
  }, [
    saveMutation.isLoading,
    submitMutation.isLoading,
    approveMutation.isLoading,
    rejectMutation.isLoading,
    cancelMutation.isLoading,
    payMutation.isLoading,
  ]);

  const saveInvoice = useCallback(
    async (data: PayableUpdateSchema) => {
      const mutateAsync = saveMutation.mutateAsync;
      await mutateAsync(data);
      onSave && onSave();
    },
    [saveMutation.mutateAsync, onSave]
  );

  const submitInvoice = useCallback(
    async (data: PayableUpdateSchema) => {
      await saveInvoice(data);

      const mutateAsync = submitMutation.mutateAsync;
      await mutateAsync(id);
      onSubmit && onSubmit();
    },
    [submitMutation.mutateAsync, id, onSubmit, saveInvoice]
  );

  const approveInvoice = useCallback(async () => {
    await approveMutation.mutateAsync(id);
    onApprove && onApprove();
  }, [approveMutation, id, onApprove]);

  const rejectInvoice = useCallback(async () => {
    await rejectMutation.mutateAsync(id);
    onReject && onReject();
  }, [rejectMutation, id, onReject]);

  const cancelInvoice = useCallback(async () => {
    await cancelMutation.mutateAsync(id);
    onCancel && onCancel();
  }, [cancelMutation, id, onCancel]);

  const payInvoice = useCallback(async () => {
    await payMutation.mutateAsync(id);
    onPay && onPay();
  }, [payMutation, id, onPay]);

  return {
    payable,
    formRef,
    isLoading,
    isFormLoading,
    isButtonLoading,
    error,
    isEdit,
    permissions,
    actions: {
      submitInvoice,
      saveInvoice,
      approveInvoice,
      rejectInvoice,
      cancelInvoice,
      payInvoice,
    },
  };
}
