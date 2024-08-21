import '@monite/sdk-react/mui-styles.d.ts';
import { createTheme } from '@mui/material';
import {
  moniteDark as baseMoniteDark,
  moniteLight as baseMoniteLight,
} from '@team-monite/sdk-themes';

export const moniteLight = () => createTheme(baseMoniteLight);

export const moniteDark = () => createTheme(baseMoniteDark);
