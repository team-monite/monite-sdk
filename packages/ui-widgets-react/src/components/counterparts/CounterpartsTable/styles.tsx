import styled from '@emotion/styled';

import { THEMES } from '@monite/ui-kit-react';

export const Table = styled.div<{
  children: React.ReactNode;
  theme: typeof THEMES.default;
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

export const OldTable = styled.div`
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
