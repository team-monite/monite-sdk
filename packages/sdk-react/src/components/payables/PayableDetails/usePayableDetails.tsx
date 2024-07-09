import { useCallback, useEffect, useState } from 'react';
import { FieldNamesMarkedBoolean } from 'react-hook-form';
import { toast } from 'react-hot-toast';

import { components } from '@/api';
import {
  LineItem,
  PayableDetailsFormFields,
  prepareLineItemSubmit,
} from '@/components/payables/PayableDetails/PayableDetailsForm/helpers';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';

import { payablesDefaultQueryConfig } from '../consts';

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
  const { api, queryClient } = useMoniteContext();
  const { i18n } = useLingui();
  const { formatToMinorUnits } = useCurrencies();

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
    isLoading,
  } = api.payables.getPayablesId.useQuery(
    { path: { payable_id: payableId ?? '' } },
    { enabled: !!payableId, ...payablesDefaultQueryConfig }
  );

  const { data: lineItemsData } = api.payables.getPayablesIdLineItems.useQuery(
    {
      path: { payable_id: payableId ?? '' },
    },
    { enabled: !!payableId }
  );

  const lineItems = lineItemsData?.data;

  const { data: isCancelAvailable } = useIsActionAllowed({
    method: 'payable',
    action: 'cancel',
    entityUserId: payable?.was_created_by_user_id,
  });
  const { data: isUpdatesAvailable } = useIsActionAllowed({
    method: 'payable',
    action: 'update',
    entityUserId: payable?.was_created_by_user_id,
  });
  const { data: isSubmitAvailable } = useIsActionAllowed({
    method: 'payable',
    action: 'submit',
    entityUserId: payable?.was_created_by_user_id,
  });
  const { data: isApproveAvailable } = useIsActionAllowed({
    method: 'payable',
    action: 'approve',
    entityUserId: payable?.was_created_by_user_id,
  });
  const { data: isPayAvailable } = useIsActionAllowed({
    method: 'payable',
    action: 'pay',
    entityUserId: payable?.was_created_by_user_id,
  });

  const createMutation = api.payables.postPayables.useMutation(
    {},
    {
      onSuccess: (payable) =>
        Promise.all([
          api.payables.getPayablesId.invalidateQueries(
            { parameters: { path: { payable_id: payable.id } } },
            queryClient
          ),
          api.payables.getPayables.invalidateQueries(queryClient),
          api.payables.getPayablesIdLineItems.invalidateQueries(
            {
              parameters: { path: { payable_id: payable.id } },
            },
            queryClient
          ),
        ]),
      onError: (error) => {
        toast.error(getAPIErrorMessage(i18n, error));
      },
    }
  );
  const updateMutation = api.payables.patchPayablesId.useMutation(undefined, {
    onSuccess: (payable) =>
      Promise.all([
        api.payables.getPayablesId.invalidateQueries(
          { parameters: { path: { payable_id: payable.id } } },
          queryClient
        ),
        api.payables.getPayables.invalidateQueries(queryClient),
        api.payables.getPayablesIdLineItems.invalidateQueries(
          {
            parameters: { path: { payable_id: payable.id } },
          },
          queryClient
        ),
      ]),
    onError: (error) => {
      toast.error(getAPIErrorMessage(i18n, error));
    },
  });
  const createLineItemMutation =
    api.payables.postPayablesIdLineItems.useMutation(undefined, {
      onSuccess: () =>
        api.payables.getPayablesIdLineItems.invalidateQueries(
          {
            parameters: { path: { payable_id: payableId } },
          },
          queryClient
        ),
      onError: (error) => {
        toast.error(getAPIErrorMessage(i18n, error));
      },
    });
  const updateLineItemMutation =
    api.payables.patchPayablesIdLineItemsId.useMutation(undefined, {
      onSuccess: () =>
        api.payables.getPayablesIdLineItems.invalidateQueries(
          {
            parameters: { path: { payable_id: payableId } },
          },
          queryClient
        ),
      onError: (error) => {
        toast.error(getAPIErrorMessage(i18n, error));
      },
    });
  const deleteLineItemMutation =
    api.payables.deletePayablesIdLineItemsId.useMutation(undefined, {
      onSuccess: () =>
        api.payables.getPayablesIdLineItems.invalidateQueries(
          {
            parameters: { path: { payable_id: payableId } },
          },
          queryClient
        ),
      onError: (error) => {
        toast.error(getAPIErrorMessage(i18n, error));
      },
    });
  const cancelMutation = api.payables.postPayablesIdCancel.useMutation(
    undefined,
    {
      onSuccess: (payable) =>
        Promise.all([
          api.payables.getPayablesId.invalidateQueries(
            { parameters: { path: { payable_id: payable.id } } },
            queryClient
          ),
          api.payables.getPayables.invalidateQueries(queryClient),
        ]),
      onError: (error) => {
        toast.error(getAPIErrorMessage(i18n, error));
      },
    }
  );
  const submitMutation =
    api.payables.postPayablesIdSubmitForApproval.useMutation(undefined, {
      onSuccess: (payable) =>
        Promise.all([
          api.payables.getPayablesId.invalidateQueries(
            { parameters: { path: { payable_id: payable.id } } },
            queryClient
          ),
          api.payables.getPayables.invalidateQueries(queryClient),
        ]),
      onError: (error) => {
        toast.error(getAPIErrorMessage(i18n, error));
      },
    });
  const rejectMutation = api.payables.postPayablesIdReject.useMutation(
    undefined,
    {
      onSuccess: (payable) =>
        Promise.all([
          api.payables.getPayablesId.invalidateQueries(
            { parameters: { path: { payable_id: payable.id } } },
            queryClient
          ),
          api.payables.getPayables.invalidateQueries(queryClient),
        ]),
      onError: (error) => {
        toast.error(getAPIErrorMessage(i18n, error));
      },
    }
  );
  const approveMutation =
    api.payables.postPayablesIdApprovePaymentOperation.useMutation(undefined, {
      onSuccess: (payable) =>
        Promise.all([
          api.payables.getPayablesId.invalidateQueries(
            { parameters: { path: { payable_id: payable.id } } },
            queryClient
          ),
          api.payables.getPayables.invalidateQueries(queryClient),
        ]),
      onError: (error) => {
        toast.error(getAPIErrorMessage(i18n, error));
      },
    });

  const status = payable?.status;

  useEffect(() => {
    setPayableId(id);
  }, [id]);

  useEffect(() => {
    if (!payableId) setEdit(true);
  }, [payableId]);

  useEffect(() => {
    if (!status) {
      if (!isLoading) {
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
      case 'draft': {
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

      case 'new': {
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

      case 'approve_in_progress': {
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

      case 'waiting_to_be_paid': {
        if (isPayAvailable) {
          setPermissions(['pay']);
        }

        break;
      }
    }

    setIsPermissionsLoading(false);
  }, [
    isEdit,
    isLoading,
    isCancelAvailable,
    isApproveAvailable,
    isPayAvailable,
    isSubmitAvailable,
    isUpdatesAvailable,
    status,
    payableId,
  ]);

  useEffect(() => {
    setIsFormLoading(
      createMutation.isPending ||
        updateMutation.isPending ||
        submitMutation.isPending
    );
  }, [
    createMutation.isPending,
    updateMutation.isPending,
    submitMutation.isPending,
  ]);

  useEffect(() => {
    setIsActionButtonLoading(
      createMutation.isPending ||
        updateMutation.isPending ||
        cancelMutation.isPending ||
        submitMutation.isPending ||
        rejectMutation.isPending ||
        approveMutation.isPending
    );
  }, [
    createMutation.isPending,
    updateMutation.isPending,
    cancelMutation.isPending,
    submitMutation.isPending,
    rejectMutation.isPending,
    approveMutation.isPending,
  ]);

  const createInvoice = async (
    data: components['schemas']['PayableUploadWithDataSchema'],
    lineItemsToCreate?: LineItem[]
  ) => {
    const payable = await createMutation.mutateAsync(
      {
        ...data,
      },
      {
        onSuccess: (createdPayable) => {
          toast.success(
            t(i18n)`Payable "${createdPayable.document_id}" was created`
          );
        },
      }
    );

    if (lineItemsToCreate) {
      const lineItemsMutation: Promise<
        components['schemas']['LineItemResponse']
      >[] = [];

      lineItemsToCreate?.forEach((lineItem) => {
        if (payable.currency && !lineItem.id) {
          lineItemsMutation.push(
            createLineItemMutation.mutateAsync({
              path: { payable_id: payable.id },
              body: prepareLineItemSubmit(
                payable.currency,
                lineItem,
                formatToMinorUnits
              ),
            })
          );
        }
      });

      await Promise.all(lineItemsMutation);
    }

    await api.payables.getPayablesId.invalidateQueries(
      { parameters: { path: { payable_id: payable.id } } },
      queryClient
    );

    setPayableId(payable.id);

    isEdit && setEdit(false);
    onSave?.(payable.id);
    onSaved?.(payable.id);
  };

  const saveInvoice = async (
    id: string,
    data: components['schemas']['PayableUpdateSchema'],
    updatedLineItems?: LineItem[],
    dirtyFields?: FieldNamesMarkedBoolean<PayableDetailsFormFields>
  ) => {
    const payable = await updateMutation.mutateAsync(
      {
        path: { payable_id: id },
        body: data,
      },
      {
        onSuccess: (updatedPayable) => {
          toast.success(
            t(i18n)`Payable "${updatedPayable.document_id}" was updated`
          );
        },
      }
    );

    if (updatedLineItems && dirtyFields) {
      const lineItemsMutation: Promise<
        unknown | components['schemas']['LineItemResponse']
      >[] = [];

      // create line items
      updatedLineItems?.forEach((lineItem) => {
        if (payable.currency && !lineItem.id) {
          lineItemsMutation.push(
            createLineItemMutation.mutateAsync({
              path: { payable_id: payable.id },
              body: prepareLineItemSubmit(
                payable.currency,
                lineItem,
                formatToMinorUnits
              ),
            })
          );
        }
      });

      // update line items
      dirtyFields?.lineItems?.forEach(
        ({ id: isIdDirty, ...lineItemsDirtyFields }, index) => {
          const isLineItemDirty = Object.values(lineItemsDirtyFields).some(
            (isFieldDirty) => isFieldDirty
          );
          const lineItemId = updatedLineItems[index]?.id;
          const updatedLineItem = updatedLineItems[index];
          const isLineItemPersistAndUpdated =
            !isIdDirty &&
            Boolean(isLineItemDirty) &&
            Boolean(lineItemId) &&
            Boolean(updatedLineItem);

          if (payable.currency && isLineItemPersistAndUpdated) {
            lineItemsMutation.push(
              updateLineItemMutation.mutateAsync({
                path: { payable_id: payable.id, line_item_id: lineItemId },
                body: prepareLineItemSubmit(
                  payable.currency,
                  updatedLineItem,
                  formatToMinorUnits
                ),
              })
            );
          }
        }
      );

      // delete line items
      lineItems?.forEach((defaultValue) => {
        const formValue = updatedLineItems?.find(
          (lineItem) => lineItem.id === defaultValue.id
        );

        if (!formValue) {
          lineItemsMutation.push(
            deleteLineItemMutation.mutateAsync({
              path: { payable_id: payable.id, line_item_id: defaultValue.id },
              body: undefined,
            })
          );
        }
      });

      await Promise.all(lineItemsMutation);
    }

    await api.payables.getPayablesId.invalidateQueries(
      { parameters: { path: { payable_id: payable.id } } },
      queryClient
    );

    isEdit && setEdit(false);
    onSave?.(id);
    onSaved?.(id);
  };

  const cancelInvoice = async () => {
    if (payableId) {
      await cancelMutation.mutateAsync(
        {
          path: { payable_id: payableId },
          body: undefined,
        },
        {
          onSuccess: (payable) => {
            toast.success(
              t(i18n)`Payable "${payable.document_id}" was canceled`
            );
          },
        }
      );
      onCancel?.(payableId);
      onCanceled?.(payableId);
    }
  };

  const submitInvoice = async () => {
    if (payableId) {
      await submitMutation.mutateAsync(
        {
          path: { payable_id: payableId },
          body: undefined,
        },
        {
          onSuccess: (payable) => {
            toast.success(
              t(i18n)`Payable "${payable.document_id}" was submitted`
            );
          },
        }
      );
      onSubmit?.(payableId);
      onSubmitted?.(payableId);
    }
  };

  const rejectInvoice = async () => {
    if (payableId) {
      await rejectMutation.mutateAsync(
        {
          path: { payable_id: payableId },
          body: undefined,
        },
        {
          onSuccess: (payable) => {
            toast.success(
              t(i18n)`Payable "${payable.document_id}" was rejected`
            );
          },
        }
      );
      onReject?.(payableId);
      onRejected?.(payableId);
    }
  };

  const approveInvoice = async () => {
    if (payableId) {
      await approveMutation.mutateAsync(
        {
          path: { payable_id: payableId },
          body: undefined,
        },
        {
          onSuccess: (payable) => {
            toast.success(
              t(i18n)`Payable "${payable.document_id}" was approved`
            );
          },
        }
      );
      onApprove?.(payableId);
      onApproved?.(payableId);
    }
  };

  const payInvoice = useCallback(() => {
    if (payableId) {
      onPay?.(payableId);
    }
  }, [payableId, onPay]);

  return {
    payable,
    isLoading:
      isLoading ||
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
