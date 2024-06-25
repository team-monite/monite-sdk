import React from 'react';
import { toast } from 'react-hot-toast';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { IconButton } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

interface ApproveButtonProps {
  id: string;
}

export const ApproveButton = (props: ApproveButtonProps) => (
  <MoniteScopedProviders>
    <ApproveButtonBase {...props} />
  </MoniteScopedProviders>
);

const ApproveButtonBase = ({ id }: ApproveButtonProps) => {
  const { api } = useMoniteContext();
  const queryClient = useQueryClient();
  const { i18n } = useLingui();

  const approveRequestMutation =
    api.approvalRequests.postApprovalRequestsIdApprove.useMutation(
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

  const handleApproveRequest = () => {
    approveRequestMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success(t(i18n)`Request was approved`);
      },
    });
  };

  return (
    <IconButton
      aria-label={t(i18n)`Approve request`}
      color="success"
      disabled={approveRequestMutation.isPending}
      onClick={handleApproveRequest}
    >
      <CheckCircleOutlineRoundedIcon />
    </IconButton>
  );
};
