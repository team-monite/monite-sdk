import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import { MoniteTheme } from '@/core/context/MoniteContext';
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
export const createThemeWithDefaults = (theme: ThemeConfig = {}): MoniteTheme => {
  const themeOptions = getTheme(theme);
  const customStyles = 'customStyles' in themeOptions ? themeOptions.customStyles : undefined;

  const muiTheme = createTheme(
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

  // Add custom styles back to the theme in components.styles
  // This way MUI won't try to process it, but it will be available on the theme object
  return Object.assign(muiTheme, {
    components: {
      ...muiTheme.components,
      styles: customStyles,
    },
  }) as MoniteTheme;
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
