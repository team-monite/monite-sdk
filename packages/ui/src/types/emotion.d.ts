import '@emotion/react';

import type { Theme as ITheme } from '.';

declare module '@emotion/react' {
  export interface Theme extends ITheme {}
}
