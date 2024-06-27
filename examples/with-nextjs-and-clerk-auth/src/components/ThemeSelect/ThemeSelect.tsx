import React, { useRef, useState } from 'react';

import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  Box,
  Button,
  Divider,
  ListSubheader,
  Menu,
  MenuList,
  Switch,
  Typography,
} from '@mui/material';
import { ThemeConfig } from '@team-monite/sdk-demo/src/types';

import { ThemeSelectMenuItem } from '@/components/ThemeSelect/ThemeSelectMenuItem';
import { useThemeSelect } from '@/components/ThemeSelect/useThemeSelect';
import { IconAngleDown, IconAngleUp, IconMoon, IconSun } from '@/icons';

interface ThemeSelectorProps {
  selectedTheme: ThemeConfig;
  onThemeChange: (themeConfig: ThemeConfig) => void;
}

const variants: ThemeConfig['variant'][] = ['material', 'monite'];

export const ThemeSelect = (props: ThemeSelectorProps) => {
  const {
    onThemeChange,
    selectedTheme: { variant, mode },
  } = props;

  const menuButton = useRef<HTMLButtonElement | null>(null);

  const { i18n } = useLingui();
  const { modeName, themeName } = useThemeSelect(props);

  const [open, setOpen] = useState(false);

  const handleVariantChange = (selectedTheme: ThemeConfig) => {
    onThemeChange(selectedTheme);
  };

  return (
    <>
      <Button
        className="theme-selector"
        component="button"
        startIcon={mode === 'dark' ? <IconMoon /> : <IconSun />}
        endIcon={open ? <IconAngleUp /> : <IconAngleDown />}
        ref={menuButton}
        variant="outlined"
        onClick={(event) => {
          event.preventDefault();
          setOpen(!open);
        }}
      >
        <Box component="span" display="flex" flexDirection="column" flex="1">
          <Typography variant="body2" component="span" textAlign="left">
            {themeName}
          </Typography>
          <Typography variant="label3" component="span" textAlign="left">
            {modeName}
          </Typography>
        </Box>
      </Button>
      <Menu
        anchorEl={menuButton.current}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        onClose={() => setOpen(false)}
        open={open}
      >
        <MenuList>
          <ListSubheader>
            <Typography variant="label2">{t(i18n)`Theme`}</Typography>
          </ListSubheader>
          {variants.map((variantName) => (
            <ThemeSelectMenuItem
              key={variantName}
              checked={variant === variantName}
              onClick={(event) => {
                event.preventDefault();
                handleVariantChange({ variant: variantName, mode });
              }}
            >
              <Typography variant="body1">{t(i18n)`${variantName}`}</Typography>
            </ThemeSelectMenuItem>
          ))}
          <Divider />
          <ListSubheader>
            <Typography variant="label2">{t(i18n)`Language`}</Typography>
          </ListSubheader>
          <ThemeSelectMenuItem checked>
            <Typography variant="body1">{t(i18n)`English`}</Typography>
          </ThemeSelectMenuItem>
          <Divider />
          <ThemeSelectMenuItem
            onClick={(event) => {
              event.preventDefault();
              handleVariantChange({
                variant,
                mode: mode === 'light' ? 'dark' : 'light',
              });
            }}
            accessory={<Switch checked={mode === 'dark'} />}
          >
            <Typography variant="body1">{t(i18n)`Dark Mode`}</Typography>
          </ThemeSelectMenuItem>
        </MenuList>
      </Menu>
    </>
  );
};
