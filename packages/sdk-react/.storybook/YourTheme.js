import { create } from '@storybook/theming';

import Logo from './monite_logo.svg';

export default create({
  base: 'light',
  brandTitle: 'Monite UI Components',
  brandImage: Logo,
  brandTarget: '_self',

  colorPrimary: '#246FFF',
  colorSecondary: '#1D59CC',
});
