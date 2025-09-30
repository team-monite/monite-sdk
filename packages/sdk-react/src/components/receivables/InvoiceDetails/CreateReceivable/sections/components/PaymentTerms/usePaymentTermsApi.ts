import { components } from '@/api';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { toast } from 'react-hot-toast';

interface UsePaymentTermsApiParams {
  onDelete?: () => void;
  onCreationError?: () => void;
  onSuccessfullChange?: (
    id?: components['schemas']['PaymentTermsResponse']['id']
  ) => void;
}

export const usePaymentTermsApi = ({
  onCreationError,
  onDelete,
  onSuccessfullChange,
}: UsePaymentTermsApiParams = {}) => {
  const { api, queryClient } = useMoniteContext();
  const { i18n } = useLingui();

  const createMutation = api.paymentTerms.postPaymentTerms.useMutation(
    undefined,
    {
      onSuccess: (paymentTerm) => {
        api.paymentTerms.getPaymentTerms.invalidateQueries(queryClient);
        toast.success(t(i18n)`Payment term created`);
        onSuccessfullChange?.(paymentTerm.id);
      },
      onError: () => {
        onCreationError?.();
      },
    }
  );

  const updateMutation = api.paymentTerms.patchPaymentTermsId.useMutation(
    undefined,
    {
      onSuccess: (paymentTerm) => {
        api.paymentTerms.getPaymentTerms.invalidateQueries(queryClient);
        toast.success(t(i18n)`Payment term updated`);
        onSuccessfullChange?.(paymentTerm.id);
      },
      onError: () => {
        toast.error(t(i18n)`Error updating payment term`);
      },
    }
  );

  const deleteMutation = api.paymentTerms.deletePaymentTermsId.useMutation(
    undefined,
    {
      onSuccess: () => {
        toast.success(t(i18n)`Payment term successfully deleted`);
        onDelete?.();
        onSuccessfullChange?.();
      },
      onError: () => {
        toast.error(t(i18n)`Error deleting payment term`);
      },
    }
  );

  const createPaymentTerm = async (
    values: components['schemas']['PaymentTermsCreatePayload']
  ) => {
    await createMutation.mutateAsync({ body: values });
  };

  const updatePaymentTerm = async (
    id: string,
    values: components['schemas']['PaymentTermsUpdatePayload']
  ) => {
    await updateMutation.mutateAsync({
      path: {
        payment_terms_id: id,
      },
      body: values,
    });
  };

  const deletePaymentTerm = async (id: string) => {
    await deleteMutation.mutateAsync({
      path: {
        payment_terms_id: id,
      },
    });
  };

  return {
    createPaymentTerm,
    updatePaymentTerm,
    deletePaymentTerm,
  };
};
