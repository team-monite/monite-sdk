import { useCallback, useState } from 'react';

export function useModal<T>() {
  const [isOpen, setOpen] = useState(false);
  const [entity, setEntity] = useState<T | undefined>();

  const show = useCallback((entity: T) => {
    setEntity(entity);
    setOpen(true);
  }, []);

  const hide = useCallback(() => {
    setEntity(undefined);
    setOpen(false);
  }, []);

  return {
    entity,
    show,
    hide,
    isOpen,
  };
}
