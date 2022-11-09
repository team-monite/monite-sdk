import React from 'react';
import styled from '@emotion/styled';

export const Table = styled.div<{
  children: React.ReactNode;
  clickableRow?: boolean;
}>`
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;

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

export const ColName = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  color: #202d4c;

  > * + * {
    margin-left: 16px;
  }
`;

export const AddressText = styled.div`
  font-size: 14px;
  font-weight: 400;
  line-height: 24px;
`;

export const ColContacts = styled.div`
  color: #202d4c;

  font-size: 14px;
  font-weight: 400;
  line-height: 24px;

  > div {
    display: flex;
    align-items: center;

    svg {
      margin-right: 8px;
    }
  }
`;

export const ColType = styled.div`
  display: flex;
  flex-direction: row;
  gap: 8px;
  flex-wrap: wrap;
`;
