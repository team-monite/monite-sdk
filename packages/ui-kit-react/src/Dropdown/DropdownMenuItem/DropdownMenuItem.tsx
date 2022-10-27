import React from 'react';
import styled from '@emotion/styled';

import { Flex, BoxProps } from 'Box';

const StyledItem = styled(Flex)`
  align-items: center;
  padding: 12px 16px;
  white-space: nowrap;
  cursor: pointer;
  font-size: 16px;
  font-weight: 400;
  line-height: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.neutral80};
  color: ${({ theme }) => theme.black};

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

const DropdownMenuItem = ({ children, ...props }: BoxProps) => {
  return <StyledItem {...props}>{children}</StyledItem>;
};

export default DropdownMenuItem;
