import React from 'react';
import {
  Title,
  Subtitle,
  Description,
  Primary,
  Stories,
} from '@storybook/addon-docs';
import { ThemeProvider } from 'emotion-theming';

import '../../app/src/assets/fonts/Faktum/font.css';
import './main.css';

import { THEMES } from '../src';

export const parameters = {
  // argTypes: {
  //   color: { control: 'select', options: ['primary', 'secondary'] },
  //   text: { table: { disable: true } },
  // },
  viewMode: 'docs',
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
        {/*<ArgsTable story={PRIMARY_STORY} />*/}
        <Stories />
      </>
    ),
  },
};

export const decorators = [
  (Story) => (
    <ThemeProvider theme={THEMES.default}>
      <Story />
    </ThemeProvider>
  ),
];
