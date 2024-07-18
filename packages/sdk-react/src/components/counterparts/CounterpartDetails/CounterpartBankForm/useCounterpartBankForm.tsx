import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useForm } from 'react-hook-form';

import { components } from '@/api';
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
  const formRef = useRef<HTMLFormElement>(null);

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

  // todo::replace with "form" property on button
  const submitForm = useCallback(() => {
    formRef.current?.dispatchEvent(
      new Event('submit', {
        bubbles: true,
      })
    );
  }, [formRef]);

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
    formRef,
    submitForm,
    isLoading:
      createBankMutation.isPending ||
      updateBankMutation.isPending ||
      isCounterpartLoading ||
      isBankLoading,
    error: createBankMutation.error || updateBankMutation.error,
  };
}
