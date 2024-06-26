import React from 'react';
import { toast } from 'react-hot-toast';

import { useMoniteContext } from '@/core/context/MoniteContext';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import { IconButton } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';

interface ApproveButtonProps {
  approvalRequestId: string;
}

export const ApproveButton = ({ approvalRequestId }: ApproveButtonProps) => {
  const { api } = useMoniteContext();
  const queryClient = useQueryClient();
  const { i18n } = useLingui();

  const approveRequestMutation =
    api.approvalRequests.postApprovalRequestsIdApprove.useMutation(
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
      aria-label={t(i18n)`Approve request`}
      color="success"
      disabled={approveRequestMutation.isPending}
      onClick={(event) => {
        event.preventDefault();

        approveRequestMutation.mutate(undefined, {
          onSuccess: () => {
            toast.success(t(i18n)`Request was approved`);
          },
        });
      }}
    >
      <CheckCircleOutlineRoundedIcon />
    </IconButton>
  );
};
