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

  const variants: Record<ThemeConfig['variant'], string> = {
    material: t(i18n)`Material UI`,
    monite: t(i18n)`Monite`,
  };

  return (
    <>
      <Button
        component="button"
        className="ThemeSelect"
        ref={menuButton}
        variant="outlined"
        onClick={(event) => {
          event.preventDefault();
          setOpen(!open);
        }}
        sx={{ width: '100%', borderColor: 'neutral.80' }}
      >
        <Box
          component="span"
          display="flex"
          flexDirection="row"
          alignItems="center"
          flex="1"
          gap={1.5}
        >
          <Box component="span" display="flex" color="neutral.10">
            {mode === 'dark' ? <IconMoon /> : <IconSun />}
          </Box>
          <Box component="span" display="flex" flexDirection="column" flex="1">
            <Typography variant="body2" component="span" textAlign="left">
              {themeName}
            </Typography>
            <Typography
              className="ThemeSelect-modeLabel"
              hidden
              variant="label3"
              component="span"
              textAlign="left"
            >
              {modeName}
            </Typography>
          </Box>
          <Box component="span" display="flex" color="neutral.10">
            {open ? <IconAngleUp /> : <IconAngleDown />}
          </Box>
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
          {Object.entries(variants).map(([variantName, label]) => (
            <ThemeSelectMenuItem
              key={variantName}
              checked={variant === variantName}
              onClick={(event) => {
                event.preventDefault();
                handleVariantChange({
                  variant: variantName as ThemeConfig['variant'],
                  mode,
                });
              }}
            >
              <Typography variant="body1">{label}</Typography>
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
