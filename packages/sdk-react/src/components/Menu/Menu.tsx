import { forwardRef } from 'react';

import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { Menu as MuiMenu, MenuProps } from '@mui/material';

export const Menu = forwardRef<HTMLDivElement, MenuProps>(function MoniteMenu(
  props,
  ref
) {
  const { root } = useRootElements();

  return (
    <MuiMenu
      ref={ref}
      container={root}
      classes={{
        ...props?.classes,
        root: [ScopedCssBaselineContainerClassName, props?.classes?.root]
          .filter(Boolean)
          .join(' '),
      }}
      {...props}
    />
  );
});
