import { useGetPayableCounterpart } from '../hooks/useGetPayableCounterpart';
import { components } from '@/api';
import {
  type LineItem,
  prepareLineItemSubmit,
} from '@/components/payables/PayableDetails/PayableDetailsForm/helpers';
import { type PayableDetailsFormFields } from '@/components/payables/PayableDetails/PayableDetailsForm/validation';
import { usePaymentHandler } from '@/components/payables/PayablesTable/hooks/usePaymentHandler';
import { usePayButtonVisibility } from '@/components/payables/hooks/usePayButtonVisibility';
import { isPayableInOCRProcessing } from '@/components/payables/utils/isPayableInOcr';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { useCurrencies } from '@/core/hooks';
import {
  useEntityUserByAuthToken,
  useEntityUserRoleByAuthToken,
} from '@/core/queries/useEntityUsers';
import { usePayablePaymentIntentsAndRecords } from '@/core/queries/usePaymentRecords';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useCallback, useEffect, useState } from 'react';
import { FieldNamesMarkedBoolean } from 'react-hook-form';
import { toast } from 'react-hot-toast';

// Payable refetch intervals, in milliseconds
const REFETCH_INTERVAL_DEFAULT = 15_000;
const REFETCH_INTERVAL_OCR_PROCESSING = 2_000;
const REFETCH_INTERVAL_APPROVE_IN_PROGRESS = 1_000;
const REFETCH_APPROVE_IN_PROGRESS_WINDOW = 10_000;

export type PayableDetailsPermissions =
  | 'edit'
  | 'save'
  | 'cancelEdit'
  | 'cancel'
  | 'submit'
  | 'reject'
  | 'approve'
  | 'forceReject'
  | 'forceApprove'
  | 'reopen'
  | 'delete'
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

  /** Callback function that is called when the payable is reopened
   *
   * @param {string} id - The ID of the payable
   *
   * @returns {void}
   */
  onReopened?: (id: string) => void;

  /** Callback function that is called when the payable is deleted
   *
   * @param {string} id - The ID of the payable
   *
   * @returns {void}
   */
  onDeleted?: (id: string) => void;

  /**
   * Callback function that is called when the user press the Pay button
   *
   * @param {string} id - The ID of the payable
   *
   * @returns {void}
   */
  onPay?: (id: string) => void;

  /**
   * Callback function that is called when the user press the Pay button in US
   *
   * @param {string} id - The ID of the payable
   *
   * @returns {void}
   */
  onPayUS?: (id: string) => void;
};

