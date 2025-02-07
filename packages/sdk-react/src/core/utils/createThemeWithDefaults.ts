import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { getTheme } from '@/core/theme/mui-monite';
import { ThemeConfig } from '@/core/theme/types';
import {
  createTheme,
  type Theme,
  type Components,
  type ThemeOptions,
} from '@mui/material';

/**
 * Create a theme with the default component's `defaultProps`
 */
export const createThemeWithDefaults = (theme: ThemeConfig = {}) => {
  const themeOptions = getTheme(theme);

  return createTheme(
    themeOptions,
    {
      components: {},
    } satisfies ThemeOptions,
    {
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
    } satisfies ThemeOptions
  );
};

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
