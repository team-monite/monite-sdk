import React from 'react';
import styled from '@emotion/styled';

export const Table = styled.div<{
  children: React.ReactNode;
  clickableRow?: boolean;
}>`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  height: 100%;

  // for fixed header
  .rc-table,
  .rc-table-container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .rc-table-body {
    flex: 1 1 0;
  }
`;
