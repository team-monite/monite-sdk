import { useQuery } from 'react-query';
import {
  WorkflowsService,
  WorkflowsPaginationResponse,
  ApiError,
} from '@team-monite/sdk-api';
import { useComponentsContext } from '../context/ComponentsContext';
import { toast } from 'react-hot-toast';

export const WORKFLOW_QUERY_ID = 'workflow';

export const useWorkflowsList = (
  ...args: Parameters<WorkflowsService['getList']>
) => {
  const { monite } = useComponentsContext();

  return useQuery<WorkflowsPaginationResponse, ApiError>(
    [WORKFLOW_QUERY_ID, { variables: args }],
    () => monite.api.workflows.getList(...args),
    {
      onError: (error) => {
        toast.error(error.body.error.message || error.message);
      },
    }
  );
};
