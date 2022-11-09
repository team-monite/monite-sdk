import { useCallback, useEffect, useMemo, useRef } from 'react';

import {
  useCounterpartById,
  useCounterpartBankById,
  useCreateCounterpartBank,
  useUpdateCounterpartBank,
} from 'core/queries/useCounterpart';

import { useComponentsContext } from 'core/context/ComponentsContext';
import { CounterpartBankAccount } from '@team-monite/sdk-api';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import getValidationSchema from './validation';
import { CounterpartBankFields, prepareCounterpartBank } from './mapper';

export type CounterpartBankFormProps = {
  counterpartId: string;
  bankId?: string;
  onCancel?: () => void;
  onCreate?: (id: string) => void;
  onUpdate?: (id: string) => void;
};

export default function useCounterpartBankForm({
  counterpartId,
  bankId,
  onCreate,
  onUpdate,
}: CounterpartBankFormProps) {
  const { t } = useComponentsContext();
  const formRef = useRef<HTMLFormElement>(null);

  const { data: counterpart } = useCounterpartById(counterpartId);
  const { data: bank } = useCounterpartBankById(counterpartId, bankId);

  const bankCreateMutation = useCreateCounterpartBank(counterpartId);
  const bankUpdateMutation = useUpdateCounterpartBank(counterpartId);

  const methods = useForm<CounterpartBankFields>({
    resolver: yupResolver(getValidationSchema(t)),
    defaultValues: useMemo(() => prepareCounterpartBank(bank), [bank]),
  });

  useEffect(() => {
    methods.reset(prepareCounterpartBank(bank));
  }, [methods, bank]);

  const submitForm = useCallback(() => {
    formRef.current?.dispatchEvent(
      new Event('submit', {
        bubbles: true,
      })
    );
  }, [formRef]);

  const createBank = useCallback(
    async (req: CounterpartBankAccount) => {
      return await bankCreateMutation.mutateAsync(req, {
        onSuccess: ({ id }) => {
          onCreate && onCreate(id);
        },
      });
    },
    [bankCreateMutation, onCreate]
  );

  const updateBank = useCallback(
    async (payload: CounterpartBankAccount) => {
      if (!bank) return;

      return await bankUpdateMutation.mutateAsync(
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
    [bankUpdateMutation, bank, onUpdate]
  );

  const saveBank = useCallback(
    (values: CounterpartBankFields) => {
      return !!bank ? updateBank(values) : createBank(values);
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
    isLoading: bankCreateMutation.isLoading || bankUpdateMutation.isLoading,
    error: bankCreateMutation.error || bankUpdateMutation.error,
  };
}
