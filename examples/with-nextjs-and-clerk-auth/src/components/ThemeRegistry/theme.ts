import { createTheme } from '@mui/material/styles';
import { moniteLight } from '@team-monite/sdk-themes';

export const themeOptions = moniteLight;

export const theme = createTheme(themeOptions);
