import React, { useRef } from 'react';
import { useClickAway } from 'react-use';
import styled from 'styled-components';

const Wrapper = styled.div`
  position: relative;
  display: flex;
`;

type DropdownProps = {
  children: React.ReactNode;
  onClickOutside?: () => void;
};

const Dropdown = (props: DropdownProps) => {
  const { children, onClickOutside } = props;

  const ref = useRef<HTMLDivElement | null>(null);

  useClickAway(ref, () => {
    if (onClickOutside) {
      onClickOutside();
    }
  });

  return <Wrapper ref={ref}>{children}</Wrapper>;
};

export default Dropdown;
