import React from 'react';
import styled from '@emotion/styled';

import { Box, BoxProps } from '../Box';

const Wrapper = styled(Box)<DropdownDividerProps>`
  margin: 8px 0;
  padding: 0;
  white-space: nowrap;
  height: 1px;
  border-top: 1px solid ${({ theme }) => theme.neutral80};
  overflow: hidden;
`;

type DropdownDividerProps = {} & BoxProps;

const DropdownDivider = (props: DropdownDividerProps) => {
  const { children, onClick, ...attrs } = props;

  return <Wrapper as="div" {...attrs} />;
};

export default DropdownDivider;
