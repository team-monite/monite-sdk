import { useCallback, useRef, useState } from 'react';
import { usePayableById } from 'core/queries/usePayable';

export type UseCounterpartDetailsProps = {
  id: string;
};

export default function useCounterpartDetails({
  id,
}: UseCounterpartDetailsProps) {
  const { data: payable, error, isLoading } = usePayableById(id);
  const formRef = useRef<HTMLFormElement>(null);
  const [isEdit] = useState<boolean>(false);

  const saveCounterpart = useCallback(() => {
    formRef.current?.dispatchEvent(
      new Event('submit', {
        bubbles: true,
      })
    );
  }, [formRef]);

  return {
    payable,
    formRef,
    isLoading,
    error,
    isEdit,
    actions: {
      saveCounterpart,
    },
  };
}
