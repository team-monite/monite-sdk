import React from 'react';
import {
  Title,
  Subtitle,
  Description,
  Primary,
  Stories,
  ArgsTable,
  PRIMARY_STORY,
} from '@storybook/addon-docs';
import { merge } from 'lodash';
import { Global } from '@emotion/react';

import ThemeProvider from '../src/core/ThemeProvider';
import { THEMES, tokenizedTheme } from '../src';
import { getStyles } from '../src';

export const parameters = {
  viewMode: 'story',
  options: {
    storySort: {
      order: [
        'Welcome',
        'Changelog',
        'DesignSystem',
        ['Colors', 'Unicons', 'Status of Components'],
        'Layout',
        'Navigation',
        'Data Display',
        'Data Input',
      ],
    },
  },
  actions: { argTypesRegex: '^on[A-Z].*' },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
    hideNoControlsWarning: true,
  },
  docs: {
    page: () => (
      <>
        <Title />
        <Subtitle />
        <Description />
        <Primary />
        <ArgsTable story={PRIMARY_STORY} />
        <Stories />
      </>
    ),
  },
};

export const decorators = [
  (Story) => {
    const theme = merge(
      THEMES.default,
      tokenizedTheme,
      {} // custom theme
    );

    return (
      <ThemeProvider theme={theme}>
        <Global styles={getStyles(theme)} />
        <Story />
      </ThemeProvider>
    );
  },
];
