import { usePopper } from 'react-popper';
import { useState } from 'react';

type UseDropdownPopperProps = {
  offsetOptions?: {
    offset?: [number, number];
  };
};
const useDropdownPopper = ({ offsetOptions }: UseDropdownPopperProps = {}) => {
  const [shownDropdownMenu, toggleDropdownMenu] = useState(false);
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);

  const popper = usePopper(referenceElement, popperElement, {
    placement: 'bottom-start',
    modifiers: [
      {
        name: 'offset',
        enabled: true,
        options: {
          offset: [0, 10],
          ...(offsetOptions || {}),
        },
      },
    ],
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
