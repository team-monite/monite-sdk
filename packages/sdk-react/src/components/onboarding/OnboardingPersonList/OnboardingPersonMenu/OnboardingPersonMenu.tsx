import React from 'react';
import { ReactNode } from 'react';

import { useRootElements } from '@/core/context/RootElementsProvider';
import { Button, Menu } from '@mui/material';

export const OnboardingPersonMenu = ({
  title,
  children,
  disabled,
  variant,
}: {
  title: string;
  children: ReactNode;
  disabled?: boolean;
  variant?: 'outlined' | 'contained';
}) => {
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const opened = Boolean(anchorEl);

  const open = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const close = () => {
    setAnchorEl(null);
  };

  const { root } = useRootElements();

  return (
    <>
      <Button
        id="onboarding-person-menu-button"
        aria-controls={opened ? 'onboarding-person-menu' : undefined}
        aria-expanded={opened ? 'true' : undefined}
        aria-haspopup="true"
        onClick={open}
        variant={variant}
        color="primary"
        disabled={disabled}
      >
        {title}
      </Button>
      <Menu
        id="onboarding-person-menu"
        container={root}
        anchorEl={anchorEl}
        open={opened}
        onClose={close}
        onClick={close}
        MenuListProps={{
          'aria-labelledby': 'onboarding-person-menu-button',
        }}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        slotProps={{
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
              mt: 1.5,
              transform: 'translateX(-35%) !important',

              '&:before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0,
              },
            },
          },
        }}
      >
        {children}
      </Menu>
    </>
  );
};
