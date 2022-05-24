import { useState, useCallback } from 'react';

import { ApprovalPoliciesTable } from '@/components/approvalPolicies/ApprovalPoliciesTable';
import { Dialog } from '@/components/Dialog';
import { PageHeader } from '@/components/PageHeader';
import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ApprovalPolicyResource } from '@monite/sdk-api';
import { Box, Button } from '@mui/material';

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

  return (
    <MoniteStyleProvider>
      <PageHeader
        title={t(i18n)`Approval Policies`}
        extra={
          <Box>
            <Button id="create" variant="contained" onClick={onCreateClick}>{t(
              i18n
            )`Create`}</Button>
          </Box>
        }
      />
      <ApprovalPoliciesTable onRowClick={onRowClick} />
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
