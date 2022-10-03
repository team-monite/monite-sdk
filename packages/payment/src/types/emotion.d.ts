import '@emotion/react';
import { Theme as UITheme } from '@team-monite/ui-widgets-react';

declare module '@emotion/react' {
  export interface Theme extends UITheme {}
}
