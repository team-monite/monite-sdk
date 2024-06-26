import React from 'react';
import { toast } from 'react-hot-toast';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import { IconButton } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

interface RejectButtonProps {
  approvalRequestId: string;
}

export const RejectButton = (props: RejectButtonProps) => (
  <MoniteScopedProviders>
    <RejectButtonBase {...props} />
  </MoniteScopedProviders>
);

const RejectButtonBase = ({ approvalRequestId }: RejectButtonProps) => {
  const { api } = useMoniteContext();
  const queryClient = useQueryClient();
  const { i18n } = useLingui();

  const rejectRequestMutation =
    api.approvalRequests.postApprovalRequestsIdReject.useMutation(
      {
        path: {
          approval_request_id: approvalRequestId,
        },
      },
      {
        onSuccess: () => {
          return api.approvalRequests.getApprovalRequests.invalidateQueries(
            queryClient
          );
        },
      }
    );

  return (
    <IconButton
      aria-label={t(i18n)`Reject request`}
      color="error"
      disabled={rejectRequestMutation.isPending}
      onClick={(event) => {
        event.preventDefault();

        rejectRequestMutation.mutate(undefined, {
          onSuccess: () => {
            toast.success(t(i18n)`Request was rejected`);
          },
        });
      }}
    >
      <HighlightOffRoundedIcon />
    </IconButton>
  );
};
