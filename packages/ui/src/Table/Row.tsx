import React from 'react';
import styled from '@emotion/styled';

import { ThemedStyledProps } from '../types';
import { IconButton, Dropdown, DropdownMenu, useDropdownPopper } from '..';

import { DotsVIcon } from '../Icons';

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
    background: ${({ theme }) => theme.colors.lightGrey3};
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
    color: ${({ theme }) => theme.colors.hoverAction};
  }
`;

type TableRowProps = {
  children: React.ReactNode;
  inactive?: boolean;
  buttonActions?: () => React.ReactNode;
  dropdownActions?: () => React.ReactNode;
  onClick?: () => void;
};

const TableRow = ({
  children,
  inactive,
  dropdownActions,
  buttonActions,
  onClick,
}: TableRowProps) => {
  const {
    shownDropdownMenu,
    toggleDropdownMenu,
    setReferenceElement,
    setPopperElement,
    popper,
  } = useDropdownPopper();

  return (
    <StyledTableRow $inactive={inactive} onClick={onClick}>
      {children}
      {dropdownActions || buttonActions ? (
        <td>
          <ActionsMenu>
            {buttonActions && buttonActions()}
            {dropdownActions && (
              <Dropdown
                onClickOutside={() => {
                  toggleDropdownMenu(false);
                }}
              >
                <DropdownToggler
                  color="lightGrey1"
                  onClick={(e: React.BaseSyntheticEvent) => {
                    e.stopPropagation();
                    toggleDropdownMenu((shown) => !shown);
                  }}
                  ref={setReferenceElement}
                >
                  <DotsVIcon width={20} height={20} />
                </DropdownToggler>
                {shownDropdownMenu ? (
                  <DropdownMenu
                    innerRef={setPopperElement}
                    style={popper.styles.popper}
                    onClick={(e: React.BaseSyntheticEvent) => {
                      e.stopPropagation();
                      toggleDropdownMenu(false);
                    }}
                    {...popper.attributes.popper}
                  >
                    {dropdownActions()}
                  </DropdownMenu>
                ) : null}
              </Dropdown>
            )}
          </ActionsMenu>
        </td>
      ) : null}
    </StyledTableRow>
  );
};

export default TableRow;
