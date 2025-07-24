import {
  prepareCounterpartBank,
  prepareCreateCounterpartBankAccount,
  prepareUpdateCounterpartBankAccount,
} from './mapper';
import {
  CounterpartBankFormFields,
  getBankValidationSchema,
} from './validation';
import { components } from '@/api';
import {
  useCounterpartById,
  useCounterpartBankById,
  useCreateCounterpartBank,
  useUpdateCounterpartBank,
} from '@/core/queries/useCounterpart';
import { zodResolver } from '@hookform/resolvers/zod';
import { useLingui } from '@lingui/react';
import { useCallback, useEffect, useId, useMemo } from 'react';
import { useForm } from 'react-hook-form';

export type CounterpartBankFormProps = {
  counterpartId: string;
  bankId?: string;
  onCancel?: () => void;
  onCreate?: (id: string) => void;
  onUpdate?: (id: string) => void;
  payableCounterpartRawData?: components['schemas']['CounterpartRawData'];
};

export function useCounterpartBankForm({
  counterpartId,
  bankId,
  onCreate,
  onUpdate,
  payableCounterpartRawData,
}: CounterpartBankFormProps) {
  const formId = `Monite-CounterpartBankForm-${useId()}`;

  const { data: counterpart, isLoading: isCounterpartLoading } =
    useCounterpartById(counterpartId);
  const { data: bank, isLoading: isBankLoading } = useCounterpartBankById(
    counterpartId,
    bankId
  );

  const createBankMutation = useCreateCounterpartBank();
  const updateBankMutation = useUpdateCounterpartBank();

  const { i18n } = useLingui();
  const methods = useForm<
    CounterpartBankFormFields,
    any,
    CounterpartBankFormFields
  >({
    resolver: zodResolver(getBankValidationSchema()),
    defaultValues: useMemo(() => prepareCounterpartBank(bank), [bank]),
  });

  useEffect(() => {
    const resetForm = methods.reset;
    if (bank) resetForm(prepareCounterpartBank(bank));
  }, [methods.reset, bank, i18n]);

  const saveBank = useCallback(
    (values: CounterpartBankFormFields) => {
      if (bank) {
        const mutateUpdateBank = updateBankMutation.mutate;
        mutateUpdateBank(
          {
            path: {
              counterpart_id: counterpartId,
              bank_account_id: bank.id,
            },
            body: prepareUpdateCounterpartBankAccount(values),
          },
          {
            onSuccess: (bank) => {
              onUpdate?.(bank.id);
            },
          }
        );
      } else {
        const mutateCreateBank = createBankMutation.mutate;
        mutateCreateBank(
          {
            path: {
              counterpart_id: counterpartId,
            },
            body: prepareCreateCounterpartBankAccount(values),
          },
          {
            onSuccess: (bank) => {
              onCreate?.(bank.id);
            },
          }
        );
      }
    },
    [
      bank,
      updateBankMutation.mutate,
      counterpartId,
      onUpdate,
      createBankMutation.mutate,
      onCreate,
    ]
  );

  return {
    methods,
    saveBank,
    counterpart,
    bank,
    formId,
    isLoading:
      createBankMutation.isPending ||
      updateBankMutation.isPending ||
      isCounterpartLoading ||
      isBankLoading,
    error: createBankMutation.error || updateBankMutation.error,
    payableCounterpartRawData,
  };
}
