import { ReactNode } from 'react';

import { components } from '@/api';
import { useDialog } from '@/components';
import { useApprovalPolicyTrigger } from '@/components/approvalPolicies/useApprovalPolicyTrigger';
import { MoniteCard } from '@/ui/Card/Card';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  DialogTitle,
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
}

export const ApprovalPolicyView = ({
  approvalPolicy,
}: ApprovalPolicyViewProps) => {
  const { i18n } = useLingui();
  const dialogContext = useDialog();
  const { triggerKeys, triggers, getTriggerLabel } = useApprovalPolicyTrigger({
    approvalPolicy,
  });

  const triggersList = Object.keys(triggers).map((triggerKey) => {
    const triggerLabel = getTriggerLabel(triggerKey);
    let triggerValue: ReactNode;

    switch (triggerKey) {
      case 'was_created_by_user_id':
        if (Array.isArray(triggers[triggerKey])) {
          triggerValue = (
            <Stack display="flex" gap={1}>
              {triggers[triggerKey].map((userId) => (
                <User userId={userId} />
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
      </DialogContent>
    </>
  );
};
