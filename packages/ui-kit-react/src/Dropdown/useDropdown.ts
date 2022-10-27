import { usePopper } from 'react-popper';
import React, { useCallback, useEffect, useState } from 'react';

export const useDropdown = () => {
  const [btnElement, setBtnElement] = React.useState<Element | null>(null);

  const [popperElement, setPopperElement] = React.useState<HTMLElement | null>(
    null
  );

  const handleClickOutside = (event: MouseEvent) => {
    if (
      btnElement &&
      !btnElement.contains(event.target as Node) &&
      popperElement &&
      !popperElement.contains(event.target as Node)
    ) {
      close();
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [btnElement, popperElement]);

  const [isOpen, setOpen] = useState<boolean>(false);

  const open = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setOpen(true);
  }, []);

  const close = useCallback((e?: React.MouseEvent<HTMLElement>) => {
    e?.stopPropagation();
    setOpen(false);
  }, []);

  const toggle = useCallback((e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setOpen((isOpen) => !isOpen);
  }, []);

  const popper = usePopper(btnElement, popperElement, {
    placement: 'bottom',
  });

  return {
    isOpen,
    open,
    close,
    toggle,
    popper,
    btnElement,
    setBtnElement,
    setPopperElement,
  };
};
