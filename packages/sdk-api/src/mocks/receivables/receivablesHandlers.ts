import { rest } from 'msw';

import {
  ErrorSchemaResponse,
  ReceivablePaginationResponse,
  ReceivableResponse,
} from '../../api';
import { RECEIVABLES_ENDPOINT } from '../../api/services/ReceivableService';
import { receivablesFixture } from './receivablesFixture';

const receivablePath = `*/${RECEIVABLES_ENDPOINT}`;
const receivableDetailPath = `*/${RECEIVABLES_ENDPOINT}/:receivableId`;

const failedReceivableIdRequests = new Map<string, boolean>();

export const receivablesHandlers = [
  /** Get all receivables */
  rest.get<undefined, {}, ReceivablePaginationResponse | ErrorSchemaResponse>(
    receivablePath,
    (_, res, ctx) => {
      return res(ctx.json(receivablesFixture));
    }
  ),

  /** Get receivable by id */
  rest.get<
    undefined,
    { receivableId: string },
    ReceivableResponse | ErrorSchemaResponse
  >(receivableDetailPath, ({ params }, res, ctx) => {
    if (!params.receivableId) return res(ctx.status(404));

    /** Emulate token expiration logic */
    if (
      params.receivableId.includes('token_expired') &&
      !failedReceivableIdRequests.get(params.receivableId)
    ) {
      failedReceivableIdRequests.set(params.receivableId, true);

      return res(
        ctx.status(400),
        ctx.json({
          error: {
            message: 'The token has been revoked, expired or not found.',
          },
        })
      );
    } else {
      /** Clear `faildReceivableByIdIteration` on each success request */
      failedReceivableIdRequests.delete(params.receivableId);
    }

    if (params.receivableId === 'token_expired_permanently') {
      return res(
        ctx.status(400),
        ctx.json({
          error: {
            message: 'The token has been revoked, expired or not found.',
          },
        })
      );
    }

    return res(ctx.json(receivablesFixture.data[0]));
  }),
];
