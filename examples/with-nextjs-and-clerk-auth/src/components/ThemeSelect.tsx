import React from 'react';

import { useMenuButton } from '@monite/sdk-react';
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

import { useRootTheme } from '@/components/ThemeRegistry/RootThemeProvider';

export const ThemeSelect = () => {
  const { buttonProps, menuProps, open } = useMenuButton();
  const { setThemeMode, setThemeVariant, selectedTheme } = useRootTheme();

  const [themeVariant, themeMode] = selectedTheme;

  const buttonLabel = React.useMemo(() => {
    switch (themeVariant) {
      default:
      case 'material':
        return 'Material UI';
      case 'monite':
        return 'Monite';
    }
  }, [themeVariant]);

  return (
    <>
      <Button
        {...buttonProps}
        sx={{ justifyContent: 'space-between' }}
        startIcon={themeMode === 'dark' ? <DarkModeIcon /> : <LightModeIcon />}
        endIcon={open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
        variant="outlined"
      >
        {buttonLabel}
        <Menu {...menuProps}>
          <Typography variant="body2" color="grey" pl={2} pr={2} pb={1}>
            Theme
          </Typography>
          <MenuItem
            selected={themeVariant === 'material'}
            onClick={() => setThemeVariant('material')}
          >
            Material UI
          </MenuItem>
          <MenuItem
            selected={themeVariant === 'monite'}
            onClick={() => setThemeVariant('monite')}
          >
            Monite
          </MenuItem>
          <Divider />
          <MenuItem>
            <FormControlLabel
              onClick={(event) => {
                // prevent the menu from closing, since `onClick` is closing the menu
                event.stopPropagation();
              }}
              control={
                <Switch color="primary" checked={themeMode === 'dark'} />
              }
              label="Dark Mode"
              sx={{ ml: 0 }}
              labelPlacement="start"
              onChange={(_, checked) =>
                setThemeMode(checked ? 'dark' : 'light')
              }
            />
          </MenuItem>
        </Menu>
      </Button>
    </>
  );
};
