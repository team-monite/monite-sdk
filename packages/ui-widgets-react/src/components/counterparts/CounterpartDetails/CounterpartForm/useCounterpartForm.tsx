import { useCallback, useRef } from 'react';
import {
  useCreateCounterpart,
  useUpdateCounterpart,
  useCounterpartById,
} from 'core/queries/useCounterpart';

import {
  CounterpartCreatePayload,
  CounterpartUpdatePayload,
} from '@monite/sdk-api';

export type CounterpartsFormProps = {
  id?: string;
  onClose?: () => void;
  onCancel?: () => void;
  onCreate?: (id: string) => void;
  onUpdate?: (id: string) => void;
};

export default function useCounterpartForm({
  id,
  onCreate,
  onUpdate,
}: CounterpartsFormProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const { data: counterpart } = useCounterpartById(id);
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
    async (req: CounterpartCreatePayload) => {
      await counterpartCreateMutation.mutateAsync(req, {
        onSuccess: ({ id }) => {
          onCreate && onCreate(id);
        },
      });
    },
    [counterpartCreateMutation, onCreate]
  );

  const updateCounterpart = useCallback(
    (req: CounterpartUpdatePayload) => {
      if (!counterpart) return;

      counterpartUpdateMutation.mutate(
        {
          id: counterpart.id,
          counterpart: req,
        },
        {
          onSuccess: ({ id }) => {
            onUpdate && onUpdate(id);
          },
        }
      );
    },
    [counterpartCreateMutation, onUpdate]
  );

  return {
    createCounterpart,
    updateCounterpart,
    counterpart,
    formRef,
    submitForm,
    isLoading:
      counterpartCreateMutation.isLoading ||
      counterpartUpdateMutation.isLoading,
    error: counterpartCreateMutation.error || counterpartUpdateMutation.error,
  };
}
