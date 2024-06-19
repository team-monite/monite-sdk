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
  id: string;
}

export const RejectButton = (props: RejectButtonProps) => (
  <MoniteScopedProviders>
    <RejectButtonBase {...props} />
  </MoniteScopedProviders>
);

const RejectButtonBase = ({ id }: RejectButtonProps) => {
  const { api } = useMoniteContext();
  const queryClient = useQueryClient();
  const { i18n } = useLingui();

  const rejectRequestMutation =
    api.approvalRequests.postApprovalRequestsIdReject.useMutation(
      {
        path: {
          approval_request_id: id,
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

  const handleRejectRequest = () => {
    rejectRequestMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(t(i18n)`Request was rejected`);
      },
    });
  };

  return (
    <IconButton
      aria-label="reject"
      color="error"
      disabled={rejectRequestMutation.isPending}
      onClick={handleRejectRequest}
    >
      <HighlightOffRoundedIcon />
    </IconButton>
  );
};
