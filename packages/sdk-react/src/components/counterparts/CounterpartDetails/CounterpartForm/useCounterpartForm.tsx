import { useCallback, useRef } from 'react';

import { components } from '@/api';
import type {
  CounterpartDefaultValues,
  CounterpartShowCategories,
} from '@/components/counterparts/Counterpart.types';
import {
  useCounterpartById,
  useCreateCounterpart,
  useUpdateCounterpart,
} from '@/core/queries/useCounterpart';

export type CounterpartsFormProps = {
  /**
   * If `id` provided, then counterparts form works in `update` mode.
   * If `id` is NOT provided, then counterparts form works in `create` mode
   */
  id?: string;
  onCancel?: () => void;
  onCreate?: (id: string) => void;
  onUpdate?: (id: string) => void;
  /**
   * Default values for the form fields
   */
  defaultValues?: CounterpartDefaultValues;
} & CounterpartShowCategories;

export function useCounterpartForm({
  id,
  onCreate,
  onUpdate,
}: CounterpartsFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const { data: counterpart, isLoading } = useCounterpartById(id);
  const counterpartCreateMutation = useCreateCounterpart();
  const counterpartUpdateMutation = useUpdateCounterpart();

  const submitForm = useCallback(() => {
    formRef.current?.dispatchEvent(
      new Event('submit', {
        bubbles: true,
      })
    );
  }, [formRef]);

  const createCounterpart = useCallback(
    (req: components['schemas']['CounterpartCreatePayload']) => {
      counterpartCreateMutation.mutate(req, {
        onSuccess: ({ id }) => {
          onCreate && onCreate(id);
        },
      });
    },
    [counterpartCreateMutation, onCreate]
  );

  const updateCounterpart = useCallback(
    (payload: components['schemas']['CounterpartUpdatePayload']) => {
      if (!counterpart) return;

      const counterpartUpdateMutate = counterpartUpdateMutation.mutate;
      counterpartUpdateMutate(
        {
          path: { counterpart_id: counterpart.id },
          body: payload,
        },
        {
          onSuccess: ({ id }) => {
            onUpdate && onUpdate(id);
          },
        }
      );
    },
    [counterpart, counterpartUpdateMutation.mutate, onUpdate]
  );

  return {
    createCounterpart,
    updateCounterpart,
    counterpart,
    formRef,
    submitForm,
    isLoading:
      counterpartCreateMutation.isPending ||
      counterpartUpdateMutation.isPending ||
      isLoading,
    error: counterpartCreateMutation.error || counterpartUpdateMutation.error,
  };
}
