import { useState, useCallback } from 'react';

import { ApprovalPoliciesTable } from '@/components/approvalPolicies/ApprovalPoliciesTable';
import { Dialog } from '@/components/Dialog';
import { PageHeader } from '@/components/PageHeader';
import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
import { useEntityUserByAuthToken } from '@/core/queries';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { AccessRestriction } from '@/ui/accessRestriction';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ActionEnum, ApprovalPolicyResource } from '@monite/sdk-api';
import { Box, Button, CircularProgress } from '@mui/material';

import { ApprovalPolicyDetails } from './ApprovalPolicyDetails';

/**
 * ApprovalPolicies component
 *
 * This component renders the approval policies page. It includes a table of approval policies, a dialog for creating new approval policies,
 * and a header with a button for opening the create dialog.
 */
export const ApprovalPolicies = () => {
  const { i18n } = useLingui();
  const [selectedApprovalPolicyId, setSelectedApprovalPolicyId] = useState<
    string | undefined
  >(undefined);
  const [isCreateDialogOpened, setIsCreateDialogOpened] =
    useState<boolean>(false);

  const onRowClick = useCallback((approvalPolicy: ApprovalPolicyResource) => {
    setSelectedApprovalPolicyId(approvalPolicy.id);
    setIsCreateDialogOpened(true);
  }, []);

  const onCreateClick = useCallback(() => {
    setIsCreateDialogOpened(true);
    setSelectedApprovalPolicyId(undefined);
  }, []);

  const { data: user } = useEntityUserByAuthToken();
  const { data: isReadAllowed, isInitialLoading: isReadAllowedLoading } =
    useIsActionAllowed({
      method: 'approval_policy',
      action: ActionEnum.READ,
      entityUserId: user?.id,
    });
  const { data: isCreateAllowed, isInitialLoading: isCreateAllowedLoading } =
    useIsActionAllowed({
      method: 'approval_policy',
      action: ActionEnum.CREATE,
      entityUserId: user?.id,
    });

  return (
    <MoniteStyleProvider>
      <PageHeader
        title={
          <>
            {t(i18n)`Approval Policies`}
            {(isReadAllowedLoading || isCreateAllowedLoading) && (
              <CircularProgress size="0.7em" color="secondary" sx={{ ml: 1 }} />
            )}
          </>
        }
        extra={
          <Box>
            <Button
              id="create"
              variant="contained"
              disabled={!isCreateAllowed}
              onClick={onCreateClick}
            >{t(i18n)`Create`}</Button>
          </Box>
        }
      />

      {!isReadAllowed && !isReadAllowedLoading && <AccessRestriction />}
      {isReadAllowed && <ApprovalPoliciesTable onRowClick={onRowClick} />}

      <Dialog
        open={isCreateDialogOpened}
        alignDialog="right"
        onClose={() => setIsCreateDialogOpened(false)}
      >
        <ApprovalPolicyDetails
          id={selectedApprovalPolicyId}
          onCreated={() => setIsCreateDialogOpened(false)}
        />
      </Dialog>
    </MoniteStyleProvider>
  );
};
