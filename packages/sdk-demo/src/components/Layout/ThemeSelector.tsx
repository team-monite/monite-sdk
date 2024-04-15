import React, { useRef, useState } from 'react';

import { useThemeContext } from '@/context/themeContext';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { useRootElements } from '@monite/sdk-react';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import LightModeIcon from '@mui/icons-material/LightMode';
import {
  Button,
  Typography,
  Menu,
  MenuItem,
  Divider,
  FormControlLabel,
  Switch,
} from '@mui/material';

const getButtonLabel = (themeIndex: string, i18n: I18n) => {
  switch (themeIndex) {
    case 'material':
      return t(i18n)`Material UI`;
    case 'monite':
      return t(i18n)`Monite`;
    default:
      return t(i18n)`Material UI`;
  }
};

export const ThemeSelector = () => {
  const { i18n } = useLingui();
  const { root } = useRootElements();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const { themeIndex, colorMode, setTheme, toggleColorMode } =
    useThemeContext();

  return (
    <>
      <Button
        ref={buttonRef}
        id="theme-selector"
        sx={{ justifyContent: 'space-between' }}
        aria-controls={isMenuOpen ? 'theme-menu' : undefined}
        startIcon={colorMode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
        endIcon={
          isMenuOpen ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />
        }
        aria-haspopup="true"
        aria-expanded={isMenuOpen ? 'true' : undefined}
        aria-label="theme-menu-button"
        variant="outlined"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
      >
        {getButtonLabel(themeIndex, i18n)}
        <Menu
          id="theme-selector"
          open={isMenuOpen}
          container={root}
          onClose={() => setIsMenuOpen(false)}
          anchorEl={buttonRef.current}
          MenuListProps={{
            'aria-labelledby': 'theme-selector',
          }}
        >
          <Typography variant="body2" color="grey" pl={2} pr={2} pb={1}>{t(
            i18n
          )`Theme`}</Typography>
          <MenuItem
            selected={themeIndex === 'material'}
            onClick={() => setTheme('material')}
          >
            {t(i18n)`Material UI`}
          </MenuItem>
          <MenuItem
            selected={themeIndex === 'monite'}
            onClick={() => setTheme('monite')}
          >
            {t(i18n)`Monite`}
          </MenuItem>
          <Divider />
          <MenuItem>
            <FormControlLabel
              control={
                <Switch color="primary" checked={colorMode === 'dark'} />
              }
              label={t(i18n)`Dark Mode`}
              sx={{ ml: 0 }}
              labelPlacement="start"
              onChange={() => toggleColorMode()}
            />
          </MenuItem>
        </Menu>
      </Button>
    </>
  );
};
