import type { components, paths } from '@/api';

import { http, HttpResponse, delay } from 'msw';

import {
  recurrenceFixture,
  recurrenceListFixture,
} from './recurrencesFixtures';

const recurrencesPath: `*${Extract<
  keyof paths,
  '/recurrences'
>}` = `*/recurrences`;

const recurrenceByIdPath = `${recurrencesPath}/:recurrence_id`;

export const recurrencesHandlers = [
  http.get<{}, undefined, components['schemas']['GetAllRecurrences']>(
    recurrencesPath,
    async () => {
      await delay();

      return HttpResponse.json(recurrenceListFixture);
    }
  ),

  http.post<
    {},
    components['schemas']['CreateRecurrencePayload'],
    components['schemas']['Recurrence']
  >(recurrencesPath, async ({ request }) => {
    const payload = await request.json();
    await delay();

    return HttpResponse.json(recurrenceFixture(payload));
  }),

  http.get<
    { recurrence_id: string },
    undefined,
    components['schemas']['Recurrence']
  >(recurrenceByIdPath, async ({ params: { recurrence_id } }) => {
    await delay();

    return HttpResponse.json({
      ...recurrenceFixture(),
      id: recurrence_id,
    });
  }),

  http.patch<
    { recurrence_id: string },
    components['schemas']['UpdateRecurrencePayload'],
    components['schemas']['Recurrence']
  >(recurrenceByIdPath, async ({ request, params: { recurrence_id } }) => {
    const payload = await request.json();

    await delay();

    return HttpResponse.json({
      ...recurrenceFixture(payload),
      id: recurrence_id,
    });
  }),

  http.post<{}, undefined, undefined>(
    `${recurrenceByIdPath}/cancel`,
    async () => {
      await delay();

      return new HttpResponse(undefined, {
        status: 204,
      });
    }
  ),
];
