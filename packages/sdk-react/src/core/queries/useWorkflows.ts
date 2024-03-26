import { ApiError } from '@monite/sdk-api';
import { useQuery } from '@tanstack/react-query';

export const WORKFLOW_QUERY_ID = 'workflow';

export const useWorkflowsList = (...args: any): any => {
  return useQuery<undefined, ApiError>(
    [WORKFLOW_QUERY_ID],
    () => undefined,
    {}
  );
};
