import React from 'react';

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
    action?: ApprovalRequestsTableRowAction;
  }) => void;
  isApprovePending?: boolean;
  isRejectPending?: boolean;
}

export const useApprovalRequestActionsCell = (
  props: UseApprovalRequestActionsCellProps | {}
): GridBaseColDef | undefined => {
  const { i18n } = useLingui();
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
            <IconButton
              aria-label={t(i18n)`Approve request`}
              color="success"
              disabled={props.isApprovePending}
              onClick={(event) => {
                event.preventDefault();

                props.onRowActionClick({
                  id: params.row.id,
                  action: 'approve',
                });
              }}
            >
              <CheckCircleOutlineRoundedIcon />
            </IconButton>
            <IconButton
              aria-label={t(i18n)`Reject request`}
              color="error"
              disabled={props.isRejectPending}
              onClick={(event) => {
                event.preventDefault();

                props.onRowActionClick({
                  id: params.row.id,
                  action: 'reject',
                });
              }}
            >
              <HighlightOffRoundedIcon />
            </IconButton>
          </Stack>
        );
      }
    },
  };
};
