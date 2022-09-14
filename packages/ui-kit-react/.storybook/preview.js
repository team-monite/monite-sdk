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
import ThemeProvider from '../src/core/ThemeProvider';
import { merge } from 'lodash';

import '@monite/app-white-label/src/assets/fonts/Faktum/font.css';
import './main.css';

import { THEMES, tokenizedTheme } from '../src';

export const parameters = {
  // argTypes: {
  //   color: { control: 'select', options: ['primary', 'secondary'] },
  //   text: { table: { disable: true } },
  // },
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
  (Story) => (
    <ThemeProvider theme={merge(THEMES.default, tokenizedTheme)}>
      <Story />
    </ThemeProvider>
  ),
];
