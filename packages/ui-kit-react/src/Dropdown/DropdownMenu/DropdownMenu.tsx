import React, { forwardRef } from 'react';
import styled from '@emotion/styled';
import { Box } from 'rebass';
import { BoxProps } from 'Box';

const StyledMenu = styled(Box)`
  border-radius: 8px;
  min-width: 200px;
  background-color: ${({ theme }) => theme.white};
  box-shadow: rgb(17 17 17 / 12%) 0 4px 8px 0;
`;

type DropdownMenuProps = {
  style?: React.CSSProperties;
  children: React.ReactNode;
  onClick?: (e: React.BaseSyntheticEvent) => void;
} & BoxProps;

const DropdownMenu = forwardRef<HTMLElement, DropdownMenuProps>(
  ({ style, children, ...other }, ref) => {
    return (
      <StyledMenu ref={ref} style={style} {...other}>
        {children}
      </StyledMenu>
    );
  }
);

export default DropdownMenu;
