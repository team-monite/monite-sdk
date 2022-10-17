import React, { FC, ReactNode } from 'react';

import styled from '@emotion/styled';

import { Box, BoxProps } from '../Box';

export interface HeaderProps extends BoxProps {
  children?: ReactNode;
  leftBtn?: ReactNode;
  rightBtn?: ReactNode;
  actions?: ReactNode;
}

const StyledHeader = styled(Box)`
  display: flex;
  align-items: center;
  width: 100%;
  height: 96px;
  background-color: ${({ theme }) => theme.header.backgroundColor};
  padding: 0 24px;
  gap: 24px;
`;

const StyledContent = styled.div`
  display: flex;
  flex-grow: 1;
`;

const StyledActions = styled.div`
  display: flex;
`;

const Header: FC<HeaderProps> = ({ children, actions, leftBtn, rightBtn }) => {
  return (
    <StyledHeader>
      {leftBtn}
      <StyledContent>{children}</StyledContent>
      {actions && <StyledActions>{actions}</StyledActions>}
      {rightBtn}
    </StyledHeader>
  );
};

export default Header;
