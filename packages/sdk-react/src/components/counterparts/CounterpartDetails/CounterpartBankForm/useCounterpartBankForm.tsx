import { useCallback, useEffect, useId, useMemo } from 'react';
import { useForm } from 'react-hook-form';

import {
  useCounterpartById,
  useCounterpartBankById,
  useCreateCounterpartBank,
  useUpdateCounterpartBank,
} from '@/core/queries/useCounterpart';
import { yupResolver } from '@hookform/resolvers/yup';
import { useLingui } from '@lingui/react';

import {
  CounterpartBankFields,
  prepareCounterpartBank,
  prepareCreateCounterpartBankAccount,
  prepareUpdateCounterpartBankAccount,
} from './mapper';
import { getValidationSchema } from './validation';

export type CounterpartBankFormProps = {
  counterpartId: string;
  bankId?: string;
  onCancel?: () => void;
  onCreate?: (id: string) => void;
  onUpdate?: (id: string) => void;
};

export function useCounterpartBankForm({
  counterpartId,
  bankId,
  onCreate,
  onUpdate,
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
  const methods = useForm<CounterpartBankFields>({
    resolver: yupResolver(getValidationSchema(i18n)),
    defaultValues: useMemo(() => prepareCounterpartBank(bank), [bank]),
  });

  useEffect(() => {
    const resetForm = methods.reset;
    if (bank) resetForm(prepareCounterpartBank(bank));
  }, [methods.reset, bank, i18n]);

  const saveBank = useCallback(
    (values: CounterpartBankFields) => {
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
  };
}
