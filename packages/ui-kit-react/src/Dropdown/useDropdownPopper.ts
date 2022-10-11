import { usePopper } from 'react-popper';
import { useState } from 'react';

const useDropdownPopper = () => {
  const [shownDropdownMenu, toggleDropdownMenu] = useState<number | boolean>(
    false
  );
  const [referenceElement, setReferenceElement] = useState<any>(null);
  const [popperElement, setPopperElement] = useState<any>(null);

  const popper = usePopper(referenceElement?.current, popperElement?.current, {
    placement: 'bottom-end',
  });

  return {
    shownDropdownMenu,
    toggleDropdownMenu,
    setReferenceElement,
    setPopperElement,
    popper,
  };
};

export default useDropdownPopper;
