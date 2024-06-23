'use client';

import { useState } from 'react';

import { components } from '@/api';
import { useEntityUserByAuthToken } from '@/core/queries';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import HighlightOffRoundedIcon from '@mui/icons-material/HighlightOffRounded';
import { Stack } from '@mui/material';
import { IconButton } from '@mui/material';
import { GridBaseColDef } from '@mui/x-data-grid/models/colDef/gridColDef';

type ApprovalRequestsTableRowAction = 'approve' | 'reject';

export interface UseApprovalRequestActionsCellProps {
  /**
   * The event handler for an approval row action.
   * If not provided, the action menu will not be displayed.
   * @param props.id - The identifier of the clicked row, a string.
   * @param props.action - The action to be performed, an `InvoicesTableRowAction`.
   */
  onRowActionClick: (props: {
    id: string;
    action: ApprovalRequestsTableRowAction;
  }) =>
    | Promise<components['schemas']['ApprovalRequestResourceWithMetadata']>
    | undefined;
}

interface ActionButtonProps {
  id: string;
  onClick: UseApprovalRequestActionsCellProps['onRowActionClick'];
}

const ApproveButton = ({ id, onClick }: ActionButtonProps) => {
  const { i18n } = useLingui();
  const [isApprovePending, setIsApprovePending] = useState(false);

  return (
    <IconButton
      aria-label={t(i18n)`Approve request`}
      color="success"
      disabled={isApprovePending}
      onClick={(event) => {
        event.preventDefault();
        setIsApprovePending(true);

        onClick({
          id,
          action: 'approve',
        })?.finally(() => setIsApprovePending(false));
      }}
    >
      <CheckCircleOutlineRoundedIcon />
    </IconButton>
  );
};

const RejectButton = ({ id, onClick }: ActionButtonProps) => {
  const { i18n } = useLingui();
  const [isRejectPending, setIsRejectPending] = useState(false);

  return (
    <IconButton
      aria-label={t(i18n)`Reject request`}
      color="error"
      disabled={isRejectPending}
      onClick={(event) => {
        event.preventDefault();
        setIsRejectPending(true);

        onClick({
          id,
          action: 'reject',
        })?.finally(() => setIsRejectPending(false));
      }}
    >
      <HighlightOffRoundedIcon />
    </IconButton>
  );
};

export const useApprovalRequestActionsCell = (
  props: UseApprovalRequestActionsCellProps | {}
): GridBaseColDef | undefined => {
  const { data: user } = useEntityUserByAuthToken();

  if (!('onRowActionClick' in props && props.onRowActionClick)) return;

  return {
    field: 'actions',
    renderHeader: () => null,
    sortable: false,
    flex: 0.5,
    align: 'right',
    renderCell: (params) => {
      if (
        params.row.status === 'waiting' &&
        user?.id &&
        params.row.user_ids.includes(user.id) &&
        !params.row.approved_by?.includes(user.id)
      ) {
        return (
          <Stack direction="row" spacing={1}>
            <ApproveButton
              id={params.row.id}
              onClick={props.onRowActionClick}
            />
            <RejectButton id={params.row.id} onClick={props.onRowActionClick} />
          </Stack>
        );
      }
    },
  };
};
