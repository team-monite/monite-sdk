import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import {
  useCounterpartById,
  useCounterpartVatById,
  useCreateCounterpartVat,
  useUpdateCounterpartVat,
} from '@/core/queries/useCounterpart';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLingui } from '@lingui/react';
import { AllowedCountries, CounterpartVatID } from '@monite/sdk-api';

import { getValidationSchema } from './validation';

export type CounterpartVatFormProps = {
  counterpartId: string;
  vatId?: string;
  onCancel?: () => void;
  onCreate?: (id: string) => void;
  onUpdate?: (id: string) => void;
};

export function useCounterpartVatForm({
  counterpartId,
  vatId,
  onCreate,
  onUpdate,
}: CounterpartVatFormProps) {
  const { data: counterpart, isInitialLoading: isCounterpartLoading } =
    useCounterpartById(counterpartId);
  const { data: vat, isInitialLoading: isVatLoading } = useCounterpartVatById(
    counterpartId,
    vatId
  );

  const createVatMutation = useCreateCounterpartVat(counterpartId);
  const updateVatMutation = useUpdateCounterpartVat(counterpartId);

  const { i18n } = useLingui();
  const methods = useForm<CounterpartVatID>({
    resolver: yupResolver(getValidationSchema(i18n)),
    defaultValues: useMemo(
      () => ({
        country: vat?.country ?? ('' as AllowedCountries),
        type: vat?.type,
        value: vat?.value ?? '',
      }),
      [vat]
    ),
  });

  useEffect(() => {
    const resetForm = methods.reset;
    if (vat) resetForm(vat);
  }, [methods.reset, vat, i18n]);

  const createVat = useCallback(
    (payload: CounterpartVatID) => {
      return createVatMutation.mutate(payload, {
        onSuccess: ({ id }) => {
          onCreate && onCreate(id);
        },
      });
    },
    [createVatMutation, onCreate]
  );

  const updateVat = useCallback(
    (payload: CounterpartVatID) => {
      if (!vat) return;

      return updateVatMutation.mutate(
        {
          vatId: vat.id,
          payload,
        },
        {
          onSuccess: () => {
            onUpdate && onUpdate(vat.id);
          },
        }
      );
    },
    [updateVatMutation, vat, onUpdate]
  );

  const saveVat = useCallback(
    ({ country, type, value }: CounterpartVatID) => {
      const payload: CounterpartVatID = {
        country,
        type,
        value,
      };

      return !!vat ? updateVat(payload) : createVat(payload);
    },
    [vat, updateVat, createVat]
  );

  return {
    methods,
    saveVat,
    counterpart,
    vat,
    isLoading:
      createVatMutation.isPending ||
      updateVatMutation.isPending ||
      isCounterpartLoading ||
      isVatLoading,
    error: createVatMutation.error || updateVatMutation.error,
  };
}
