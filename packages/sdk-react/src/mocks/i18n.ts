import { i18n } from '@lingui/core';

import { messages as enMessages } from '../core/i18n/locales/en/messages';

i18n.loadAndActivate({
  locale: 'en',
  locales: ['en'],
  messages: enMessages,
});

// eslint-disable-next-line import/no-default-export
export default i18n;
