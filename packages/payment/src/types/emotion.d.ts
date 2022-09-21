import '@emotion/react';
import { Theme as UITheme } from '@monite/ui-widgets-react';

declare module '@emotion/react' {
  export interface Theme extends UITheme {}
}
