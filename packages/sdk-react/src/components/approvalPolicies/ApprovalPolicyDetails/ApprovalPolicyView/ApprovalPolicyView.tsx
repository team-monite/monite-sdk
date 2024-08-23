import { ReactNode } from 'react';

import { components } from '@/api';
import { useDialog } from '@/components';
import { useApprovalPolicyScript } from '@/components/approvalPolicies/useApprovalPolicyScript';
import { useApprovalPolicyTrigger } from '@/components/approvalPolicies/useApprovalPolicyTrigger';
import { MoniteCard } from '@/ui/Card/Card';
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

  const approvalFlow = (() => {
    if (!script) return null;

    let approvalFlowLabel: string;
    let approvalFlowValue: ReactNode;

    switch (script.type) {
      case 'ApprovalRequests.request_approval_by_users': {
        approvalFlowLabel =
          script.params.required_approval_count > 1
            ? t(
                i18n
              )`Any ${script.params.required_approval_count} users from the list`
            : t(i18n)`Any user from the list`;
        approvalFlowValue = (
          <Stack gap={1}>
            {script.params.user_ids.map((userId) => (
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

    return {
      label: approvalFlowLabel,
      value: approvalFlowValue,
    };
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
        {triggersList.length > 0 ? (
          <MoniteCard items={triggersList} />
        ) : (
          t(i18n)`No conditions`
        )}
        <Typography variant="h5" mt={4} mb={1}>
          {t(i18n)`Approval flow`}
        </Typography>
        <Typography variant="body1" mb={1}>
          {t(i18n)`Who needs to approve the document and how:`}
        </Typography>
        {approvalFlow ? (
          <MoniteCard items={[approvalFlow]} />
        ) : (
          t(i18n)`No approval flow`
        )}
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
