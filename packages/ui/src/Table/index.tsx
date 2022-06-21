import React from 'react';
import styled from '@emotion/styled';

const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;
  padding: 0;
  margin: 0;

  th {
    text-align: left;
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: ${({ theme }) => theme.colors.grey};

    padding: 20px 16px;

    &:first-child {
      border-bottom-left-radius: 4px;
      border-top-left-radius: 4px;
    }

    &:last-child {
      padding-right: 16px;

      border-bottom-right-radius: 4px;
      border-top-right-radius: 4px;
    }
  }

  td {
    font-size: 16px;
    font-weight: 400;
    line-height: 24px;
    color: ${({ theme }) => theme.colors.black};

    padding: 20px 16px;

    &:first-child {
      padding-left: 16px;
      border-bottom-left-radius: 4px;
      border-top-left-radius: 4px;
    }

    &:last-child {
      padding-right: 16px;
      border-bottom-right-radius: 4px;
      border-top-right-radius: 4px;
    }
  }
`;

type TableProps = {
  children: React.ReactNode;
};

const Table = ({ children }: TableProps) => {
  return <StyledTable>{children}</StyledTable>;
};

export default Table;
