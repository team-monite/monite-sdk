import React from 'react';

import styled from '@emotion/styled';

import { Box, BoxProps } from '../Box';
import { DropdownMenu } from './DropdownMenu';
import { useDropdown } from './useDropdown';
import { createPortal } from 'react-dom';

type DropdownProps = {
  button: React.ReactNode;
  children: React.ReactNode;
} & BoxProps;

const StyledDropdown = styled(Box)`
  display: inline-flex;
`;

const Dropdown = ({ button, children, onClick, ...props }: DropdownProps) => {
  const {
    popper: { styles, attributes },
    isOpen,
    toggle,
    close,
    setPopperElement,
    setBtnElement,
  } = useDropdown();

  return (
    <StyledDropdown {...props}>
      <Box ref={setBtnElement} onClick={toggle}>
        {button}
      </Box>
      {isOpen &&
        createPortal(
          <Box
            ref={setPopperElement}
            style={styles.popper}
            onClick={close}
            {...attributes.popper}
          >
            <DropdownMenu style={styles.offset}>{children}</DropdownMenu>
          </Box>,
          document.body
        )}
    </StyledDropdown>
  );
};

export default Dropdown;
