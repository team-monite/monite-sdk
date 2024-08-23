import { ReactNode } from 'react';

import { components } from '@/api';
import { useDialog } from '@/components';
import { useApprovalPolicyScript } from '@/components/approvalPolicies/useApprovalPolicyScript';
import { useApprovalPolicyTrigger } from '@/components/approvalPolicies/useApprovalPolicyTrigger';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  DialogTitle,
  DialogActions,
  DialogContent,
  Divider,
  IconButton,
  Typography,
  Stack,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from '@mui/material';

import { User } from './User';

interface ApprovalPolicyViewProps {
  /** Approval policy to be displayed */
  approvalPolicy: components['schemas']['ApprovalPolicyResource'];

  /** Callback is fired when Edit button is clicked */
  setIsEdit: (isEdit: boolean) => void;
}

export const ApprovalPolicyView = ({
  approvalPolicy,
  setIsEdit,
}: ApprovalPolicyViewProps) => {
  const { i18n } = useLingui();
  const dialogContext = useDialog();
  const { triggers, getTriggerLabel } = useApprovalPolicyTrigger({
    approvalPolicy,
  });
  const { script } = useApprovalPolicyScript({ approvalPolicy });

  const triggersList = Object.keys(triggers).map((triggerKey) => {
    const triggerLabel = getTriggerLabel(triggerKey);
    let triggerValue: ReactNode;

    switch (triggerKey) {
      case 'was_created_by_user_id':
        if (Array.isArray(triggers[triggerKey])) {
          triggerValue = (
            <Stack gap={1}>
              {triggers[triggerKey].map((userId) => (
                <User key={userId} userId={userId} />
              ))}
            </Stack>
          );
        } else {
          triggerValue = triggerKey;
        }
        break;
      default:
        triggerValue = triggerKey;
        break;
    }

    return {
      label: triggerLabel,
      value: triggerValue,
    };
  });

  const approvalFlows = (() => {
    if (!script) return null;

    let approvalFlowLabel: string;
    let approvalFlowValue: ReactNode;

    switch (script.type) {
      case 'ApprovalRequests.request_approval_by_users': {
        approvalFlowLabel =
          script.params.required_approval_count &&
          (typeof script.params.required_approval_count === 'string'
            ? parseInt(script.params.required_approval_count)
            : script.params.required_approval_count) > 1
            ? t(
                i18n
              )`Any ${script.params.required_approval_count} users from the list`
            : t(i18n)`Any user from the list`;
        approvalFlowValue = (
          <Stack gap={1}>
            {script.params.user_ids?.map((userId) => (
              <User key={userId} userId={userId} />
            ))}
          </Stack>
        );
        break;
      }

      default: {
        approvalFlowLabel = t(i18n)`Unknown`;
        approvalFlowValue = t(i18n)`Unknown`;
        break;
      }
    }

    return [
      {
        label: approvalFlowLabel,
        value: approvalFlowValue,
      },
    ];
  })();

  return (
    <>
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
        <Typography variant="h5" mt={2} mb={1}>
          {t(i18n)`Description`}
        </Typography>
        {approvalPolicy?.description && (
          <Typography variant="body1">{approvalPolicy.description}</Typography>
        )}
        <Typography variant="h5" mt={4} mb={1}>
          {t(i18n)`Conditions`}
        </Typography>
        <Typography variant="body1" mb={1}>
          <Trans>
            Policy will be applied if document matches <strong>ALL</strong> of
            the following conditions:
          </Trans>
        </Typography>
        <Paper variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t(i18n)`Condition`}</TableCell>
                <TableCell>{t(i18n)`Criteria`}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {triggersList.length > 0 ? (
                triggersList.map((trigger) => (
                  <TableRow key={trigger.label}>
                    <TableCell>{trigger.label}</TableCell>
                    <TableCell>{trigger.value}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2}>{t(i18n)`No conditions`}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
        <Typography variant="h5" mt={4} mb={1}>
          {t(i18n)`Approval flow`}
        </Typography>
        <Typography variant="body1" mb={1}>
          {t(i18n)`Who needs to approve the document and how:`}
        </Typography>
        <Paper variant="outlined">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t(i18n)`Approval type`}</TableCell>
                <TableCell>{t(i18n)`Users or Roles`}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {approvalFlows && approvalFlows.length > 0 ? (
                approvalFlows.map((approvalFlow) => (
                  <TableRow key={approvalFlow.label}>
                    <TableCell>{approvalFlow.label}</TableCell>
                    <TableCell>{approvalFlow.value}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2}>{t(i18n)`No rules`}</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Paper>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Button variant="outlined" color="error">{t(i18n)`Delete`}</Button>
        <Button variant="outlined" onClick={() => setIsEdit(true)}>{t(
          i18n
        )`Edit`}</Button>
      </DialogActions>
    </>
  );
};
