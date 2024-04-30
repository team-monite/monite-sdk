import { forwardRef } from 'react';

import { ShadowDomPortal } from '@/components/ShadowDomPortal';
import { Menu as MuiMenu, MenuProps } from '@mui/material';

export const Menu = forwardRef<HTMLDivElement, MenuProps>(function Menu(
  props,
  ref
) {
  return (
    <ShadowDomPortal disablePortal={props.disablePortal}>
      {/* eslint-disable-next-line @team-monite/mui-require-container-property */}
      <MuiMenu
        ref={ref}
        {...props}
        disablePortal={props.disablePortal ?? true}
      />
    </ShadowDomPortal>
  );
});
