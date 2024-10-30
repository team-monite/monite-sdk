import { http, HttpResponse } from 'msw';

import {
  ErrorSchemaResponse,
  ReceivablePaginationResponse,
  ReceivableResponse,
} from '../../old-api';
import { RECEIVABLES_ENDPOINT } from '../../old-api/services/ReceivableService';
import { receivablesFixture } from './receivablesFixture';

const receivablePath = `*/${RECEIVABLES_ENDPOINT}`;
const receivableDetailPath = `*/${RECEIVABLES_ENDPOINT}/:receivableId`;

const failedReceivableIdRequests = new Map<string, boolean>();

export const receivablesHandlers = [
  /** Get all receivables */
  http.get<{}, undefined, ReceivablePaginationResponse | ErrorSchemaResponse>(
    receivablePath,
    () => {
      return HttpResponse.json(receivablesFixture);
    }
  ),

  /** Get receivable by id */
  http.get<
    { receivableId: string },
    undefined,
    ReceivableResponse | ErrorSchemaResponse
  >(receivableDetailPath, ({ params }) => {
    if (!params.receivableId)
      return HttpResponse.json(undefined, { status: 400 });

    /** Emulate token expiration logic */
    if (
      params.receivableId.includes('token_expired') &&
      !failedReceivableIdRequests.get(params.receivableId)
    ) {
      failedReceivableIdRequests.set(params.receivableId, true);

      return HttpResponse.json(
        {
          error: {
            message: 'The token has been revoked, expired or not found.',
          },
        },
        {
          status: 400,
        }
      );
    } else {
      /** Clear `faildReceivableByIdIteration` on each success request */
      failedReceivableIdRequests.delete(params.receivableId);
    }

    if (params.receivableId === 'token_expired_permanently') {
      return HttpResponse.json(
        {
          error: {
            message: 'The token has been revoked, expired or not found.',
          },
        },
        {
          status: 400,
        }
      );
    }

    return HttpResponse.json(receivablesFixture.data[0]);
  }),
];
