import { create } from '@storybook/theming';
import { THEMES } from '@monite/ui';
import Logo from './monite_logo.svg';

export default create({
  base: 'light',
  brandTitle: 'Monite UI Components',
  brandImage: Logo,
  brandTarget: '_self',

  colorPrimary: THEMES.default.colors.primary,
  colorSecondary: THEMES.default.colors.primaryDarker,
});
