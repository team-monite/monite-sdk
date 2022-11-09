import React, { ReactNode } from 'react';
import { default as RCTable } from 'rc-table';
import { TableProps as RCTableProps } from 'rc-table/lib/Table';
import styled from '@emotion/styled';

import { UEllipsisV } from '../unicons';
import { IconButton, Spinner, Text, Dropdown } from '../';

const TableWrapper = styled.div`
  position: relative;
  height: 100%;
`;

const SpinnerWrapper = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  background-color: rgba(255, 255, 255, 0.8);
  z-index: 10;
`;

const StyledTable = styled(RCTable)`
  height: 100%;

  .rc-table,
  .rc-table-content,
  .rc-table-container {
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .rc-table-body {
    flex: 1 1 0;
  }

  table {
    border-collapse: collapse;
    width: 100%;
    height: 100%;
    padding: 0;
    margin: 0;
  }

  th {
    text-align: left;
    font-family: ${({ theme }) => theme.tableHeader.fontFamily};
    font-size: ${({ theme }) => theme.tableHeader.fontSize};
    font-weight: ${({ theme }) => theme.tableHeader.fontWeight};
    line-height: 24px;
    color: ${({ theme }) => theme.tableHeader.textColor};

    padding: 12px;

    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    &:first-of-type {
      border-bottom-left-radius: 4px;
      border-top-left-radius: 4px;
    }

    &:last-of-type {
      padding-right: 16px;

      border-bottom-right-radius: 4px;
      border-top-right-radius: 4px;
    }
  }

  td {
    vertical-align: top;
    text-overflow: ellipsis;
    white-space: nowrap;

    font-family: ${({ theme }) => theme.tableBody.fontFamily};
    font-size: ${({ theme }) => theme.tableBody.fontSize};
    font-weight: ${({ theme }) => theme.tableBody.fontWeight};
    line-height: 24px;
    color: ${({ theme }) => theme.tableBody.textColor};

    padding: 22px 12px;

    &:first-of-type {
      padding-left: 16px;
      border-bottom-left-radius: 4px;
      border-top-left-radius: 4px;
    }

    &:last-of-type {
      padding-right: 16px;
      border-bottom-right-radius: 4px;
      border-top-right-radius: 4px;
    }
  }

  .rc-table-body {
    ${({ theme, onRow }) =>
      onRow &&
      `
        tr:not(.rc-table-placeholder) {
          cursor: pointer;

          &:hover {
            background-color: ${theme.tableBody.backgroundColorHover};
          }

          &:active {
            background-color: ${theme.tableBody.backgroundColorActive};
          }
        }
      `}
  }
`;

const ActionsMenu = styled.div`
  white-space: nowrap;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;

  > * + * {
    margin-left: 24px;
  }
`;

const DropdownToggler = styled(IconButton)`
  height: 32px;
  width: 32px;

  &:hover {
    color: ${({ theme }) => theme.black};
  }
`;

const NoData = styled(Text)`
  text-align: center;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

interface TableProps extends RCTableProps {
  loading?: boolean;
  renderDropdownActions?: (value: any) => ReactNode;
}

export const Table = ({
  renderDropdownActions,
  columns,
  loading,
  ...restProps
}: TableProps) => {
  return (
    <TableWrapper>
      {loading && (
        <SpinnerWrapper>
          <Spinner pxSize={30} />
        </SpinnerWrapper>
      )}
      <StyledTable
        rowKey={(record, index) => `${record}${index}`}
        // @ts-ignore
        columns={
          columns && renderDropdownActions
            ? [
                ...columns,
                renderDropdownActions && {
                  title: '',
                  dataIndex: '',
                  key: 'operations',
                  render: (value) => {
                    return (
                      <ActionsMenu>
                        <Dropdown
                          button={
                            <DropdownToggler color="lightGrey1">
                              <UEllipsisV width={20} height={20} />
                            </DropdownToggler>
                          }
                        >
                          {renderDropdownActions(value)}
                        </Dropdown>
                      </ActionsMenu>
                    );
                  },
                },
              ]
            : columns
        }
        emptyText={<NoData textSize="h2">No Data</NoData>}
        {...restProps}
      />
    </TableWrapper>
  );
};
