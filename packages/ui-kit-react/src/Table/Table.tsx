import React, { ReactNode, useEffect, useRef } from 'react';
import { default as RCTable } from 'rc-table';
import { TableProps as RCTableProps } from 'rc-table/lib/Table';
import styled from '@emotion/styled';

import { UEllipsisV } from '../unicons';
import {
  Dropdown,
  DropdownMenu,
  IconButton,
  Spinner,
  Text,
  useDropdownPopper,
} from '../index';

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

    padding: 20px 16px;

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
    text-overflow: ellipsis;
    white-space: nowrap;

    font-family: ${({ theme }) => theme.tableBody.fontFamily};
    font-size: ${({ theme }) => theme.tableBody.fontSize};
    font-weight: ${({ theme }) => theme.tableBody.fontWeight};
    line-height: 24px;
    color: ${({ theme }) => theme.tableBody.textColor};

    padding: 20px 16px;

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

const Popper = styled.div`
  z-index: 10;
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
  const {
    shownDropdownMenu,
    toggleDropdownMenu,
    setReferenceElement,
    setPopperElement,
    popper,
  } = useDropdownPopper();

  const referenceRef = useRef(null);
  const popperRef = useRef(null);

  useEffect(() => {
    setReferenceElement(referenceRef);
    setPopperElement(popperRef);
  }, [referenceRef, popperRef]);

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
                  render: (value, row, index) => {
                    // TODO move to separate component
                    return (
                      <>
                        <div ref={referenceRef}>
                          <ActionsMenu>
                            <Dropdown
                              onClickOutside={() => {
                                toggleDropdownMenu(false);
                              }}
                            >
                              <DropdownToggler
                                color="lightGrey1"
                                onClick={(e: React.BaseSyntheticEvent) => {
                                  e.stopPropagation();
                                  toggleDropdownMenu((shown) =>
                                    !shown ? index : false
                                  );
                                  // @ts-ignore
                                  popper.update();
                                }}
                              >
                                <UEllipsisV width={20} height={20} />
                              </DropdownToggler>
                              <Popper
                                ref={popperRef}
                                style={popper.styles.popper}
                                {...popper.attributes.popper}
                              >
                                {shownDropdownMenu === index && (
                                  <DropdownMenu
                                    style={popper.styles.offset}
                                    onClick={(e: React.BaseSyntheticEvent) => {
                                      e.stopPropagation();
                                      toggleDropdownMenu(false);
                                    }}
                                  >
                                    {renderDropdownActions(value)}
                                  </DropdownMenu>
                                )}
                              </Popper>
                            </Dropdown>
                          </ActionsMenu>
                        </div>
                      </>
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
