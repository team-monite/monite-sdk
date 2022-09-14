import React from 'react';
import styled from '@emotion/styled';

export const Table = styled.div<{
  children: React.ReactNode;
  clickableRow?: boolean;
}>`
  flex: 1 1 auto;
  font-family: 'Faktum', sans-serif;
  display: flex;
  flex-direction: column;

  * {
    box-sizing: border-box;
  }

  table th {
    padding: 12px;

    font-size: 16px;
    font-weight: 400;
    line-height: 24px;

    color: ${({ theme }) => theme.colors.grey};

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  table td {
    padding: 22px 12px;
    color: ${({ theme }) => theme.colors.black};
    vertical-align: top;

    white-space: nowrap;
  }

  // for fixed header
  .rc-table,
  .rc-table-container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .rc-table-body {
    flex: 1 1 0;

    ${({ theme, clickableRow }) =>
      clickableRow &&
      `
        tr:not(.rc-table-placeholder) {
          cursor: pointer;

          &:hover {
            background-color: ${theme.colors.lightGrey3};
          }
        }
      `}
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: center;
  gap: 12px;
  padding-top: 16px;
`;
