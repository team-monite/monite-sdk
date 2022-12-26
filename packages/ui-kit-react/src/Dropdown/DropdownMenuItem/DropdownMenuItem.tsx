import React, { MouseEvent } from 'react';
import styled from '@emotion/styled';

import { Flex, BoxProps } from 'Box';

const StyledItem = styled(Flex)<{ $disabled?: boolean }>`
  align-items: center;
  padding: 12px 16px;
  white-space: nowrap;
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.neutral80};
  color: ${({ theme }) => theme.black};

  ${({ theme, $disabled }) =>
    $disabled &&
    `
    cursor: not-allowed;
    color: ${theme.neutral50};
    background-color: ${theme.neutral90};
  `}

  &:hover {
    background: ${({ theme }) => theme.neutral90};
  }

  &:last-child {
    border-bottom: none;
  }

  &:first-of-type {
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;
  }

  &:last-of-type {
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
  }
`;

const DropdownMenuItem = ({
  children,
  disabled,
  onClick,
  ...props
}: BoxProps) => {
  const handleOnClick = (e: MouseEvent<HTMLDivElement>) => {
    if (disabled) {
      e.preventDefault();
      e.stopPropagation();
    } else {
      onClick && onClick(e);
    }
  };

  return (
    <StyledItem
      {...props}
      $disabled={disabled}
      onClick={(e: MouseEvent<HTMLDivElement>) => handleOnClick(e)}
    >
      {children}
    </StyledItem>
  );
};

export default DropdownMenuItem;
