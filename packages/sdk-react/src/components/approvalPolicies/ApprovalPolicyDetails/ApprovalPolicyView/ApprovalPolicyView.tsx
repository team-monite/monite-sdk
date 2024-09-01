import React, { ReactNode } from 'react';
import { toast } from 'react-hot-toast';

import { components } from '@/api';
import { useDialog } from '@/components';
import { useApprovalPolicyScript } from '@/components/approvalPolicies/useApprovalPolicyScript';
import {
  Triggers,
  useApprovalPolicyTrigger,
} from '@/components/approvalPolicies/useApprovalPolicyTrigger';
import { getCounterpartName } from '@/components/counterparts/helpers';
import { useMoniteContext } from '@/core/context/MoniteContext';
import { t, Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import CloseIcon from '@mui/icons-material/Close';
import {
  Box,
  Button,
  Chip,
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

import { Role } from './Role';
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
  const { api, queryClient } = useMoniteContext();
  const { triggers, getTriggerLabel, getAmountLabel } =
    useApprovalPolicyTrigger({
      approvalPolicy,
    });
  const { rules, getRuleLabel } = useApprovalPolicyScript({ approvalPolicy });
  const { data: tagsForTriggers } = api.tags.getTags.useQuery(
    {
      query: {
        id__in: Array.isArray(triggers?.tags) ? triggers.tags : [],
      },
    },
    {
      enabled: Boolean(triggers?.tags?.length),
    }
  );
  const { data: counterpartsForTriggers } =
    api.counterparts.getCounterparts.useQuery(
      {
        query: {
          id__in: Array.isArray(triggers?.counterpart_id)
            ? triggers.counterpart_id
            : [],
        },
      },
      {
        enabled: Boolean(triggers?.counterpart_id?.length),
      }
    );
  const deleteMutation =
    api.approvalPolicies.deleteApprovalPoliciesId.useMutation(undefined, {
      onSuccess: async () => {
        await Promise.all([
          api.approvalPolicies.getApprovalPolicies.invalidateQueries(
            queryClient
          ),
          api.approvalPolicies.getApprovalPoliciesId.invalidateQueries(
            { parameters: { path: { approval_policy_id: approvalPolicy.id } } },
            queryClient
          ),
        ]);
        toast.success(t(i18n)`Approval policy has been deleted`);
      },
    });

  const triggersList = (Object.keys(triggers) as Array<keyof Triggers>).map(
    (triggerKey) => {
      const triggerLabel = getTriggerLabel(triggerKey);
      let triggerValue: ReactNode;

      switch (triggerKey) {
        case 'was_created_by_user_id':
          if (Array.isArray(triggers[triggerKey])) {
            triggerValue = (
              <Stack direction="row" gap={1} sx={{ flexWrap: 'wrap' }}>
                {triggers[triggerKey].map((userId) => (
                  <User key={userId} userId={userId} />
                ))}
              </Stack>
            );
          }
          break;
        case 'tags':
          triggerValue = (
            <Stack direction="row" gap={1} sx={{ flexWrap: 'wrap' }}>
              {tagsForTriggers?.data.map((tag) => (
                <Chip key={tag.id} label={tag.name} />
              ))}
            </Stack>
          );
          break;
        case 'counterpart_id':
          triggerValue = (
            <Stack direction="row" gap={1} sx={{ flexWrap: 'wrap' }}>
              {counterpartsForTriggers?.data.map((counterpart) => (
                <Chip
                  key={counterpart.id}
                  label={getCounterpartName(counterpart)}
                />
              ))}
            </Stack>
          );
          break;
        case 'amount':
          triggerValue = (
            <p>
              {getAmountLabel(
                triggers.amount?.value ?? [],
                triggers.amount?.currency ?? 'EUR'
              )}
            </p>
          );
          break;
        default:
          triggerValue = triggerKey;
          break;
      }

      return {
        label: triggerLabel,
        value: triggerValue,
      };
    }
  );

  const approvalFlows = rules?.map((rule) => {
    if (rule) {
      switch (rule.type) {
        case 'single_user':
          return {
            label: getRuleLabel(rule),
            value: <User userId={rule.userId} />,
          };
        case 'users_from_list':
          return {
            label: getRuleLabel(rule),
            value: (
              <Stack direction="row" gap={1} sx={{ flexWrap: 'wrap' }}>
                {rule.userIds.map((userId) => (
                  <User key={userId} userId={userId} />
                ))}
              </Stack>
            ),
          };
        case 'roles_from_list':
          return {
            label: getRuleLabel(rule),
            value: (
              <Stack direction="row" gap={1} sx={{ flexWrap: 'wrap' }}>
                {rule.roleIds.map((roleId) => (
                  <Role key={roleId} userId={roleId} />
                ))}
              </Stack>
            ),
          };
        case 'approval_chain':
          return {
            label: getRuleLabel(rule),
            value: (
              <Stack direction="row" gap={1} sx={{ flexWrap: 'wrap' }}>
                {rule.chainUserIds.map((userId) => (
                  <User key={userId} userId={userId} />
                ))}
              </Stack>
            ),
          };
      }
    }
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
                  <TableRow key={approvalFlow?.label}>
                    <TableCell>{approvalFlow?.label}</TableCell>
                    <TableCell>{approvalFlow?.value}</TableCell>
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
      <DialogActions sx={{ justifyContent: 'space-between' }}>
        <Button
          variant="outlined"
          color="error"
          disabled={deleteMutation.isPending}
          onClick={(e) => {
            e.preventDefault();

            deleteMutation.mutate(
              { path: { approval_policy_id: approvalPolicy.id } },
              {
                onSuccess: () => {
                  dialogContext?.onClose?.();
                },
              }
            );
          }}
        >
          {t(i18n)`Delete`}
        </Button>
        <Button variant="outlined" onClick={() => setIsEdit(true)}>
          {t(i18n)`Edit`}
        </Button>
      </DialogActions>
    </>
  );
};
