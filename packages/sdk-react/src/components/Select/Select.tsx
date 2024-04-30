import { ForwardedRef, forwardRef, Ref } from 'react';

import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { useRootElements } from '@/core/context/RootElementsProvider';
import { Select as MuiSelect, type SelectProps } from '@mui/material';

export const Select = forwardRef(MoniteSelect) as <T>(
  props: SelectProps<T> & { ref?: ForwardedRef<HTMLDivElement> }
) => ReturnType<typeof MoniteSelect>; // Why is the type assertion used for? See https://fettblog.eu/typescript-react-generic-forward-refs/#option-1%3A-type-assertion

function MoniteSelect<Value>(
  props: SelectProps<Value>,
  ref: Ref<HTMLDivElement>
) {
  const { root } = useRootElements();

  return (
    <MuiSelect
      {...props}
      ref={ref}
      MenuProps={{ container: root, ...props?.MenuProps }}
      classes={{
        root: [ScopedCssBaselineContainerClassName, props?.classes?.root]
          .filter(Boolean)
          .join(' '),
      }}
    />
  );
}
