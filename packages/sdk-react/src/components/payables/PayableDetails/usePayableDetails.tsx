import { useCallback, useEffect, useState } from 'react';
import { FieldNamesMarkedBoolean } from 'react-hook-form';

import {
  LineItem,
  PayableDetailsFormFields,
} from '@/components/payables/PayableDetails/PayableDetailsForm/helpers';
import {
  useApprovePayableById,
  useCancelPayableById,
  useCreatePayableWithLineItems,
  usePayableById,
  useRejectPayableById,
  useSubmitPayableById,
  useUpdatePayableByIdWithLineItems,
} from '@/core/queries/usePayable';
import { usePayableLineItemsList } from '@/core/queries/usePayableLineItems';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import {
  PayableActionEnum,
  PayableStateEnum,
  PayableUpdateSchema,
  PayableUploadWithDataSchema,
} from '@monite/sdk-api';

export type PayableDetailsPermissions =
  | 'edit'
  | 'save'
  | 'cancelEdit'
  | 'cancel'
  | 'submit'
  | 'reject'
  | 'approve'
  | 'pay';

export type UsePayableDetailsProps = {
  /**
   * The ID of the payable
   */
  id?: string;

  /**
   * Callback function that is called when the payable is saved
   *
   * @param {string} id - The ID of the payable
   *
   * @returns {void}
   *
   * @deprecated Please use `onSaved` method instead. This method will be removed in 4.0.0 version
   */
  onSave?: (id: string) => void;

  /**
   * Callback function that is called when the payable is canceled
   *
   * @param {string} id - The ID of the payable
   *
   * @returns {void}
   *
   * @deprecated Please use `onCanceled` method instead. This method will be removed in 4.0.0 version
   */
  onCancel?: (id: string) => void;

  /**
   * Callback function that is called when the payable is submitted
   *
   * @param {string} id - The ID of the payable
   *
   * @returns {void}
   *
   * @deprecated Please use `onSubmitted` method instead. This method will be removed in 4.0.0 version
   */
  onSubmit?: (id: string) => void;

  /**
   * Callback function that is called when the payable is rejected
   *
   * @param {string} id - The ID of the payable
   *
   * @returns {void}
   *
   * @deprecated Please use `onRejected` method instead. This method will be removed in 4.0.0 version
   */
  onReject?: (id: string) => void;

  /**
   * Callback function that is called when the payable is approved
   *
   * @param {string} id - The ID of the payable
   *
   * @returns {void}
   *
   * @deprecated Please use `onApproved` method instead. This method will be removed in 4.0.0 version
   */
  onApprove?: (id: string) => void;

  /**
   * Callback function that is called when the payable is saved
   *
   * @param {string} id - The ID of the payable
   *
   * @returns {void}
   */
  onSaved?: (id: string) => void;

  /**
   * Callback function that is called when the payable is canceled
   *
   * @param {string} id - The ID of the payable
   *
   * @returns {void}
   */
  onCanceled?: (id: string) => void;

  /**
   * Callback function that is called when the payable is submitted
   *
   * @param {string} id - The ID of the payable
   *
   * @returns {void}
   */
  onSubmitted?: (id: string) => void;

  /**
   * Callback function that is called when the payable is rejected
   *
   * @param {string} id - The ID of the payable
   *
   * @returns {void}
   */
  onRejected?: (id: string) => void;

  /**
   * Callback function that is called when the payable is approved
   *
   * @param {string} id - The ID of the payable
   *
   * @returns {void}
   */
  onApproved?: (id: string) => void;

  /**
   * Callback function that is called when the user press the Pay button
   *
   * @param {string} id - The ID of the payable
   *
   * @returns {void}
   */
  onPay?: (id: string) => void;
};

