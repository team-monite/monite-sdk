import {
  type CounterpartVatFormFields,
  getValidationSchema,
} from './validation';
import { components } from '@/api';
import {
  useCounterpartById,
  useCounterpartVatById,
  useCreateCounterpartVat,
  useUpdateCounterpartVat,
} from '@/core/queries/useCounterpart';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLingui } from '@lingui/react';
import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';

export type CounterpartVatFormProps = {
  counterpartId: string;
  vatId?: string;
  onCancel?: () => void;
  onCreate?: (id: string) => void;
  onUpdate?: (id: string) => void;
  payableCounterpartRawData?: components['schemas']['CounterpartRawData'];
};

export function useCounterpartVatForm({
  counterpartId,
  vatId,
  onCreate,
  onUpdate,
  payableCounterpartRawData,
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
  const methods = useForm<CounterpartVatFormFields>({
    resolver: zodResolver(getValidationSchema(i18n)),
    defaultValues: useMemo(() => {
      return {
        country: vat?.country,
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
    ({ country, type, value }: CounterpartVatFormFields) => {
      const payload: components['schemas']['CounterpartVatID'] = {
        country:
          country as components['schemas']['CounterpartVatID']['country'],
        type: type as components['schemas']['CounterpartVatID']['type'],
        value,
      };

      return vat ? updateVat(payload) : createVat(payload);
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
    payableCounterpartRawData,
  };
}
