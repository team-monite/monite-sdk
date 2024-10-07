import { ScopedCssBaselineContainerClassName } from '@/components/ContainerCssBaseline';
import type { I18n } from '@lingui/core';
import { t } from '@lingui/macro';
import {
  createTheme,
  type Theme,
  type ThemeOptions,
  type Components,
} from '@mui/material';

/**
 * Create a theme with the default component's `defaultProps`
 */
export const createThemeWithDefaults = (
  i18n: I18n,
  theme: Theme | ThemeOptions | undefined
) =>
  createTheme(
    {
      components: {
        MoniteReceivablesTable: {
          defaultProps: {
            tabs: [
              {
                label: t(i18n)`Invoices`,
                query: { type: 'invoice' },
              },
              {
                label: t(i18n)`Quotes`,
                query: { type: 'quote' },
              },
              {
                label: t(i18n)`Credit notes`,
                query: { type: 'credit_note' },
              },
            ],
          },
        },
      },
    } satisfies ThemeOptions,
    theme ?? {},
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
