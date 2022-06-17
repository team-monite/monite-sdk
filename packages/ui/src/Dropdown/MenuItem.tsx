import React from 'react';
import styled from 'styled-components';

import { Box, BoxProps } from '../Box';

const StyledItem = styled(Box)<DropdownMenuItemProps>`
  display: flex;
  align-items: center;
  padding: 12px 16px;
  white-space: nowrap;

  color: ${({ theme }) => theme.colors.black};

  font-size: 16px;
  font-weight: 400;
  line-height: 24px;

  ${({ noHover, theme }) =>
    noHover
      ? ''
      : `
    cursor: pointer;
    &:hover {
      background: ${theme.colors.lightGrey3};
    }
  `}

  > * + * {
    margin-left: 12px;
  }

  &:first-child {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  &:last-child {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

type DropdownMenuItemProps = {
  href?: string;
  noHover?: boolean;
  children: React.ReactNode;
  onClick?: (e: React.BaseSyntheticEvent) => void;
} & BoxProps;

const DropdownMenuItem = (props: DropdownMenuItemProps) => {
  const { children, onClick, ...attrs } = props;

  return (
    <StyledItem as="a" onClick={onClick || undefined} {...attrs}>
      {children}
    </StyledItem>
  );
};

export default DropdownMenuItem;
