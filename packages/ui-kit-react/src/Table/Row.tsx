import React from 'react';
import styled from '@emotion/styled';

import { ThemedStyledProps } from '../types';
import { IconButton, Dropdown } from '..';

import { UEllipsisV } from '../unicons';

type StyledTableRowProps = {
  $inactive?: boolean;
} & TableRowProps;

const inactive = ({
  $inactive,
  theme,
}: ThemedStyledProps<StyledTableRowProps>) => {
  if (!$inactive) {
    return '';
  }

  return `
    td {
      color: ${theme.colors.grey};
    }
    img {
      opacity: 50%;
    }
  `;
};
const StyledTableRow = styled.tr<StyledTableRowProps>`
  ${inactive}
  &:hover td {
    background: ${({ theme }) => theme.neutral90};
    ${({ onClick }) => (onClick ? 'cursor: pointer' : '')};
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

type TableRowProps = {
  children: React.ReactNode;
  inactive?: boolean;
  buttonActions?: () => React.ReactNode;
  dropdownActions?: () => React.ReactNode;
  onClick?: () => void;
};
// TODO handle buttonActions and delete component
const TableRow = ({
  children,
  inactive,
  dropdownActions,
  buttonActions,
  onClick,
}: TableRowProps) => {
  return (
    <StyledTableRow $inactive={inactive} onClick={onClick}>
      {children}
      {dropdownActions || buttonActions ? (
        <td>
          <ActionsMenu>
            {buttonActions && buttonActions()}
            {dropdownActions && (
              <Dropdown
                button={
                  <DropdownToggler color="lightGrey1">
                    <UEllipsisV width={20} height={20} />
                  </DropdownToggler>
                }
              >
                {dropdownActions()}{' '}
              </Dropdown>
            )}
          </ActionsMenu>
        </td>
      ) : null}
    </StyledTableRow>
  );
};

export default TableRow;
