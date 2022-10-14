import { useCallback, useState } from 'react';

export function useModal() {
  const [isOpen, setOpen] = useState(false);

  const show = useCallback(() => {
    setOpen(true);
  }, []);

  const hide = useCallback(() => {
    setOpen(false);
  }, []);

  return {
    show,
    hide,
    isOpen,
  };
}
