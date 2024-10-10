import {
  type MouseEvent,
  type KeyboardEvent,
  type SyntheticEvent,
  useId,
  useState,
} from 'react';

import { useRootElements } from '@/core/context/RootElementsProvider';
import { type ButtonProps, type MenuProps } from '@mui/material';

type MenuType = Pick<
  MenuProps,
  'open' | 'onClose' | 'onClick' | 'anchorEl' | 'id'
> & {
  container: Element | undefined;
};

type ButtonType = Pick<
  ButtonProps,
  | 'id'
  | 'aria-controls'
  | 'aria-expanded'
  | 'aria-haspopup'
  | 'onClick'
  | 'tabIndex'
  | 'onKeyDown'
>;

export const useMenuButton = () => {
  const { root } = useRootElements();

  const [anchorEl, setAnchorEl] = useState<{
    element: HTMLElement | null;
    open: boolean;
  }>({
    element: null,
    open: false,
  });

  // eslint-disable-next-line lingui/no-unlocalized-strings
  const buttonId = `Monite-Button-${useId()}`;

  // eslint-disable-next-line lingui/no-unlocalized-strings
  const menuId = `Monite-Menu-${useId()}`;

  const openMenu = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setAnchorEl({
      element: event.currentTarget,
      open: true,
    });
  };

  const closeMenu = (event?: SyntheticEvent | {}) => {
    if (event && 'preventDefault' in event) {
      event.preventDefault();
      event.stopPropagation();
    }

    setAnchorEl((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const createHandleKeyDown = (event: KeyboardEvent<HTMLElement>) => {
    if (event.defaultPrevented) return;

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      setAnchorEl({
        element: event.currentTarget,
        open: true,
      });
    }
  };

  const buttonProps: ButtonType = {
    id: buttonId,
    'aria-controls': anchorEl.open ? menuId : undefined,
    'aria-expanded': anchorEl.open ? 'true' : undefined,
    'aria-haspopup': 'menu' as const,
    tabIndex: 0, // Ensure span, div are focusable
    onClick: openMenu,
    onKeyDown: createHandleKeyDown,
  };

  const menuProps: MenuType = {
    id: menuId,
    anchorEl: anchorEl.element,
    open: anchorEl.open,
    container: root,
    onClose: closeMenu,
    onClick: closeMenu,
  };

  return {
    open: anchorEl.open,
    menuProps,
    buttonProps,
    closeMenu,
  };
};
