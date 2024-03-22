import React from 'react';

import { useDialog } from '@/components';
import { MoniteStyleProvider } from '@/core/context/MoniteProvider';
import { useIsActionAllowed } from '@/core/queries/usePermissions';
import { ActionEnum } from '@/utils/types';
import { t } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { ApprovalPolicyResource } from '@monite/sdk-api';
import CloseIcon from '@mui/icons-material/Close';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Link,
  Typography,
  Paper,
  useTheme,
} from '@mui/material';

export interface IExistingApprovalPolicyDetailsProps {
  /** Approval policy to be displayed */
  approvalPolicy: ApprovalPolicyResource;

  /** Set the edit mode
   *
   * @param isEdit
   */
  onChangeEditMode: (isEdit: boolean) => void;
}

export const ExistingApprovalPolicyDetails = ({
  approvalPolicy,
  onChangeEditMode,
}: IExistingApprovalPolicyDetailsProps) => {
  const { i18n } = useLingui();
  const dialogContext = useDialog();
  const { palette } = useTheme();

  const { data: isUpdateAllowed } = useIsActionAllowed({
    method: 'approval_policy',
    action: ActionEnum.UPDATE,
    entityUserId: approvalPolicy?.created_by,
  });

  return (
    <MoniteStyleProvider>
      <DialogTitle>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          gap={2}
        >
          <Typography variant="h3" sx={{ wordBreak: 'break-word' }}>
            {approvalPolicy?.name}
          </Typography>
          {dialogContext?.isDialogContent && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={dialogContext.onClose}
              aria-label={t(i18n)`Close approval policy details`}
            >
              <CloseIcon />
            </IconButton>
          )}
        </Box>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <Typography variant="subtitle2" mt={2} mb={1}>
          {t(i18n)`Description`}
        </Typography>
        {approvalPolicy?.description && (
          <Typography variant="body1">{approvalPolicy.description}</Typography>
        )}
        <Typography
          variant="subtitle2"
          mt={4}
          mb={1}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {t(i18n)`Trigger in Monite Script`}
          <Link
            underline="none"
            rel="noopener noreferrer"
            href="https://docs.monite.com/docs/monitescript#trigger"
            target="_blank"
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {t(i18n)`Go to Docs`}
            &nbsp;
            <OpenInNewIcon />
          </Link>
        </Typography>
        <Paper
          elevation={0}
          sx={{
            height: 400,
            padding: 2,
            backgroundColor: palette.grey[50],
            overflow: 'auto',
          }}
        >
          <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
            <pre>
              {approvalPolicy?.trigger &&
                JSON.stringify(approvalPolicy.trigger, null, 2)}
            </pre>
          </Typography>
        </Paper>
        <Typography
          variant="subtitle2"
          mt={4}
          mb={1}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          {t(i18n)`Script in Monite Script`}
          <Link
            underline="none"
            rel="noopener noreferrer"
            href="https://docs.monite.com/docs/monitescript#script"
            target="_blank"
            sx={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            {t(i18n)`Go to Docs`}
            &nbsp;
            <OpenInNewIcon />
          </Link>
        </Typography>
        <Paper
          elevation={0}
          sx={{
            height: 400,
            padding: 2,
            backgroundColor: palette.grey[50],
            overflow: 'auto',
          }}
        >
          <Typography variant="body1" sx={{ fontFamily: 'monospace' }}>
            <pre>
              {approvalPolicy?.script &&
                JSON.stringify(approvalPolicy.script, null, 2)}
            </pre>
          </Typography>
        </Paper>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button
          onClick={() => onChangeEditMode(true)}
          disabled={!isUpdateAllowed}
        >
          <EditOutlinedIcon sx={{ mr: 1 }} />
          {t(i18n)`Edit`}
        </Button>
      </DialogActions>
    </MoniteStyleProvider>
  );
};
