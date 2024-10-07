import { components } from '@/api';

import { http, HttpResponse, delay } from 'msw';

import { mailboxesFixture } from './mailboxesFixture';

export const mailboxesHandlers = [
  http.get<{}, {}, components['schemas']['MailboxDataResponse']>(
    '*/mailboxes',
    async () => {
      await delay();

      return HttpResponse.json(mailboxesFixture);
    }
  ),
];