export function usePayableDetails({
  id,
  onSaved,
  onCanceled,
  onSubmitted,
  onRejected,
  onApproved,
  onReopened,
  onDeleted,
  onPay,
  onPayUS,
}: UsePayableDetailsProps) {
  const { api, queryClient } = useMoniteContext();
  const { i18n } = useLingui();
  const { formatToMinorUnits } = useCurrencies();

  const [payableId, setPayableId] = useState<string | undefined>(id);
  const [isPermissionsLoading, setIsPermissionsLoading] =
    useState<boolean>(true);

  const { data: currentUser } = useEntityUserByAuthToken();
  const { data: currentUserRole } = useEntityUserRoleByAuthToken();
  const [permissions, setPermissions] = useState<PayableDetailsPermissions[]>(
    []
  );
  const [isEdit, setEdit] = useState<boolean>(false);
  const [isFormLoading, setIsFormLoading] = useState(false);
  const [isActionButtonLoading, setIsActionButtonLoading] = useState(false);
  //TODO: align better with internal state structure
  const [tempPayableID, setTempPayableID] = useState(payableId);

  const cachedPayable = api.payables.getPayablesId.getQueryData(
    {
      path: { payable_id: payableId ?? '' },
    },
    queryClient
  );

  const isOcrProcessing =
    cachedPayable && isPayableInOCRProcessing(cachedPayable);

  const {
    data: payable,
    error: payableQueryError,
    isLoading,
    refetch: refetchPayable,
  } = api.payables.getPayablesId.useQuery(
    { path: { payable_id: payableId ?? '' } },
    {
      enabled: !!payableId,
      refetchInterval: (data) => {
        const payable = data.state.data;

        // Payable is in OCR processing, refetch every 2 seconds.
        if (isOcrProcessing) {
          return REFETCH_INTERVAL_OCR_PROCESSING;
        }

        // Payable is in approve_in_progress status and has no approval policy, refetch every 1 second,
        // until 10 seconds after the last Payable update (the submit action).
        // Needed because the server takes some time to apply the approval policy to the Payable.
        if (
          payable?.status === 'approve_in_progress' &&
          !payable.approval_policy_id
        ) {
          const updatedAt = new Date(payable.updated_at);
          const now = new Date();
          const timeDifferenceMs = now.getTime() - updatedAt.getTime();

          if (timeDifferenceMs < REFETCH_APPROVE_IN_PROGRESS_WINDOW) {
            return REFETCH_INTERVAL_APPROVE_IN_PROGRESS;
          }
        }

        return REFETCH_INTERVAL_DEFAULT;
      },
      refetchOnMount: true,
    }
  );

  // Fetch payment records for the payable
  const { payablesPaymentIntentsRecord, refetch: refetchPaymentRecords } =
    usePayablePaymentIntentsAndRecords(payableId ? [payableId] : []);

  // Determine pay button visibility
  const { showPayButton, intentsAnalysis } = usePayButtonVisibility({
    payable,
    payableRecentPaymentRecordByIntent:
      payablesPaymentIntentsRecord?.[payableId ?? ''] || [],
  });

  const { handlePay, modalComponent } = usePaymentHandler(
    tempPayableID ?? id,
    payable?.counterpart_id,
    () => {
      refetchPayable();
      refetchPaymentRecords();
    },
    intentsAnalysis.idPaymentIntentInCreated
  );

  const { counterpart, isCounterpartAIMatched, AISuggestions } =
    useGetPayableCounterpart({ payable });

  useEffect(() => {
    if (isOcrProcessing)
      return () => void api.payables.getPayables.invalidateQueries(queryClient);
  }, [api, isOcrProcessing, queryClient]);

  const { data: lineItemsData } = api.payables.getPayablesIdLineItems.useQuery(
    {
      path: { payable_id: payableId ?? '' },
    },
    { enabled: !!payableId }
  );

  const lineItems = lineItemsData?.data;

  const { data: approvalRequests } =
    api.approvalRequests.getApprovalRequests.useQuery(
      {
        query: {
          object_id: payableId,
          object_type: 'payable',
          order: 'desc',
        },
      },
      {
        enabled: !!payableId && payable?.status === 'approve_in_progress',
      }
    );

  const activeApprovalRequest = approvalRequests?.data?.[0];

  const currentUserApprovalRequest = approvalRequests?.data?.find(
    (request) =>
      request.status === 'waiting' &&
      !request.approved_by?.includes(currentUser?.id ?? '') &&
      (request.user_ids?.includes(currentUser?.id ?? '') ||
        request.role_ids?.includes(currentUserRole?.id ?? ''))
  );

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
  const { data: isReopenAvailable } = useIsActionAllowed({
    method: 'payable',
    action: 'reopen',
    entityUserId: payable?.was_created_by_user_id,
  });

  const { data: isDeleteAvailable } = useIsActionAllowed({
    method: 'payable',
    action: 'delete',
    entityUserId: payable?.was_created_by_user_id,
  });

  const createMutation = api.payables.postPayables.useMutation(
    {},
    {
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
      onSuccess: (payable) => {
        Promise.all([
          api.payables.getPayablesId.invalidateQueries(
            { parameters: { path: { payable_id: payable.id } } },
            queryClient
          ),
          api.payables.getPayables.invalidateQueries(queryClient),
          api.approvalRequests.getApprovalRequests.invalidateQueries(
            queryClient
          ),
        ]);
      },
      onError: (error) => {
        toast.error(getAPIErrorMessage(i18n, error));
      },
    });

  const rejectApprovalRequestMutation =
    api.approvalRequests.postApprovalRequestsIdReject.useMutation(undefined, {
      onSuccess: () => {
        // Invalidate the approval requests cache to show the new status
        api.approvalRequests.getApprovalRequests.invalidateQueries(queryClient);

        // Return a Promise that resolves after the delay and invalidations
        // Needed because the server doesn't return the updated Payable status immediately
        return new Promise<void>((resolve) => {
          // Delay before invalidating queries to allow server processing
          setTimeout(() => {
            Promise.all([
              api.payables.getPayablesId.invalidateQueries(
                { parameters: { path: { payable_id: payableId ?? '' } } },
                queryClient
              ),
              api.payables.getPayables.invalidateQueries(queryClient),
            ]).then(() => resolve());
          }, 500);
        });
      },
      onError: (error) => {
        toast.error(getAPIErrorMessage(i18n, error));
      },
    });

  const approveApprovalRequestMutation =
    api.approvalRequests.postApprovalRequestsIdApprove.useMutation(undefined, {
      onSuccess: () => {
        // Invalidate the approval requests cache to show the new status
        api.approvalRequests.getApprovalRequests.invalidateQueries(queryClient);

        // Return a Promise that resolves after the delay and invalidations
        // Needed because the server doesn't return the updated Payable status immediately
        return new Promise<void>((resolve) => {
          // Delay before invalidating queries to allow server processing
          setTimeout(() => {
            Promise.all([
              api.payables.getPayablesId.invalidateQueries(
                { parameters: { path: { payable_id: payableId ?? '' } } },
                queryClient
              ),
              api.payables.getPayables.invalidateQueries(queryClient),
            ]).then(() => resolve());
          }, 500);
        });
      },
      onError: (error) => {
        toast.error(getAPIErrorMessage(i18n, error));
      },
    });

  const forceRejectMutation = api.payables.postPayablesIdReject.useMutation(
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

  const forceApproveMutation =
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

  const reopenMutation = api.payables.postPayablesIdReopen.useMutation(
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

  const deleteMutation = api.payables.deletePayablesId.useMutation(undefined, {
    onSuccess: () =>
      Promise.all([api.payables.getPayables.invalidateQueries(queryClient)]),
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
        const permissions: PayableDetailsPermissions[] = [];

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
        const permissions: PayableDetailsPermissions[] = [];

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
        const permissions: PayableDetailsPermissions[] = [];

        const hasWaitingApprovalRequests =
          (approvalRequests?.data?.length ?? 0) > 0 &&
          approvalRequests?.data?.[0]?.status === 'waiting';

        // Show regular approve/reject buttons only if there are waiting approval requests
        // These buttons use /approval_requests endpoints and don't require payable-level permissions
        if (hasWaitingApprovalRequests) {
          const hasCurrentUserPendingRequest =
            currentUserApprovalRequest !== undefined;

          // Show approve/reject buttons if user has pending approval request
          if (hasCurrentUserPendingRequest) {
            permissions.push('reject', 'approve');
          }
        }

        // Force buttons are available to super users regardless of approval request status
        // These buttons DO require payable-level permissions (isApproveAvailable)
        const hasApprovePermission = () => {
          const payableObj = currentUserRole?.permissions?.objects?.find(
            (o) => o.object_type === 'payable'
          );
          if (!payableObj?.actions) return false;
          return (
            Array.isArray(payableObj.actions) &&
            payableObj.actions.some(
              (a) => a.action_name === 'approve' && a.permission === 'allowed'
            )
          );
        };
        const isApprovalSuperUser = hasApprovePermission();

        if (isApproveAvailable && isApprovalSuperUser) {
          permissions.push('forceReject', 'forceApprove');
        }

        setPermissions(permissions);

        break;
      }

      case 'waiting_to_be_paid':
      case 'partially_paid': {
        if (isPayAvailable && Number(payable.amount_to_pay) > 0) {
          setPermissions(['pay']);
        }

        break;
      }

      case 'rejected': {
        if (isReopenAvailable) {
          setPermissions(['reopen']);
        }
        break;
      }

      case 'canceled': {
        if (isDeleteAvailable) {
          setPermissions(['delete']);
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
    isReopenAvailable,
    isDeleteAvailable,
    status,
    payableId,
    payable?.amount_to_pay,
    activeApprovalRequest,
    currentUserApprovalRequest,
    currentUser?.id,
    currentUserRole?.id,
    currentUserRole?.permissions,
    approvalRequests,
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
        forceRejectMutation.isPending ||
        forceApproveMutation.isPending ||
        reopenMutation.isPending ||
        rejectApprovalRequestMutation.isPending ||
        approveApprovalRequestMutation.isPending
    );
  }, [
    createMutation.isPending,
    updateMutation.isPending,
    cancelMutation.isPending,
    submitMutation.isPending,
    forceRejectMutation.isPending,
    forceApproveMutation.isPending,
    reopenMutation.isPending,
    rejectApprovalRequestMutation.isPending,
    approveApprovalRequestMutation.isPending,
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
            t(i18n)`Payable “${createdPayable.document_id}” has been created`
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

    // Invalidate queries BEFORE calling onSaved to ensure they happen while component is still mounted
    await Promise.all([
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
    ]);

    setPayableId(payable.id);

    isEdit && setEdit(false);
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
            t(i18n)`Payable “${updatedPayable.document_id}” has been updated`
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
    onSaved?.(id);
  };

  const updateTags = async (
    id: string,
    tags: components['schemas']['TagReadSchema'][]
  ) => {
    const tagIds = tags.map((tag) => tag.id);

    await updateMutation.mutateAsync(
      {
        path: { payable_id: id },
        body: { tag_ids: tagIds },
      },
      {
        onSuccess: (payable) => {
          api.payables.getPayablesId.invalidateQueries(
            { parameters: { path: { payable_id: payable.id } } },
            queryClient
          );
        },
      }
    );
  };

  const cancelInvoice = async () => {
    if (payableId) {
      await cancelMutation.mutateAsync(
        {
          path: { payable_id: payableId },
        },
        {
          onSuccess: (payable) => {
            toast.success(
              t(i18n)`Payable “${payable.document_id}” has been canceled`
            );
          },
        }
      );
      onCanceled?.(payableId);
    }
  };

  const submitInvoice = async () => {
    if (payableId) {
      // Update Payable with AI suggested Counterpart, if it exists
      if (counterpart?.id && isCounterpartAIMatched) {
        try {
          await updateMutation.mutateAsync({
            path: { payable_id: payableId },
            body: {
              counterpart_id: counterpart.id,
              ...(AISuggestions?.suggested_counterpart?.bank_account_id && {
                counterpart_bank_account_id:
                  AISuggestions.suggested_counterpart.bank_account_id,
              }),
              ...(AISuggestions?.suggested_counterpart?.address_id && {
                counterpart_address_id:
                  AISuggestions.suggested_counterpart.address_id,
              }),
              ...(AISuggestions?.suggested_counterpart?.vat_id_id && {
                counterpart_vat_id_id:
                  AISuggestions.suggested_counterpart.vat_id_id,
              }),
            },
          });
        } catch (error) {
          console.error(
            'Error updating Payable with AI suggested Counterpart',
            error
          );
          toast.error(
            t(
              i18n
            )`Failed to submit Payable with AI suggestion. Please try editing the Payable and submit again.`
          );
          return; // Return early, don't proceed to submit
        }
      }

      // Submit Payable
      await submitMutation.mutateAsync(
        {
          path: { payable_id: payableId },
        },
        {
          onSuccess: (payable) => {
            toast.success(
              t(i18n)`Payable “${payable.document_id}” has been submitted`
            );
          },
        }
      );
      setTempPayableID(payableId);
      onSubmitted?.(payableId);
    }
  };

  const rejectInvoice = async () => {
    if (payableId && currentUserApprovalRequest) {
      await rejectApprovalRequestMutation.mutateAsync(
        {
          body: undefined,
          path: { approval_request_id: currentUserApprovalRequest.id },
        },
        {
          onSuccess: () => {
            if (!payable) return;

            toast.success(
              t(i18n)`Payable “${payable.document_id}” has been rejected`
            );
          },
        }
      );
      onRejected?.(payableId);
    }
  };

  const approveInvoice = async () => {
    if (payableId && currentUserApprovalRequest) {
      await approveApprovalRequestMutation.mutateAsync(
        {
          path: { approval_request_id: currentUserApprovalRequest.id },
        },
        {
          onSuccess: () => {
            toast.success(
              t(i18n)`Payable “${
                payable?.document_id ?? 'document id is unknown'
              }” has been approved`
            );
          },
        }
      );
      onApproved?.(payableId);
    }
  };

  const forceRejectInvoice = async () => {
    if (payableId) {
      await forceRejectMutation.mutateAsync(
        {
          path: { payable_id: payableId },
        },
        {
          onSuccess: (payable) => {
            toast.success(
              t(i18n)`Payable “${payable.document_id}” has been force rejected`
            );
          },
        }
      );
      onRejected?.(payableId);
    }
  };

  const forceApproveInvoice = async () => {
    if (payableId) {
      await forceApproveMutation.mutateAsync(
        {
          path: { payable_id: payableId },
        },
        {
          onSuccess: (payable) => {
            toast.success(
              t(i18n)`Payable “${payable.document_id}” has been force approved`
            );
          },
        }
      );
      onApproved?.(payableId);
    }
  };

  const reopenInvoice = async () => {
    if (payableId) {
      await reopenMutation.mutateAsync(
        {
          path: { payable_id: payableId },
        },
        {
          onSuccess: (payable) => {
            toast.success(
              t(i18n)`Payable “${payable.document_id}” has been reopened`
            );
          },
        }
      );
      onReopened?.(payableId);
    }
  };

  const deleteInvoice = async () => {
    if (payableId) {
      await deleteMutation.mutateAsync(
        {
          path: { payable_id: payableId },
        },
        {
          onSuccess: () => {
            onDeleted?.(payableId);
          },
        }
      );
    }
  };

  const payInvoice = useCallback(() => {
    if (payable) {
      // TODO: remove onPayUS prop
      if (onPayUS && payable.currency === 'USD') {
        onPayUS(payable.id);
      } else {
        onPay ? onPay?.(payable.id) : handlePay();
      }
    }
  }, [payable, handlePay, onPay, onPayUS]);

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
    showPayButton,
    activeApprovalRequest,
    currentUserApprovalRequest,
    actions: {
      setEdit,
      createInvoice,
      saveInvoice,
      submitInvoice,
      rejectInvoice,
      approveInvoice,
      forceRejectInvoice,
      forceApproveInvoice,
      reopenInvoice,
      cancelInvoice,
      deleteInvoice,
      payInvoice,
      handlePay,
      updateTags,
      modalComponent,
    },
  };
}
