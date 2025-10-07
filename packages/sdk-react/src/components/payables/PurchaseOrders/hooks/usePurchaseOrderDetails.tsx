import { PurchaseOrderFormData } from '../schemas';
import { PURCHASE_ORDER_CONSTANTS } from '../consts';
import { calculateValidForDays } from '../utils/calculations';
import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { rateMajorToMinor } from '@/core/utils/currencies';
import { getAPIErrorMessage } from '@/core/utils/getAPIErrorMessage';
import { vatRatePercentageToBasisPoints } from '@/core/utils/vatUtils';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

const transformFormDataToCreatePayload = (
  data: PurchaseOrderFormData
): components['schemas']['PurchaseOrderPayloadSchema'] => {
  const {
    line_items,
    currency,
    message,
    expiry_date,
    counterpart_id,
    ...optionalFields
  } = data;

  const validForDays = expiry_date
    ? calculateValidForDays(expiry_date)
    : PURCHASE_ORDER_CONSTANTS.DEFAULT_VALID_FOR_DAYS;

  const payload: components['schemas']['PurchaseOrderPayloadSchema'] = {
    counterpart_id,
    currency: currency as components['schemas']['CurrencyEnum'],
    message: message || '',
    valid_for_days: validForDays,
    items: line_items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      price: rateMajorToMinor(item.price),
      currency: item.currency as components['schemas']['CurrencyEnum'],
      vat_rate: vatRatePercentageToBasisPoints(
        item.vat_rate_value || item.tax_rate_value || 0
      ),
    })),
  };
  if (optionalFields.counterpart_address_id) {
    payload.counterpart_address_id = optionalFields.counterpart_address_id;
  }
  if (optionalFields.entity_vat_id_id) {
    payload.entity_vat_id_id = optionalFields.entity_vat_id_id;
  }
  if (optionalFields.project_id) {
    payload.project_id = optionalFields.project_id;
  }

  return payload;
};

const transformFormDataToUpdatePayload = (
  data: PurchaseOrderFormData
): components['schemas']['UpdatePurchaseOrderPayloadSchema'] => {
  const { line_items, message, expiry_date, ...optionalFields } = data;

  const payload: components['schemas']['UpdatePurchaseOrderPayloadSchema'] = {
    items: line_items.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      price: rateMajorToMinor(item.price),
      currency: item.currency as components['schemas']['CurrencyEnum'],
      vat_rate: vatRatePercentageToBasisPoints(
        item.vat_rate_value || item.tax_rate_value || 0
      ),
    })),
  };

  if (expiry_date) {
    payload.valid_for_days = calculateValidForDays(expiry_date);
  }
  if (optionalFields.counterpart_address_id) {
    payload.counterpart_address_id = optionalFields.counterpart_address_id;
  }
  if (optionalFields.counterpart_id) {
    payload.counterpart_id = optionalFields.counterpart_id;
  }
  if (optionalFields.entity_vat_id_id) {
    payload.entity_vat_id_id = optionalFields.entity_vat_id_id;
  }
  if (optionalFields.project_id) {
    payload.project_id = optionalFields.project_id;
  }
  if (message) {
    payload.message = message;
  }

  return payload;
};

interface UsePurchaseOrderDetailsProps {
  id?: string;
  onSaved?: (purchaseOrderId: string) => void;
  onDeleted?: (purchaseOrderId: string) => void;
}

export const usePurchaseOrderDetails = ({
  id,
  onSaved,
  onDeleted,
}: UsePurchaseOrderDetailsProps) => {
  const { i18n } = useLingui();
  const { api, queryClient, entityId } = useMoniteContext();
  const [isEdit, setEdit] = useState(!id);

  const purchaseOrderQuery =
    api.payablePurchaseOrders.getPayablePurchaseOrdersId.useQuery(
      {
        path: { purchase_order_id: id! },
        header: { 'x-monite-entity-id': entityId },
      },
      { enabled: !!id }
    );

  const purchaseOrder = purchaseOrderQuery.data;
  const isLoading = purchaseOrderQuery.isLoading;
  const error = purchaseOrderQuery.error;

  const createMutation =
    api.payablePurchaseOrders.postPayablePurchaseOrders.useMutation(undefined, {
      onSuccess: (data) => {
        api.payablePurchaseOrders.getPayablePurchaseOrders.invalidateQueries(
          queryClient
        );
        toast.success(t(i18n)`Purchase order created successfully`);
        onSaved?.(data.id);
      },
      onError: (error) => {
        toast.error(getAPIErrorMessage(i18n, error));
      },
    });

  const updateMutation =
    api.payablePurchaseOrders.patchPayablePurchaseOrdersId.useMutation(
      undefined,
      {
        onSuccess: (data) => {
          api.payablePurchaseOrders.getPayablePurchaseOrdersId.invalidateQueries(
            queryClient
          );
          api.payablePurchaseOrders.getPayablePurchaseOrders.invalidateQueries(
            queryClient
          );
          toast.success(t(i18n)`Purchase order updated successfully`);
          setEdit(false);
          onSaved?.(data.id);
        },
        onError: (error) => {
          toast.error(getAPIErrorMessage(i18n, error));
        },
      }
    );

  const deleteMutation =
    api.payablePurchaseOrders.deletePayablePurchaseOrdersId.useMutation(
      undefined,
      {
        onSuccess: () => {
          api.payablePurchaseOrders.getPayablePurchaseOrders.invalidateQueries(
            queryClient
          );
          toast.success(t(i18n)`Purchase order deleted successfully`);
          onDeleted?.(id!);
        },
        onError: (error) => {
          toast.error(getAPIErrorMessage(i18n, error));
        },
      }
    );

  const sendEmailMutation =
    api.payablePurchaseOrders.postPayablePurchaseOrdersIdSend.useMutation(
      undefined,
      {
        onSuccess: () => {
          api.payablePurchaseOrders.getPayablePurchaseOrdersId.invalidateQueries(
            queryClient
          );
          api.payablePurchaseOrders.getPayablePurchaseOrders.invalidateQueries(
            queryClient
          );
          toast.success(t(i18n)`Purchase order sent successfully`);
        },
        onError: (error) => {
          toast.error(getAPIErrorMessage(i18n, error));
        },
      }
    );

  const savePurchaseOrder = async (data: PurchaseOrderFormData) => {
    if (id) {
      await updateMutation.mutateAsync({
        path: { purchase_order_id: id },
        body: transformFormDataToUpdatePayload(data),
        header: { 'x-monite-entity-id': entityId },
      });
    } else {
      await createMutation.mutateAsync({
        body: transformFormDataToCreatePayload(data),
        header: { 'x-monite-entity-id': entityId },
      });
    }
  };

  const deletePurchaseOrder = async () => {
    if (!id) return;
    await deleteMutation.mutateAsync({
      path: { purchase_order_id: id },
      header: { 'x-monite-entity-id': entityId },
    });
  };

  const sendEmail = async (subject: string, body: string) => {
    if (!id) return;

    await sendEmailMutation.mutateAsync({
      path: { purchase_order_id: id },
      body: {
        subject_text: subject,
        body_text: body,
      },
      header: { 'x-monite-entity-id': entityId },
    });
  };

  return {
    purchaseOrder,
    isLoading,
    isEdit,
    error,
    actions: {
      setEdit,
      savePurchaseOrder,
      deletePurchaseOrder,
      sendEmail,
    },
  };
};
