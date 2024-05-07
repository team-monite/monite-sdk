import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import {
  createTheme,
  type Theme,
  type ThemeOptions,
  type Components,
} from '@mui/material';

/**
 * Create a theme with default component's `defaultProps`
 */
export const createThemeWithDefaults = (
  theme: Theme | ThemeOptions | undefined
) =>
  createTheme(theme, {
    components: {
      ...createComponentsThemeDefaultProps(
        [
          'MuiMenu',
          'MuiModal',
          'MuiPopper',
          'MuiDialogTitle',
          'MuiDialogContent',
          'MuiDialogActions',
          'MuiDivider',
        ],
        {
          classes: {
            root: ScopedCssBaselineContainerClassName,
          },
        }
      ),
      ...createComponentsThemeDefaultProps(['MuiGrid', 'MuiDialog'], {
        classes: { container: ScopedCssBaselineContainerClassName },
      }),
      MuiStack: {
        defaultProps: {
          className: ScopedCssBaselineContainerClassName,
        },
      },
      MuiAutocomplete: {
        defaultProps: {
          classes: { popper: ScopedCssBaselineContainerClassName },
        },
      },
    },
  });

/**
 * Create a `defaultProps` for the given MUI component list
 */
function createComponentsThemeDefaultProps<
  T,
  Component extends keyof Components<Omit<Theme, 'components'>>
>(componentList: Component[], defaultProps: T) {
  return componentList.reduce<Record<string, { defaultProps: T }>>(
    (acc, key) => {
      acc[key as keyof typeof acc] = { defaultProps };
      return acc;
    },
    {}
  );
}
