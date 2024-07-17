import React from 'react';
import { toast } from 'react-hot-toast';

import { PageHeader } from '@/components';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { CircularProgress } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

import { ApprovalRequestsTable } from './ApprovalRequestsTable';

export const ApprovalRequests = () => (
  <MoniteScopedProviders>
    <ApprovalRequestsBase />
  </MoniteScopedProviders>
);

const ApprovalRequestsBase = () => {
  const { i18n } = useLingui();
  const { api } = useMoniteContext();
  const queryClient = useQueryClient();

  const { data: user } = useEntityUserByAuthToken();

  const { data: isReadAllowed, isLoading: isReadAllowedLoading } =
    useIsActionAllowed({
      method: 'approval_request',
      action: 'read',
      entityUserId: user?.id,
    });

  const approveRequestMutation =
    api.approvalRequests.postApprovalRequestsIdApprove.useMutation();
  const rejectRequestMutation =
    api.approvalRequests.postApprovalRequestsIdReject.useMutation();

  const onApprove = (approvalRequestId: string) =>
    approveRequestMutation.mutateAsync(
      {
        body: undefined,
        path: {
          approval_request_id: approvalRequestId,
        },
      },
      {
        onSuccess: () => {
          toast.success(t(i18n)`Request was approved`);

          return api.approvalRequests.getApprovalRequests.invalidateQueries(
            queryClient
          );
        },
      }
    );

  const onReject = (approvalRequestId: string) =>
    rejectRequestMutation.mutateAsync(
      {
        body: undefined,
        path: {
          approval_request_id: approvalRequestId,
        },
      },
      {
        onSuccess: () => {
          toast.success(t(i18n)`Request was rejected`);

          return api.approvalRequests.getApprovalRequests.invalidateQueries(
            queryClient
          );
        },
      }
    );

  return (
    <>
      <PageHeader
        title={
          <>
            {t(i18n)`Approval Requests`}
            {isReadAllowedLoading && (
              <CircularProgress size="0.7em" color="secondary" sx={{ ml: 1 }} />
            )}
          </>
        }
      />
      {!isReadAllowedLoading && !isReadAllowed && <AccessRestriction />}
      {isReadAllowed && (
        <ApprovalRequestsTable
          onRowActionClick={({ id, action }) => {
            switch (action) {
              case 'approve':
                return onApprove(id);
              case 'reject':
                return onReject(id);
              default:
                break;
            }
          }}
        />
      )}
    </>
  );
};
