import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import { components } from '@/api';
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
  const { data: counterpart, isLoading: isCounterpartLoading } =
    useCounterpartById(counterpartId);
  const { data: vat, isLoading: isVatLoading } = useCounterpartVatById(
    counterpartId,
    vatId
  );

  const createVatMutation = useCreateCounterpartVat();
  const updateVatMutation = useUpdateCounterpartVat();

  const { i18n } = useLingui();
  const methods = useForm<components['schemas']['CounterpartVatID']>({
    resolver: yupResolver(getValidationSchema(i18n)),
    defaultValues: useMemo(() => {
      return {
        country:
          vat?.country ?? ('' as components['schemas']['AllowedCountries']),
        type: vat?.type,
        value: vat?.value ?? '',
      };
    }, [vat]),
  });

  useEffect(() => {
    const resetForm = methods.reset;
    if (vat) resetForm(vat);
  }, [methods.reset, vat, i18n]);

  const createVat = useCallback(
    (payload: components['schemas']['CounterpartVatID']) => {
      return createVatMutation.mutateAsync(
        {
          path: {
            counterpart_id: counterpartId,
          },
          body: payload,
        },
        {
          onSuccess: ({ id }) => {
            onCreate && onCreate(id);
          },
        }
      );
    },
    [counterpartId, createVatMutation, onCreate]
  );

  const updateVat = useCallback(
    (payload: components['schemas']['CounterpartVatID']) => {
      if (!vat) return;

      return updateVatMutation.mutate(
        {
          path: {
            counterpart_id: counterpartId,
            vat_id: vat.id,
          },
          body: payload,
        },
        {
          onSuccess: ({ id }) => {
            onUpdate && onUpdate(id);
          },
        }
      );
    },
    [vat, updateVatMutation, counterpartId, onUpdate]
  );

  const saveVat = useCallback(
    ({ country, type, value }: components['schemas']['CounterpartVatID']) => {
      const payload: components['schemas']['CounterpartVatID'] = {
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
