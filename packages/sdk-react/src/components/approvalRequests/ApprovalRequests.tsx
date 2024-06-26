import React from 'react';

import { PageHeader } from '@/components';
import { ApprovalRequestsTable } from '@/components/approvalRequests/ApprovalRequestsTable';
import { MoniteScopedProviders } from '@/core/context/MoniteScopedProviders';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { ActionEnum } from '@/utils/types';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { CircularProgress } from '@mui/material';

export const ApprovalRequests = () => (
  <MoniteScopedProviders>
    <ApprovalRequestsBase />
  </MoniteScopedProviders>
);

const ApprovalRequestsBase = () => {
  const { i18n } = useLingui();

  const { data: user } = useEntityUserByAuthToken();

  const { data: isReadAllowed, isLoading: isReadAllowedLoading } =
    useIsActionAllowed({
      method: 'approval_request',
      action: ActionEnum.READ,
      entityUserId: user?.id,
    });

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
      {isReadAllowed && <ApprovalRequestsTable />}
    </>
  );
};
