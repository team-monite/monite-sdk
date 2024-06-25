import React, { FC, useState } from 'react';

import {
  UilSun,
  UilMoon,
  UilAngleUp,
  UilAngleDown,
} from '@iconscout/react-unicons';
import { Box, Button, Typography } from '@mui/material';
import { ThemeConfig } from '@team-monite/sdk-demo/src/types';

import { useThemeSelect } from '@/components/ThemeSelect/useThemeSelect';

interface ThemeSelectorProps {
  selectedTheme: ThemeConfig;
  onThemeChange: (themeConfig: ThemeConfig) => void;
}

export const ThemeSelect: FC<ThemeSelectorProps> = (props) => {
  const {
    selectedTheme: { mode },
  } = props;

  const { modeName, themeName } = useThemeSelect(props);

  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        className="theme-selector"
        startIcon={mode === 'dark' ? <UilMoon /> : <UilSun />}
        endIcon={open ? <UilAngleUp /> : <UilAngleDown />}
        variant="outlined"
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
    </>
  );
};
