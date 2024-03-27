import { defaultMoniteLightThemeOptions } from '@monite/sdk-react';
import { ThemeOptions } from '@mui/material';
import { createTheme } from '@mui/material/styles';

export const themeOptions = defaultMoniteLightThemeOptions;

export const theme = createTheme(themeOptions as ThemeOptions);
