import React from 'react';
import styled from '@emotion/styled';

export const Table = styled.div`
  font-family: 'Faktum', sans-serif;

  * {
    box-sizing: border-box;
  }

  table th {
    padding: 12px;

    font-size: 14px;
    font-weight: 500;
    line-height: 20px;

    color: ${({ theme }) => theme.colors.grey};
  }

  table td {
    padding: 10px 12px;
    color: ${({ theme }) => theme.colors.black};
    vertical-align: top;
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
