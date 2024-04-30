import { GlobalStyles } from '@mui/material';

/**
 * The class name of the container that uses the `ContainerCssBaseline` component.
 * Should be used in the "root" `className` of the components that need to be styled
 * with the styles to support light/dark mode and baseline styles.
 */
export const ScopedCssBaselineContainerClassName =
  // eslint-disable-next-line lingui/no-unlocalized-strings
  'Monite-ContainerCssBaseline';

/**
 * Global styles for the container with the class name of the variable `ScopedCssBaselineContainerClassName`.
 */
export function ContainerCssBaseline({ enableColorScheme = false }) {
  return (
    <GlobalStyles
      styles={(theme) => ({
        [`.${ScopedCssBaselineContainerClassName}`]: {
          // "html" styles https://github.com/mui/material-ui/blob/16cb18aac4e9311f1862ddc16f77e3c61f77e7c4/packages/mui-material/src/CssBaseline/CssBaseline.js#L7
          WebkitFontSmoothing: 'antialiased', // Antialiasing.
          MozOsxFontSmoothing: 'grayscale', // Antialiasing.
          // Change from `box-sizing: content-box` so that `width`
          // is not affected by `padding` or `border`.
          boxSizing: 'border-box',
          // Fix font resize problem in iOS
          WebkitTextSizeAdjust: '100%',
          // When used under CssVarsProvider, colorScheme should not be applied dynamically because it will generate the stylesheet twice for server-rendered applications.
          ...(enableColorScheme && { colorScheme: theme.palette.mode }),

          // "body" styles https://github.com/mui/material-ui/blob/16cb18aac4e9311f1862ddc16f77e3c61f77e7c4/packages/mui-material/src/CssBaseline/CssBaseline.js#L19C14-L19C18
          color: theme.palette.text.primary,
          // Text default styles
          ...theme.typography.body1,
        },
      })}
    />
  );
}
