import { useCallback, useEffect, useMemo, useRef } from 'react';
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
  CreateCounterpartBankAccount,
  UpdateCounterpartBankAccount,
} from '@monite/sdk-api';

import {
  CounterpartBankFields,
  prepareCounterpartBank,
  prepareCounterpartBankSubmit,
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

  const { data: counterpart, isInitialLoading: isCounterpartLoading } =
    useCounterpartById(counterpartId);
  const { data: bank, isInitialLoading: isBankLoading } =
    useCounterpartBankById(counterpartId, bankId);

  const createBankMutation = useCreateCounterpartBank(counterpartId);
  const updateBankMutation = useUpdateCounterpartBank(counterpartId);

  const { i18n } = useLingui();
  const methods = useForm<CounterpartBankFields>({
    resolver: yupResolver(getValidationSchema(i18n)),
    defaultValues: useMemo(() => prepareCounterpartBank(bank), [bank]),
  });

  useEffect(() => {
    const resetForm = methods.reset;
    if (bank) resetForm(prepareCounterpartBank(bank));
  }, [methods.reset, bank, i18n]);

  const submitForm = useCallback(() => {
    formRef.current?.dispatchEvent(
      new Event('submit', {
        bubbles: true,
      })
    );
  }, [formRef]);

  const createBank = useCallback(
    (req: CreateCounterpartBankAccount) => {
      return createBankMutation.mutate(req, {
        onSuccess: ({ id }) => {
          onCreate && onCreate(id);
        },
      });
    },
    [createBankMutation, onCreate]
  );

  const updateBank = useCallback(
    (payload: UpdateCounterpartBankAccount) => {
      if (!bank) return;

      return updateBankMutation.mutate(
        {
          bankId: bank.id,
          payload,
        },
        {
          onSuccess: () => {
            onUpdate && onUpdate(bank.id);
          },
        }
      );
    },
    [updateBankMutation, bank, onUpdate]
  );

  const saveBank = useCallback(
    (values: CounterpartBankFields) => {
      const bankValues = prepareCounterpartBankSubmit(values);

      return !!bank ? updateBank(bankValues) : createBank(bankValues);
    },
    [bank, updateBank, createBank]
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
