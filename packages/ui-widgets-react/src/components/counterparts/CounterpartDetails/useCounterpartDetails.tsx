import { useCallback, useEffect, useRef, useState } from 'react';
import {
  useCreateCounterpart,
  useUpdateCounterpart,
  useCounterpartById,
} from 'core/queries/useCounterpart';
import {
  CounterpartCreatePayload,
  CounterpartType,
  CounterpartUpdatePayload,
} from '@monite/sdk-api';

export type UseCounterpartDetailsProps = {
  id?: string;
  type?: CounterpartType;
};

export enum COUNTERPART_VIEW {
  'readonly' = 'readonly',
  'organizationForm' = 'organizationForm',
  'individualForm' = 'individualForm',
  'contactForm' = 'contactForm',
  'bankAccountForm' = 'bankAccountForm',
}

export default function useCounterpartDetails({
  id,
  type,
}: UseCounterpartDetailsProps) {
  const formRef = useRef<HTMLFormElement>(null);

  const [counterpartView, setCounterpartView] =
    useState<COUNTERPART_VIEW | null>(null);

  const [counterpartId, setCounterpartId] = useState<string | undefined>(id);

  const { data: counterpart } = useCounterpartById(counterpartId);

  useEffect(() => {
    console.log(counterpart);
  }, [counterpart]);

  useEffect(() => {
    if (id) {
      return setCounterpartView(COUNTERPART_VIEW.readonly);
    }

    if (type === CounterpartType.INDIVIDUAL) {
      return setCounterpartView(COUNTERPART_VIEW.individualForm);
    }

    if (type === CounterpartType.ORGANIZATION) {
      return setCounterpartView(COUNTERPART_VIEW.organizationForm);
    }
  }, [id, type]);

  const submitForm = useCallback(() => {
    formRef.current?.dispatchEvent(
      new Event('submit', {
        bubbles: true,
      })
    );
  }, [formRef]);

  const counterpartCreateMutation = useCreateCounterpart();
  const counterpartUpdateMutation = useUpdateCounterpart(
    counterpartId ?? '123'
  );

  const createCounterpart = useCallback(
    async (req: CounterpartCreatePayload) => {
      const { id } = await counterpartCreateMutation.mutateAsync(req);
      setCounterpartId(id);
      setCounterpartView(COUNTERPART_VIEW.readonly);
    },
    [counterpartCreateMutation]
  );

  const updateCounterpart = useCallback(
    (req: CounterpartUpdatePayload) => {
      return counterpartUpdateMutation.mutateAsync(req);
    },
    [counterpartCreateMutation]
  );

  return {
    counterpart,
    counterpartView,
    formRef,
    submitForm,
    counterpartCreateMutation,
    createCounterpart,
    updateCounterpart,
  };
}