export function usePayableDetails({
  id,
  onSave,
  onCancel,
  onSubmit,
  onReject,
  onApprove,
  onSaved,
  onCanceled,
  onSubmitted,
  onRejected,
  onApproved,
  onPay,
}: UsePayableDetailsProps) {
  const [payableId, setPayableId] = useState<string | undefined>(id);
  const [isPermissionsLoading, setIsPermissionsLoading] =
    useState<boolean>(true);
  const [permissions, setPermissions] = useState<PayableDetailsPermissions[]>(
    []
  );
  const [isEdit, setEdit] = useState<boolean>(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isActionButtonLoading, setIsActionButtonLoading] = useState(false);

  useEffect(() => {
    if (onSave && onSaved) {
      throw new Error(
        'Both onSave and onSaved props were provided. Please provide only one of them.'
      );
    }

    if (onCancel && onCanceled) {
      throw new Error(
        'Both onCancel and onCanceled props were provided. Please provide only one of them.'
      );
    }

    if (onSubmit && onSubmitted) {
      throw new Error(
        'Both onSubmit and onSubmitted props were provided. Please provide only one of them.'
      );
    }

    if (onReject && onRejected) {
      throw new Error(
        'Both onReject and onRejected props were provided. Please provide only one of them.'
      );
    }

    if (onApprove && onApproved) {
      throw new Error(
        'Both onApprove and onApproved props were provided. Please provide only one of them.'
      );
    }
  }, [
    onSave,
    onSaved,
    onCancel,
    onCanceled,
    onSubmit,
    onSubmitted,
    onReject,
    onRejected,
    onApprove,
    onApproved,
  ]);

  const {
    data: payable,
    error: payableQueryError,
    isInitialLoading,
  } = usePayableById(payableId);

  const { data: lineItemsData } = usePayableLineItemsList(payableId);

  const lineItems = lineItemsData?.data;

  const { data: isCancelAvailable } = useIsActionAllowed({
    method: 'payable',
    action: PayableActionEnum.CANCEL,
    entityUserId: payable?.was_created_by_user_id,
  });
  const { data: isUpdatesAvailable } = useIsActionAllowed({
    method: 'payable',
    action: PayableActionEnum.UPDATE,
    entityUserId: payable?.was_created_by_user_id,
  });
  const { data: isSubmitAvailable } = useIsActionAllowed({
    method: 'payable',
    action: PayableActionEnum.SUBMIT,
    entityUserId: payable?.was_created_by_user_id,
  });
  const { data: isApproveAvailable } = useIsActionAllowed({
    method: 'payable',
    action: PayableActionEnum.APPROVE,
    entityUserId: payable?.was_created_by_user_id,
  });
  const { data: isPayAvailable } = useIsActionAllowed({
    method: 'payable',
    action: PayableActionEnum.PAY,
    entityUserId: payable?.was_created_by_user_id,
  });

  const createMutation = useCreatePayableWithLineItems();
  const saveMutation = useUpdatePayableByIdWithLineItems(payableId);
  const cancelMutation = useCancelPayableById(payableId);
  const submitMutation = useSubmitPayableById(payableId);
  const rejectMutation = useRejectPayableById(payableId);
  const approveMutation = useApprovePayableById(payableId);

  const status = payable?.status;

  useEffect(() => {
    setPayableId(id);
  }, [id]);

  useEffect(() => {
    if (!payableId) setEdit(true);
  }, [payableId]);

  useEffect(() => {
    if (!status) {
      if (!isInitialLoading) {
        setIsPermissionsLoading(false);
      }

      if (!payableId) {
        setPermissions(['cancelEdit', 'save']);
      }

      return;
    }

    setPermissions([]);
    setIsPermissionsLoading(true);

    switch (status) {
      case PayableStateEnum.DRAFT: {
        let permissions: PayableDetailsPermissions[] = [];

        if (isEdit) {
          if (isUpdatesAvailable) {
            permissions.push('cancelEdit');
            permissions.push('save');
          }
        } else {
          if (isUpdatesAvailable) {
            permissions.push('edit');
          }
        }

        setPermissions(permissions);

        break;
      }

      case PayableStateEnum.NEW: {
        let permissions: PayableDetailsPermissions[] = [];

        if (isEdit) {
          if (isUpdatesAvailable) {
            permissions.push('cancelEdit');
            permissions.push('save');
          }
        } else {
          if (isCancelAvailable) {
            permissions.push('cancel');
          }

          if (isUpdatesAvailable) {
            permissions.push('edit');
          }

          if (isSubmitAvailable) {
            permissions.push('submit');
          }
        }

        setPermissions(permissions);

        break;
      }

      case PayableStateEnum.APPROVE_IN_PROGRESS: {
        let permissions: PayableDetailsPermissions[] = [];

        if (isApproveAvailable) {
          permissions.push('reject', 'approve');
        }

        if (isCancelAvailable) {
          permissions.push('cancel');
        }

        setPermissions(permissions);

        break;
      }

      case PayableStateEnum.WAITING_TO_BE_PAID: {
        if (isPayAvailable) {
          setPermissions(['pay']);
        }

        break;
      }
    }

    setIsPermissionsLoading(false);
  }, [
    isEdit,
    isCancelAvailable,
    isApproveAvailable,
    isInitialLoading,
    isPayAvailable,
    isSubmitAvailable,
    isUpdatesAvailable,
    status,
    payableId,
  ]);

  useEffect(() => {
    setIsFormLoading(
      createMutation.isLoading ||
        saveMutation.isLoading ||
        submitMutation.isLoading
    );
  }, [
    createMutation.isLoading,
    saveMutation.isLoading,
    submitMutation.isLoading,
  ]);

  useEffect(() => {
    setIsActionButtonLoading(
      createMutation.isLoading ||
        saveMutation.isLoading ||
        cancelMutation.isLoading ||
        submitMutation.isLoading ||
        rejectMutation.isLoading ||
        approveMutation.isLoading
    );
  }, [
    createMutation.isLoading,
    saveMutation.isLoading,
    cancelMutation.isLoading,
    submitMutation.isLoading,
    rejectMutation.isLoading,
    approveMutation.isLoading,
  ]);

  const createInvoice = useCallback(
    async (
      data: PayableUploadWithDataSchema,
      lineItemsToCreate?: LineItem[]
    ) => {
      const payable = await createMutation.mutateAsync({
        body: data,
        lineItemsToCreate: lineItemsToCreate,
      });

      setPayableId(payable.id);

      isEdit && setEdit(false);
      onSave?.(payable.id);
      onSaved?.(payable.id);
    },
    [createMutation, isEdit, onSave, onSaved]
  );

  const saveInvoice = useCallback(
    async (
      id: string,
      data: PayableUpdateSchema,
      updatedLineItems?: LineItem[],
      dirtyFields?: FieldNamesMarkedBoolean<PayableDetailsFormFields>
    ) => {
      await saveMutation.mutateAsync({
        id,
        body: data,
        updatedLineItems,
        dirtyFields,
        lineItems,
      });

      isEdit && setEdit(false);
      onSave?.(id);
      onSaved?.(id);
    },
    [saveMutation, isEdit, onSave, onSaved, lineItems]
  );

  const cancelInvoice = useCallback(async () => {
    if (payableId) {
      await cancelMutation.mutateAsync(payableId);
      onCancel?.(payableId);
      onCanceled?.(payableId);
    }
  }, [cancelMutation, payableId, onCancel, onCanceled]);

  const submitInvoice = useCallback(async () => {
    if (payableId) {
      await submitMutation.mutateAsync(payableId);
      onSubmit?.(payableId);
      onSubmitted?.(payableId);
    }
  }, [submitMutation, payableId, onSubmit, onSubmitted]);

  const rejectInvoice = useCallback(async () => {
    if (payableId) {
      await rejectMutation.mutateAsync(payableId);
      onReject?.(payableId);
      onRejected?.(payableId);
    }
  }, [rejectMutation, payableId, onReject, onRejected]);

  const approveInvoice = useCallback(async () => {
    if (payableId) {
      await approveMutation.mutateAsync(payableId);
      onApprove?.(payableId);
      onApproved?.(payableId);
    }
  }, [approveMutation, payableId, onApprove, onApproved]);

  const payInvoice = useCallback(() => {
    if (payableId) {
      onPay?.(payableId);
    }
  }, [payableId, onPay]);

  return {
    payable,
    isLoading:
      isInitialLoading ||
      isActionButtonLoading ||
      isPermissionsLoading ||
      isFormLoading,
    payableQueryError,
    isEdit,
    permissions,
    lineItems,
    actions: {
      setEdit,
      createInvoice,
      saveInvoice,
      submitInvoice,
      rejectInvoice,
      approveInvoice,
      cancelInvoice,
      payInvoice,
    },
  };
}
