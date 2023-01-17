import { rest } from 'msw';
import {
  WORKFLOWS_ENDPOINT,
  WorkflowsPaginationResponse,
} from '@team-monite/sdk-api';
import { workflowsListFixture } from './workflowsFixture';

export const workflowsHandlers = [
  rest.get<undefined, {}, WorkflowsPaginationResponse>(
    WORKFLOWS_ENDPOINT,
    (_, res, ctx) =>
      res(
        ctx.json(workflowsListFixture as unknown as WorkflowsPaginationResponse)
      )
  ),
];
