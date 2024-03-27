import { toast } from 'react-hot-toast';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import {
  ApiError,
  ApprovalPoliciesGetAllRequest,
  ApprovalPolicyResource,
  ApprovalPolicyResourceList,
  ApprovalPolicyCreate,
  ApprovalPolicyUpdate,
} from '@monite/sdk-api';
import { useMutation } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';

import { useEntityListCache } from './hooks';

const APPROVAL_POLICIES_QUERY_ID = 'approval_policies';

const useApprovalPoliciesListCache = () =>
  useEntityListCache<ApprovalPolicyResource>(() => [
    APPROVAL_POLICIES_QUERY_ID,
  ]);

export const useApprovalPoliciesList = (
  params: ApprovalPoliciesGetAllRequest
) => {
  const { monite } = useMoniteContext();

  return useQuery<ApprovalPolicyResourceList, ApiError>(
    [APPROVAL_POLICIES_QUERY_ID, { variables: params }],
    () => monite.api.approvalPolicies.getAll(params)
  );
};

export const useApprovalPolicyById = (approvalPolicyId?: string) => {
  const { monite } = useMoniteContext();

  return useQuery<ApprovalPolicyResource | undefined, ApiError>(
    [APPROVAL_POLICIES_QUERY_ID, { approvalPolicyId }],
    () => {
      if (!approvalPolicyId) {
        throw new Error('Approval policy id is not provided');
      }
      return monite.api.approvalPolicies.getById(approvalPolicyId);
    },
    {
      enabled: !!approvalPolicyId,
    }
  );
};

export const useCreateApprovalPolicy = () => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { invalidate } = useApprovalPoliciesListCache();

  return useMutation<ApprovalPolicyResource, ApiError, ApprovalPolicyCreate>(
    (args) => monite.api.approvalPolicies.create(args),
    {
      onSuccess: () => {
        invalidate();
        toast.success(t(i18n)`Approval policy created`);
      },
      onError: async (error) => {
        toast.error(t(i18n)`Error creating approval policy`);
      },
    }
  );
};

export const useUpdateApprovalPolicy = () => {
  const { i18n } = useLingui();
  const { monite } = useMoniteContext();
  const { invalidate } = useApprovalPoliciesListCache();

  return useMutation<
    ApprovalPolicyResource,
    ApiError,
    { approvalPolicyId: string; body: ApprovalPolicyUpdate }
  >(
    ({ approvalPolicyId, body }) =>
      monite.api.approvalPolicies.update(approvalPolicyId, body),
    {
      onSuccess: () => {
        invalidate();
        toast.success(t(i18n)`Approval policy updated`);
      },
      onError: async (error) => {
        toast.error(t(i18n)`Error updating approval policy`);
      },
    }
  );
};
