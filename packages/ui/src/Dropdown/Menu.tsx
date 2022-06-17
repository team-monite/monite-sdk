import React from 'react';
import styled from 'styled-components';

const StyledMenu = styled.div`
  border-radius: 8px;
  background-color: #ffffff;
  min-width: 200px;

  box-shadow: 0px 4px 8px 0px #1111111f;

  z-index: 960;
`;

type DropdownMenuProps = {
  innerRef?: React.Ref<HTMLDivElement>;
  style?: React.CSSProperties;
  children: React.ReactNode;
  className?: string;
  onClick?: (e: React.BaseSyntheticEvent) => void;
};

const DropdownMenu = (props: DropdownMenuProps) => {
  const { innerRef, style, children, ...attrs } = props;

  return (
    <StyledMenu ref={innerRef} style={style} {...attrs}>
      {children}
    </StyledMenu>
  );
};

export default DropdownMenu;
