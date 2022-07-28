import React, { FC, ReactNode } from 'react';

import styled from '@emotion/styled';

import { Box, BoxProps } from '../Box';
import { UMultiply } from '../unicons';
import IconButton from '../IconButton';

export interface HeaderProps extends BoxProps {
  children: ReactNode;
  actions?: ReactNode;
  onClose?: () => void;
  closeBtnPosition?: 'left' | 'right';
}

interface StyledHeaderProps extends BoxProps {
  $hasCloseBtn: boolean;
  $closeBtnPosition: HeaderProps['closeBtnPosition'];
}

const StyledHeader = styled(Box)<StyledHeaderProps>`
  display: flex;
  align-items: center;
  width: 100%;
  height: 96px;
  background-color: white;
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

interface CloseButtonProps {
  onClick?: () => void;
}

const CloseButton: FC<CloseButtonProps> = ({ onClick }) => (
  <IconButton onClick={onClick} color={'black'}>
    <UMultiply size={18} />
  </IconButton>
);

const Header: FC<HeaderProps> = ({
  children,
  actions,
  closeBtnPosition = 'left',
  onClose,
}) => {
  return (
    <StyledHeader $closeBtnPosition={closeBtnPosition} $hasCloseBtn={!!onClose}>
      {onClose && closeBtnPosition === 'left' && (
        <CloseButton onClick={onClose} />
      )}

      <StyledContent>{children}</StyledContent>

      {actions && <StyledActions>{actions}</StyledActions>}

      {onClose && closeBtnPosition === 'right' && (
        <CloseButton onClick={onClose} />
      )}
    </StyledHeader>
  );
};

export default Header;
