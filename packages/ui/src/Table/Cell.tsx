import React, { ReactNode } from 'react';
import styled from '@emotion/styled';
import { Box } from '../Box';

const StyledCell = styled(Box)`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

interface Props {
  children: ReactNode;
  forHeader?: boolean;
}

const Cell = ({ forHeader, children }: Props) => {
  return <StyledCell as={forHeader ? 'th' : 'td'}>{children}</StyledCell>;
};

export default Cell;
